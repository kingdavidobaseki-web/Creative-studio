import { Link } from "react-router-dom";
import ToolCard from "../components/ToolCard";
import { studios, toolsFor, Studio } from "../lib/tools";

const workflow = [
  "Upload or generate a track",
  "Detect its beats, buildup and drops",
  "Upload your clips",
  "Get suggested cuts and effects",
  "Preview, adjust, export the plan",
];

export default function Home() {
  return (
    <div className="space-y-16">
      <section className="pt-6 text-center sm:pt-12">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Make the music. <span className="text-fuchsia-400">Cut to the beat.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
          One place to analyse tracks, generate original music, improve footage, and plan edits that land on the drop.
          Tools are added phase by phase, and anything not working yet is marked clearly.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/music" className="rounded-md bg-fuchsia-500 px-5 py-3 text-sm font-semibold text-zinc-950 hover:bg-fuchsia-400">
            Open Music Studio
          </Link>
          <Link to="/video" className="rounded-md bg-sky-500 px-5 py-3 text-sm font-semibold text-zinc-950 hover:bg-sky-400">
            Open Video Studio
          </Link>
        </div>
      </section>

      {(Object.keys(studios) as Studio[]).map((key) => (
        <section key={key}>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">{studios[key].name}</h2>
              <p className="text-sm text-zinc-400">{studios[key].tagline}</p>
            </div>
            <Link to={studios[key].path} className="text-sm text-zinc-400 hover:text-white">
              See all →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {toolsFor(key).slice(0, 3).map((t) => (
              <ToolCard key={t.id} tool={t} />
            ))}
          </div>
        </section>
      ))}

      <section>
        <h2 className="mb-4 text-xl font-semibold text-white">The workflow we are building toward</h2>
        <ol className="grid gap-3 sm:grid-cols-5">
          {workflow.map((w, i) => (
            <li key={w} className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 text-sm text-zinc-300">
              <span className="mb-2 block text-xs font-semibold text-fuchsia-300">Step {i + 1}</span>
              {w}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
            }
