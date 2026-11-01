import { Link } from "react-router-dom";
import { Tool, acceptFor, studioStyles, studios } from "../lib/tools";
import { useHealth } from "../lib/useHealth";
import UploadZone from "./UploadZone";

const steps = [
  "Upload or enter input",
  "Configure settings",
  "Start processing",
  "View progress",
  "Preview the result",
  "Export or download",
];

export default function ToolPage({ tool }: { tool: Tool }) {
  const studio = studios[tool.studio];
  const s = studioStyles[tool.studio];
  const { data } = useHealth();

  const videoLimit = data?.limits.maxVideoMb ?? 500;
  const audioLimit = data?.limits.maxAudioMb ?? 50;
  const maxMb = tool.input === "audio" ? audioLimit : videoLimit;
  const accept = acceptFor(tool.input);

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-sm text-zinc-500">
        <Link to={studio.path} className="hover:text-white">
          {studio.name}
        </Link>{" "}
        / {tool.name}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">{tool.name}</h1>
        <span className={`rounded-full px-2.5 py-0.5 text-xs ring-1 ${s.badge}`}>Coming soon · Phase {tool.phase}</span>
      </div>
      <p className="mt-2 text-zinc-400">{tool.blurb}</p>

      <section className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
        <h2 className="text-sm font-semibold text-white">What this needs to go live</h2>
        <p className="mt-1 text-sm text-zinc-400">{tool.needs}</p>
      </section>

      <section className="mt-6">
        <h2 className="mb-3 text-sm font-semibold text-white">How it will work</h2>
        <ol className="space-y-2">
          {steps.map((step, i) => (
            <li key={step} className="flex items-center gap-3 text-sm text-zinc-300">
              <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold text-zinc-950 ${s.bar}`}>
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </section>

      {tool.input !== "none" && (
        <section className="mt-8">
          <h2 className="mb-3 text-sm font-semibold text-white">Try the upload check</h2>
          <UploadZone accept={accept} maxMb={maxMb} label="Drop a file here to check it against the limits" />
          <p className="mt-2 text-xs text-zinc-500">
            This only checks the file type and size in your browser. Nothing is uploaded yet.
          </p>
          <button
            type="button"
            disabled
            className="mt-4 w-full cursor-not-allowed rounded-md bg-zinc-800 px-4 py-3 text-sm font-medium text-zinc-500"
          >
            Processing not available yet (Phase {tool.phase})
          </button>
        </section>
      )}
    </div>
  );
    }
