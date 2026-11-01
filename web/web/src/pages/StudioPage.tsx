import ToolCard from "../components/ToolCard";
import { Studio, studios, toolsFor } from "../lib/tools";

export default function StudioPage({ studio }: { studio: Studio }) {
  const info = studios[studio];
  return (
    <div>
      <h1 className="text-3xl font-bold text-white">{info.name}</h1>
      <p className="mt-2 text-zinc-400">{info.tagline}</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {toolsFor(studio).map((t) => (
          <ToolCard key={t.id} tool={t} />
        ))}
      </div>
    </div>
  );
      }
