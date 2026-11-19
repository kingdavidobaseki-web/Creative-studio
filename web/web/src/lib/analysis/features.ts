import { makeFFT } from "./fft";

export interface Features {
  frameRate: number; // frames per second
  onset: Float32Array; // how sudden new sound is, per frame
  rms: Float32Array; // overall loudness in dB
  bass: Float32Array; // low-end energy (below 150 Hz) in dB
  centroid: Float32Array; // brightness in Hz
}

const FRAME = 1024;
const HOP = 512;

export async function computeFeatures(
  x: Float32Array,
  sampleRate: number,
  onProgress?: (p: number) => void
): Promise<Features> {
  const frames = Math.floor((x.length - FRAME) / HOP) + 1;
  if (frames < 20) throw new Error("This track is too short to analyse.");

  const bins = FRAME / 2;
  const hz = sampleRate / FRAME;
  const bassTop = Math.max(2, Math.floor(150 / hz));
  const norm = FRAME / 4; // a full-scale tone gives magnitude 1
  const fft = makeFFT(FRAME);

  const win = new Float32Array(FRAME);
  for (let i = 0; i < FRAME; i++) win[i] = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / FRAME);
  const re = new Float32Array(FRAME);
  const im = new Float32Array(FRAME);
  const prev = new Float32Array(bins);

  const onset = new Float32Array(frames);
  const rms = new Float32Array(frames);
  const bass = new Float32Array(frames);
  const centroid = new Float32Array(frames);

  for (let f = 0; f < frames; f++) {
    const off = f * HOP;
    let sq = 0;
    for (let i = 0; i < FRAME; i++) {
      const s = x[off + i];
      sq += s * s;
      re[i] = s * win[i];
      im[i] = 0;
    }
    fft(re, im);

    let flux = 0;
    let bassE = 0;
    let num = 0;
    let den = 0;
    for (let k = 1; k < bins; k++) {
      const mag = Math.sqrt(re[k] * re[k] + im[k] * im[k]) / norm;
      const lm = Math.log1p(100 * mag);
      const d = lm - prev[k];
      if (d > 0) flux += d;
      prev[k] = lm;
      if (k <= bassTop) bassE += mag * mag;
      num += k * hz * mag;
      den += mag;
    }
    onset[f] = flux / bins;
    rms[f] = 20 * Math.log10(Math.sqrt(sq / FRAME) + 1e-6);
    bass[f] = 10 * Math.log10(bassE + 1e-9);
    centroid[f] = den > 1e-9 ? num / den : 0;

    if (f % 300 === 0) {
      onProgress?.(f / frames);
      await new Promise<void>((r) => setTimeout(r, 0));
    }
  }
  onset[0] = 0; // first frame has nothing to compare with
  return { frameRate: sampleRate / HOP, onset, rms, bass, centroid };
}
