const TARGET_RATE = 22050;
const MAX_SECONDS = 480;

type OfflineCtor = new (channels: number, length: number, sampleRate: number) => OfflineAudioContext;

// Decode an audio file in the browser and mix it down to mono.
export async function decodeFile(file: File): Promise<{ samples: Float32Array; sampleRate: number }> {
  const w = window as unknown as { OfflineAudioContext?: OfflineCtor; webkitOfflineAudioContext?: OfflineCtor };
  const Ctx = w.OfflineAudioContext ?? w.webkitOfflineAudioContext;
  if (!Ctx) throw new Error("This browser cannot decode audio. Try Chrome.");

  const bytes = await file.arrayBuffer();
  let buffer: AudioBuffer;
  try {
    buffer = await new Ctx(1, 1, TARGET_RATE).decodeAudioData(bytes);
  } catch {
    throw new Error("Could not read this audio file. Try another file or format.");
  }
  if (buffer.duration > MAX_SECONDS) {
    throw new Error(`This track is longer than ${MAX_SECONDS / 60} minutes. Try a shorter one.`);
  }

  const channels = buffer.numberOfChannels;
  const mono = new Float32Array(buffer.length);
  for (let c = 0; c < channels; c++) {
    const ch = buffer.getChannelData(c);
    for (let i = 0; i < mono.length; i++) mono[i] += ch[i] / channels;
  }
  return { samples: mono, sampleRate: buffer.sampleRate };
      }
