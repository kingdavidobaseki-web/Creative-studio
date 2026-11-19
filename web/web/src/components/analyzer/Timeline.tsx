import { MouseEvent, useRef } from "react";
import { Analysis, formatTime } from "../../lib/analysis/common";

interface Props {
  analysis: Analysis;
  currentTime: number;
  onSeek: (t: number) => void;
}

const W = 1000;
const TOP = 10;
const BASE = 118;

export default function Timeline({ analysis: a, currentTime, onSeek }: Props) {
  const ref = useRef<SVGSVGElement>(null);
  const x = (t: number) => (t / a.duration) * W;

  let area = `M0,${BASE}`;
  a.energy.forEach((e, i) => {
    area += ` L${x((i + 0.5) * a.energyStep).toFixed(1)},${(BASE - e * (BASE - TOP)).toFixed(1)}`;
  });
  area += ` L${W},${BASE} Z`;

  const ticks = a.beats.map((b) => `M${x(b.time).toFixed(1)},122 V134`).join(" ");

  const seek = (e: MouseEvent<SVGSVGElement>) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r || r.width === 0) return;
    const f = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    onSeek(f * a.duration);
  };

  return (
    <div>
      <svg
        ref={ref}
        viewBox={`0 0 ${W} 150`}
        role="img"
        aria-label="Timeline of loudness, beats, buildups and drops. Tap to jump to a point in the song."
        className="w-full cursor-pointer rounded-lg bg-zinc-900"
        onClick={seek}
      >
        {a.buildups.map((b, i) => (
          <rect
            key={i}
            x={x(b.start)}
            y={0}
            width={Math.max(2, x(b.end) - x(b.start))}
            height={BASE}
            fill={b.kind === "buildup" ? "#f0abfc" : "#94a3b8"}
            opacity={0.22}
          />
        ))}
        <path d={area} fill="#d946ef" fillOpacity={0.35} stroke="#e879f9" strokeWidth={2} />
        <path d={ticks} stroke="#71717a" strokeWidth={1.5} fill="none" />
        {a.drops.map((d, i) => (
          <line key={i} x1={x(d.time)} x2={x(d.time)} y1={0} y2={BASE + 10} stroke="#f87171" strokeWidth={4} />
        ))}
        <line x1={x(currentTime)} x2={x(currentTime)} y1={0} y2={140} stroke="#ffffff" strokeWidth={3} />
        <text x={4} y={148} fill="#a1a1aa" fontSize={22}>
          00:00
        </text>
        <text x={W - 4} y={148} fill="#a1a1aa" fontSize={22} textAnchor="end">
          {formatTime(a.duration)}
        </text>
      </svg>
      <p className="mt-2 text-xs text-zinc-500">
        Purple shape: loudness. Grey ticks: beats. Red lines: possible drops. Light bands: possible buildups (pink) and
        breaks (grey). Tap the timeline to jump there.
      </p>
    </div>
  );
}
