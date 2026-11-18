export interface Beat {
  time: number; // seconds
  strength: number; // 0 to 1
}

export interface Drop {
  time: number;
  confidence: number; // 0 to 1
  reason: string;
}

export interface Buildup {
  start: number;
  end: number;
  kind: "buildup" | "break";
  confidence: number;
  reason: string;
}

export interface Section {
  label: string;
  start: number;
  end: number;
}

export interface Cut {
  time: number;
  reason: string;
}

export interface Analysis {
  duration: number;
  bpm: number;
  bpmConfidence: number;
  bpmAlternatives: number[];
  beats: Beat[];
  energyStep: number;
  energy: number[];
  buildups: Buildup[];
  drops: Drop[];
  sections: Section[];
  cuts: Cut[];
}

export const clamp01 = (v: number): number => Math.min(1, Math.max(0, v));

export function mean(a: ArrayLike<number>, from: number, to: number): number {
  const s = Math.max(0, Math.floor(from));
  const e = Math.min(a.length, Math.floor(to));
  if (e <= s) return 0;
  let sum = 0;
  for (let i = s; i < e; i++) sum += a[i];
  return sum / (e - s);
}

export function percentile(a: ArrayLike<number>, p: number): number {
  if (a.length === 0) return 0;
  const sorted = Array.from(a).sort((x, y) => x - y);
  return sorted[Math.min(sorted.length - 1, Math.floor(p * sorted.length))];
}

// Least-squares slope per index over a[from..to)
export function slope(a: ArrayLike<number>, from: number, to: number): number {
  const s = Math.max(0, Math.floor(from));
  const e = Math.min(a.length, Math.floor(to));
  const n = e - s;
  if (n < 2) return 0;
  const mx = (n - 1) / 2;
  const my = mean(a, s, e);
  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i++) {
    num += (i - mx) * (a[s + i] - my);
    den += (i - mx) * (i - mx);
  }
  return den > 0 ? num / den : 0;
}

export function formatTime(t: number): string {
  const s = Math.max(0, t);
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

export const confidenceLabel = (c: number): string =>
  c >= 0.66 ? "High" : c >= 0.4 ? "Medium" : "Low";
