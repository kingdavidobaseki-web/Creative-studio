import { Features } from "./features";

export const STEP = 0.5; // seconds per bin

export interface Bins {
  loud: number[];
  bass: number[];
  centroid: number[];
  onset: number[];
}

// Average the frame-level features into half-second bins.
export function toBins(f: Features, duration: number): Bins {
  const n = Math.ceil(duration / STEP);
  const per = f.frameRate * STEP;
  const make = (src: Float32Array): number[] => {
    const out: number[] = [];
    for (let i = 0; i < n; i++) {
      const a = Math.min(src.length - 1, Math.floor(i * per));
      const b = Math.min(src.length, Math.max(a + 1, Math.floor((i + 1) * per)));
      let sum = 0;
      for (let k = a; k < b; k++) sum += src[k];
      out.push(sum / (b - a));
    }
    return out;
  };
  return { loud: make(f.rms), bass: make(f.bass), centroid: make(f.centroid), onset: make(f.onset) };
}

// 3-bin moving average
export function smooth(a: number[]): number[] {
  return a.map((_, i) => {
    const s = Math.max(0, i - 1);
    const e = Math.min(a.length, i + 2);
    let sum = 0;
    for (let k = s; k < e; k++) sum += a[k];
    return sum / (e - s);
  });
    }
