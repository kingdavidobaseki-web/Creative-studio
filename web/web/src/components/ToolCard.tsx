import { Link } from "react-router-dom";
import { Tool, studioStyles, studios } from "../lib/tools";

export default function ToolCard({ tool }: { tool: Tool }) {
  const s = studioStyles[tool.studio];
  return (
    <Link
      to={`${studios[tool.studio].path}/${tool.id}`}
      className={`group flex flex-col rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 transition ${s.border}`}
    >
      <span className={`mb-3 w-fit rounded-full px-2.5 py-0.5 text-xs ring-1 ${s.badge}`}>
        Coming soon · Phase {tool.phase}
      </span>
      <h3 className="text-base font-semibold text-white">{tool.name}</h3>
      <p className="mt-1 flex-1 text-sm text-zinc-400">{tool.blurb}</p>
      <span className={`mt-4 text-sm ${s.text}`}>View details →</span>
    </Link>
  );
}
