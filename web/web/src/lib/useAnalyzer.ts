import { useState } from "react";
import { decodeFile } from "./analysis/decode";
import { analyzeAudio, toExportJson } from "./analysis/analyze";
import { Analysis } from "./analysis/common";

export type Status = "idle" | "working" | "done" | "error";

// Holds the chosen file and runs the analysis on it.
export function useAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState<Analysis | null>(null);

  const pick = (f: File | null) => {
    setFile(f);
    setResult(null);
    setError("");
    setStatus("idle");
  };

  const run = async () => {
    if (!file) return;
    setStatus("working");
    setError("");
    setResult(null);
    setProgress(0);
    setStage("Reading the audio file...");
    try {
      const { samples, sampleRate } = await decodeFile(file);
      setStage("Measuring beats and energy...");
      setResult(await analyzeAudio(samples, sampleRate, setProgress));
      setStatus("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong while analysing this file.");
      setStatus("error");
    }
  };

  const download = () => {
    if (!result || !file) return;
    const blob = new Blob([toExportJson(result, file.name)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = file.name.replace(/\.[^.]+$/, "") + "-analysis.json";
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(link.href), 2000);
  };

  return { file, status, progress, stage, error, result, pick, run, download };
}
