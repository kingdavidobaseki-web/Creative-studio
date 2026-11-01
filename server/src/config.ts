import "dotenv/config";

const num = (value: string | undefined, fallback: number): number => {
  const n = Number(value);
  return value !== undefined && value !== "" && Number.isFinite(n) ? n : fallback;
};

export const config = {
  port: num(process.env.PORT, 4000),
  nodeEnv: process.env.NODE_ENV ?? "development",
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
  maxAudioMb: num(process.env.MAX_AUDIO_MB, 50),
  maxVideoMb: num(process.env.MAX_VIDEO_MB, 500),
  musicApiKey: process.env.MUSIC_API_KEY ?? "",
  transcriptionApiKey: process.env.TRANSCRIPTION_API_KEY ?? "",
};

// Never expose the keys themselves, only whether they are set.
export const featureStatus = () => ({
  musicGeneration: config.musicApiKey !== "",
  transcription: config.transcriptionApiKey !== "",
});
