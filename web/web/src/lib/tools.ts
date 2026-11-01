export type Studio = "music" | "video";
export type InputKind = "audio" | "video" | "audio-or-video" | "none";

export interface Tool {
  id: string;
  studio: Studio;
  name: string;
  blurb: string;
  phase: number;
  input: InputKind;
  needs: string;
}

export const AUDIO_EXT = [".mp3", ".wav", ".m4a", ".flac", ".ogg"];
export const VIDEO_EXT = [".mp4", ".mov", ".webm", ".mkv"];

export const acceptFor = (kind: InputKind): string[] =>
  kind === "audio" ? AUDIO_EXT : kind === "video" ? VIDEO_EXT : kind === "audio-or-video" ? [...AUDIO_EXT, ...VIDEO_EXT] : [];

export const studios: Record<Studio, { name: string; tagline: string; path: string }> = {
  music: {
    name: "Music Studio",
    tagline: "Analyse tracks, find the drop, and generate original music.",
    path: "/music",
  },
  video: {
    name: "Video Studio",
    tagline: "Enhance footage, add subtitles, and plan edits to the beat.",
    path: "/video",
  },
};

// Full class names so Tailwind can detect them.
export const studioStyles: Record<Studio, { text: string; border: string; badge: string; bar: string }> = {
  music: {
    text: "text-fuchsia-300",
    border: "hover:border-fuchsia-500/60",
    badge: "bg-fuchsia-500/10 text-fuchsia-300 ring-fuchsia-500/30",
    bar: "bg-fuchsia-500",
  },
  video: {
    text: "text-sky-300",
    border: "hover:border-sky-500/60",
    badge: "bg-sky-500/10 text-sky-300 ring-sky-500/30",
    bar: "bg-sky-500",
  },
};

export const tools: Tool[] = [
  {
    id: "analyzer",
    studio: "music",
    name: "Beat & Drop Detector",
    blurb: "Upload a track to estimate BPM, beats, energy, buildups and likely drops on a timeline.",
    phase: 2,
    input: "audio",
    needs: "No paid AI service. Runs on our own server with audio processing.",
  },
  {
    id: "generator",
    studio: "music",
    name: "AI Music Generator",
    blurb: "Describe a track in text and generate an original piece, such as phonk or funk.",
    phase: 3,
    input: "none",
    needs: "A music-generation API key (MUSIC_API_KEY). Provider, pricing and licensing still need to be confirmed.",
  },
  {
    id: "advanced",
    studio: "music",
    name: "Advanced Music Studio",
    blurb: "Finer control over bass, p
