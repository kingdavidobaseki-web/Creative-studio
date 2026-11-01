import { API_URL, useHealth } from "../lib/useHealth";

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between gap-4 border-b border-zinc-800 py-3 text-sm last:border-0">
    <span className="text-zinc-400">{label}</span>
    <span className="text-right text-zinc-200">{value}</span>
  </div>
);

export default function Settings() {
  const { loading, data, error } = useHealth();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-bold text-white">Settings</h1>
      <p className="mt-2 text-zinc-400">Accounts and preferences come later. For now this shows the server connection.</p>

      <section className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900/60 px-5">
        <Row label="API address" value={API_URL} />
        {loading && <Row label="Server status" value="Checking…" />}
        {error && <Row label="Server status" value={`Unreachable (${error})`} />}
        {data && (
          <>
            <Row label="Server status" value={data.status === "ok" ? "Connected" : data.status} />
            <Row label="Max audio upload" value={`${data.limits.maxAudioMb} MB`} />
            <Row label="Max video upload" value={`${data.limits.maxVideoMb} MB`} />
            <Row label="Music generation key" value={data.features.musicGeneration ? "Configured" : "Not configured"} />
            <Row label="Transcription key" value={data.features.transcription ? "Configured" : "Not configured"} />
          </>
        )}
      </section>
    </div>
  );
                    }
