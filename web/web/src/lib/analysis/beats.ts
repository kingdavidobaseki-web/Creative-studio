import { Beat, clamp01, mean, percentile } from "./common";
import { at, peaks } from "./tempo";

export function trackBeats(
  onset: Float32Array,
  frameRate: number,
  startBpm: number
): { beats: Beat[]; bpm: number } {
  const o = peaks(onset, frameRate);
  const n = o.length;
  const period = (60 * frameRate) / startBpm;

  // Find where in the first beat-length the beats line up best.
  let phase = 0;
  let bestScore = -1;
  for (let ph = 0; ph < period; ph += 0.5) {
    let s = 0;
    for (let pos = ph; pos < n; pos += period) s += at(o, pos);
    if (s > bestScore) {
      bestScore = s;
      phase = ph;
    }
  }

  const ref = percentile(Array.from(o).filter((v) => v > 0), 0.9) || 1;
  const win = Math.max(1, Math.round(period * 0.2));
  const beats: Beat[] = [];
  let expected = phase;

  while (expected < n - 1) {
    const c = Math.round(expected);
    let best = c;
    let bv = -1;
    for (let j = Math.max(0, c - win); j <= Math.min(n - 1, c + win); j++) {
      const v = o[j] * (1 - (0.4 * Math.abs(j - expected)) / win);
      if (v > bv) {
        bv = v;
        best = j;
      }
    }
    const strong = o[best] > 0.3 * ref;
    beats.push({ time: (strong ? best : expected) / frameRate, strength: clamp01(o[best] / ref) });
    expected = (strong ? 0.5 * expected + 0.5 * best : expected) + period;
  }

  // Refine the BPM from the average gap between beats.
  let bpm = startBpm;
  if (beats.length >= 16) {
    const idx = beats.map((_, i) => i);
    const times = beats.map((b) => b.time);
    const mx = mean(idx, 0, idx.length);
    const my = mean(times, 0, times.length);
    let num = 0;
    let den = 0;
    for (let i = 0; i < idx.length; i++) {
      num += (idx[i] - mx) * (times[i] - my);
      den += (idx[i] - mx) * (idx[i] - mx);
    }
    const refined = den > 0 && num > 0 ? 60 / (num / den) : startBpm;
    if (Math.abs(refined - startBpm) / startBpm < 0.03) bpm = refined;
  }
  return { beats, bpm: Math.round(bpm * 10) / 10 };
                         }
