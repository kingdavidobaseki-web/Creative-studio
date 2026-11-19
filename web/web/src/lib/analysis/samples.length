import { Analysis, clamp01, percentile } from "./common";
import { computeFeatures } from "./features";
import { estimateTempo } from "./tempo";
import { trackBeats } from "./beats";
import { STEP, toBins } from "./bins";
import { findDrops } from "./drops";
import { findBuildups } from "./buildups";
import { buildSections, suggestCuts } from "./sections";

export async function analyzeAudio(
  samples: Float32Array,
  sampleRate: number,
  onProgress?: (p: number) => void
): Promise<Analysis> {
  const duration = samples.length / sampleRate;
  if (duration < 8) throw new Error("This track is too short. Use at least 8 seconds of audio.");

  const f = await computeFeatures(samples, sampleRate, (p) => onProgress?.(p * 0.85));
  if (Math.max(...Array.from(f.rms)) < -60) throw new Error("This file looks silent.");

  const tempo = estimateTempo(f.onset, f.frameRate);
  const { beats, bpm } = trackBeats(f.onset, f.frameRate, tempo.bpm);
  onProgress?.(0.92);

  const bins = toBins(f, duration);
  const drops = findDrops(bins, f, beats);
  const buildups = findBuildups(bins, drops);
  const sections = buildSections(duration, bins, buildups, drops);
  const cuts = suggestCuts(beats, buildups, drops);

  const lo = percentile(bins.loud, 0.05);
  const hi = percentile(bins.loud, 0.95);
  const energy = bins.loud.map((v) => clamp01((v - lo) / (hi - lo || 1)));
  onProgress?.(1);

  return {
    duration,
    bpm,
    bpmConfidence: tempo.confidence,
    bpmAlternatives: tempo.alternatives,
    beats,
    energyStep: STEP,
    energy,
    buildups,
    drops,
    sections,
    cuts,
  };
}

export function toExportJson(a: Analysis, fileName: string): string {
  const r = (t: number) => Math.round(t * 1000) / 1000;
  return JSON.stringify(
    {
      tool: "AI Creative Studio - Beat & Drop Detector",
      file: fileName,
      note: "BPM and beat times are measured from the audio. Buildup, drop, section and cut labels are estimates.",
      durationSeconds: r(a.duration),
      bpm: a.bpm,
      bpmConfidence: Math.round(a.bpmConfidence * 100) / 100,
      bpmAlternatives: a.bpmAlternatives,
      beats: a.beats.map((b) => r(b.time)),
      drops: a.drops.map((d) => ({ time: r(d.time), confidence: Math.round(d.confidence * 100) / 100, reason: d.reason })),
      buildups: a.buildups.map((b) => ({ start: r(b.start), end: r(b.end), kind: b.kind, reason: b.reason })),
      sections: a.sections.map((s) => ({ label: s.label, start: r(s.start), end: r(s.end) })),
      suggestedCuts: a.cuts.map((c) => ({ time: r(c.time), reason: c.reason })),
    },
    null,
    2
  );
}
