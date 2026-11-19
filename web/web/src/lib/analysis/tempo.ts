import { clamp01, mean } from "./common";

export interface Tempo {
  bpm: number;
  confidence: number; // rough, 0 to 1
  alternatives: number[]; // other likely tempos (half, double, runner-up)
}

const MIN_BPM = 70;
const MAX_BPM = 180;

// Keep only the peaks of the onset curve (remove the slow-moving average).
export function peaks(onset: Float32Array, frameRate: number): Float32Array {
  const n = onset.length;
  const w = Math.max(2, Math.round(frameRate * 0.4));
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    out[i] = Math.max(0, onset[i] - mean(onset, i - w, i + w + 1));
  }
  return out;
}

export function at(o: Float32Array, pos: number): number {
  const i = Math.floor(pos);
  if (i < 0 || i >= o.length - 1) return 0;
  const f = pos - i;
  return o[i] * (1 - f) + o[i + 1] * f;
}

function autocorr(o: Float32Array, lag: number): number {
  const end = o.length - Math.ceil(lag) - 1;
  if (end <= 0) return 0;
  let s = 0;
  for (let i = 0; i < end; i++) s += o[i] * at(o, i + lag);
  return s / end;
}

export function estimateTempo(onset: Float32Array, frameRate: number): Tempo {
  const o = peaks(onset, frameRate);
  const bpms: number[] = [];
  const scores: number[] = [];

  for (let bpm = MIN_BPM; bpm <= MAX_BPM; bpm += 0.5) {
    const L = (60 * frameRate) / bpm;
    // A real tempo shows up at its half-beat, and again at 2, 4 and 8 beats.
    const raw = 0.5 * autocorr(o, L / 2) + autocorr(o, L) + 0.7 * autocorr(o, 2 * L) + 0.5 * autocorr(o, 4 * L) + 0.3 * autocorr(o, 8 * L);
    // Gentle preference for common tempos.
    const prior = Math.exp(-0.5 * Math.pow(Math.log2(bpm / 125) / 0.9, 2));
    bpms.push(bpm);
    scores.push(raw * prior);
  }

  let best = 0;
  for (let i = 1; i < scores.length; i++) if (scores[i] > scores[best]) best = i;
  const bpm = bpms[best];

  // Runner-up: best score that is not within 6% of the winner.
  let second = -1;
  for (let i = 0; i < scores.length; i++) {
    if (Math.abs(bpms[i] - bpm) / bpm < 0.06) continue;
    if (second < 0 || scores[i] > scores[second]) second = i;
  }
  const ratio = second >= 0 && scores[second] > 0 ? scores[best] / scores[second] : 2;
  const confidence = clamp01((ratio - 1) * 4);

  const alternatives = [bpm / 2, bpm * 2];
  if (second >= 0 && scores[second] > 0.8 * scores[best]) alternatives.push(bpms[second]);
  return { bpm, confidence, alternatives: alternatives.filter((v) => v >= 60 && v <= 200) };
}
