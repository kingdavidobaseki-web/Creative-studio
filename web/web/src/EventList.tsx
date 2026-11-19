import { ReactNode } from "react";
import { Analysis, confidenceLabel, formatTime } from "../../lib/analysis/common";

interface RowProps {
  time: number;
  title: string;
  detail?: string;
  onPlay: (t: number) => void;
}

function Row({ time, title, detail, onPlay }: RowProps) {
  return (
    <li className="flex items-start gap-3 border-b border-zinc-800 py-3 last:border-0">
      <button
        type="button"
        onClick={() => onPlay(time)}
        aria-label={`Preview around ${formatTime(time)}`}
        className="shrink-0 rounded-md bg-zinc-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-700"
      >
        ▶ {formatTime(time)}
      </button>
      <div className="min-w-0 text-sm">
        <p className="font-medium text-white">{title}</p>
        {detail && <p className="text-zinc-400">{detail}</p>}
      </div>
    </li>
  );
}

function Block({ title, note, children }: { title: string; note: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-5 py-4">
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <p className="mt-1 text-xs text-zinc-500">{note}</p>
      <ul className="mt-2">{children}</ul>
    </section>
  );
}

export default function EventList({ analysis: a, onPlay }: { analysis: Analysis; onPlay: (t: number) => void }) {
  const range = (s: number, e: number) => `${formatTime(s)} to ${formatTime(e)}`;
  return (
    <div className="space-y-4">
      <Block title="Sections" note="Estimated from changes in loudness and bass.">
        {a.sections.map((s, i) => (
          <Row key={i} time={s.start} title={s.label} detail={range(s.start, s.end)} onPlay={onPlay} />
        ))}
      </Block>
      <Block title="Possible drops" note="Estimated. Needs a sharp jump in the low end, not just louder sound.">
        {a.drops.length === 0 && <li className="py-3 text-sm text-zinc-400">No clear drop found. Many tracks do not have one.</li>}
        {a.drops.map((d, i) => (
          <Row key={i} time={d.time} title={`Drop (${confidenceLabel(d.confidence)} confidence)`} detail={d.reason} onPlay={onPlay} />
        ))}
      </Block>
      {a.buildups.length > 0 && (
        <Block title="Buildups and breaks" note="Estimated from the stretch before each drop.">
          {a.buildups.map((b, i) => (
            <Row
              key={i}
              time={b.start}
              title={b.kind === "buildup" ? "Possible buildup" : "Possible break"}
              detail={`${range(b.start, b.end)}. ${b.reason}`}
              onPlay={onPlay}
            />
          ))}
        </Block>
      )}
      <Block title="Suggested cut points" note="Ideas for video edits. You decide what to use.">
        {a.cuts.map((c, i) => (
          <Row key={i} time={c.time} title={formatTime(c.time)} detail={c.reason} onPlay={onPlay} />
        ))}
      </Block>
    </div>
  );
                }
