import { Buildup, Cut, Drop, Beat, Section, mean } from "./common";
import { Bins, STEP, smooth } from "./bins";

// Where does the high-energy part after a drop end?
function highEnergyEnd(bins: Bins, from: number, limit: number): number {
  const loud = smooth(bins.loud);
  const i0 = Math.round(from / STEP);
  const level = mean(loud, i0, i0 + 4);
  for (let k = i0 + 4; k * STEP < limit; k++) {
    if (mean(loud, k, k + 4) < level - 5) return k * STEP;
  }
  return limit;
}

export function buildSections(duration: number, bins: Bins, buildups: Buildup[], drops: Drop[]): Section[] {
  const out: Section[] = [];
  const add = (label: string, start: number, end: number) => {
    if (end - start >= 2) out.push({ label, start, end });
  };
  if (drops.length === 0) {
    add("Whole track (no clear drop found)", 0, duration);
    return out;
  }
  const buildFor = (d: Drop) => buildups.find((b) => Math.abs(b.end - d.time) < 1);

  let cursor = 0;
  drops.forEach((d, idx) => {
    const bu = buildFor(d);
    add(cursor === 0 ? "Intro" : "Lower-energy section", cursor, bu ? bu.start : d.time);
    if (bu) add(bu.kind === "buildup" ? "Buildup" : "Break", bu.start, bu.end);
    const next = drops[idx + 1];
    const limit = next ? (buildFor(next)?.start ?? next.time) : duration;
    const end = highEnergyEnd(bins, d.time, limit);
    add("High-energy section", d.time, end);
    cursor = end;
  });
  add("Outro / lower-energy", cursor, duration);
  return out;
}

export function suggestCuts(beats: Beat[], buildups: Buildup[], drops: Drop[]): Cut[] {
  const cuts: Cut[] = [];
  drops.forEach((d) => cuts.push({ time: d.time, reason: "Possible drop: hard cut, flash or impact" }));
  buildups
    .filter((b) => b.kind === "buildup")
    .forEach((b) => cuts.push({ time: b.start, reason: "Possible buildup start: speed ramp or slow zoom" }));

  const picked: number[] = [];
  const strongest = [...beats].sort((a, b) => b.strength - a.strength);
  for (const b of strongest) {
    if (picked.length >= 10) break;
    const farFromPicked = picked.every((t) => Math.abs(t - b.time) >= 2);
    const farFromEvents = cuts.every((c) => Math.abs(c.time - b.time) >= 1);
    if (farFromPicked && farFromEvents) picked.push(b.time);
  }
  picked.forEach((t) => cuts.push({ time: t, reason: "Strong beat: a good spot for a cut" }));
  return cuts.sort((a, b) => a.time - b.time);
}
