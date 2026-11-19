import { Buildup, Drop, mean, slope } from "./common";
import { Bins, STEP, smooth } from "./bins";

// For each drop, look back at the stretch where the low end was missing.
// If it also got louder, brighter or busier, call it a buildup.
// If not, it is just a break.
export function findBuildups(bins: Bins, drops: Drop[]): Buildup[] {
  const bass = smooth(bins.bass);
  const loud = smooth(bins.loud);
  const out: Buildup[] = [];

  for (const d of drops) {
    const i0 = Math.round(d.time / STEP);
    const afterBass = mean(bass, i0, i0 + 4);

    let j = i0 - 1;
    while (j >= 0 && i0 - j <= 64 && bass[j] <= afterBass - 3) j--;
    let start = j + 1;
    if (i0 - start < 6) continue;

    // Where did the rise begin? Use the loudness before the final pause.
    const endCalc = i0 - 4;
    let lo = Infinity;
    let hi = -Infinity;
    for (let k = start; k < endCalc; k++) {
      lo = Math.min(lo, loud[k]);
      hi = Math.max(hi, loud[k]);
    }
    if (hi - lo >= 6) {
      const limit = lo + 0.3 * (hi - lo);
      for (let k = endCalc - 1; k >= start; k--) {
        if (loud[k] <= limit) {
          start = k + 1;
          break;
        }
      }
    }
    if (i0 - start < 6) continue;

    const signals: string[] = [];
    const rel = (a: number[]) => (slope(a, start, endCalc) * (endCalc - start)) / (mean(a, start, endCalc) || 1);
    if (rel(bins.centroid) >= 0.1) signals.push("getting brighter");
    if (rel(bins.onset) >= 0.1) signals.push("getting busier");
    if (slope(loud, start, endCalc) * (endCalc - start) >= 3) signals.push("getting louder");

    if (signals.length === 0) {
      if (start === 0) continue; // just the intro
      out.push({
        start: start * STEP,
        end: d.time,
        kind: "break",
        confidence: 0.3,
        reason: "The low end drops out before the drop, with no clear rise.",
      });
    } else {
      out.push({
        start: start * STEP,
        end: d.time,
        kind: "buildup",
        confidence: Math.min(1, 0.4 + 0.2 * signals.length),
        reason: `Low end is missing and the sound is ${signals.join(", ")} before the drop.`,
      });
    }
  }
  return out;
  }
