import { useEffect, useState } from "react";

export const API_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:4000").replace(/\/$/, "");

export interface Health {
  status: string;
  time: string;
  limits: { maxAudioMb: number; maxVideoMb: number };
  features: { musicGeneration: boolean; transcription: boolean };
}

interface State {
  loading: boolean;
  data?: Health;
  error?: string;
}

export function useHealth(): State {
  const [state, setState] = useState<State>({ loading: true });

  useEffect(() => {
    const ctrl = new AbortController();
    fetch(`${API_URL}/api/health`, { signal: ctrl.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`Server replied with HTTP ${r.status}`);
        return r.json() as Promise<Health>;
      })
      .then((data) => setState({ loading: false, data }))
      .catch((e: Error) => {
        if (e.name !== "AbortError") setState({ loading: false, error: e.message });
      });
    return () => ctrl.abort();
  }, []);

  return state;
}
