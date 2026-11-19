import { Beat, Drop, clamp01, mean, percentile } from "./common";
import { Bins, STEP, smooth } from "./bins";
import { Features } from "./features";

interface Candidate {
  bin: number;
  score: number;
  jump: number;
  sharp: number;
}

// Look for the low end coming back hard after a quieter stretch.
// Loudness alone is not enough: the bass must jump sharply too.
export function findDrops(bins: Bins, f: Features, beats: Beat[]): Drop[] {
  const bass = smooth(bins.bass);
  const loud = smooth(bins.loud);
  const n = bass.length;
  const typicalBass = percentile(bass, 0.5);
  const found: Candidate[] = [];

  for (let i = 8; i < n - 4; i++) {
    const before = mean(bass, i - 8, i);
    const after = mean(bass, i, i + 4);
    const jump = after - before;
    const sharp = mean(bass, i, i + 2) - mean(bass, i - 2, i);
    const loudJump = mean(loud, i, i + 4) - mean(loud, i - 8, i);
    if (jump < 3 || sharp < 2.5 || after < typicalBass) continue;
    const score = 0.4 * clamp01(jump / 10) + 0.35 * clamp01(sharp / 8) + 0.25 * clamp01(loudJump / 6);
    found.push({ bin: i, score, jump, sharp });
  }

  found.sort((a, b) => b.score - a.score);
  const chosen: Candidate[] = [];
  for (const c of found) {
    if (c.score < 0.3 || chosen.length >= 6) continue;
    if (chosen.every((o) => Math.abs(o.bin - c.bin) * STEP >= 12)) chosen.push(c);
  }

  return chosen
    .sort((a, b) => a.bin - b.bin)
    .map((c) => ({
      time: refine(f, beats, c.bin * STEP),
      confidence: c.score,
      reason: `Low end jumps about ${Math.round(c.jump)} dB, quickly, after a quieter stretch.`,
    }));
}

// Find the exact moment the bass kicks in, then snap to a nearby beat.
function refine(f: Features, beats: Beat[], approx: number): number {
  const w = Math.max(2, Math.round(f.frameRate * 0.2));
  const from = Math.max(w, Math.floor((approx - 1) * f.frameRate));
  const to = Math.floor((approx + 1) * f.frameRate);
  let best = from;
  let bv = -Infinity;
  for (let k = from; k < to && k + w < f.bass.length; k++) {
    const d = mean(f.bass, k, k + w) - mean(f.bass, k - w, k);
    if (d > bv) {
      bv = d;
      best = k;
    }
  }
  const t = best / f.frameRate;
  let snapped = t;
  let gap = 0.2;
  for (const b of beats) {
    if (Math.abs(b.time - t) < gap) {
      gap = Math.abs(b.time - t);
      snapped = b.time;
    }
  }
  return snapped;
}
