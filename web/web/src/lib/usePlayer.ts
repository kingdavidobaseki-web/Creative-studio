import { useEffect, useRef, useState } from "react";

// Audio playback helpers: the file's URL, current time, jump, short previews.
export function usePlayer(file: File | null) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const stopTimer = useRef<number | undefined>(undefined);
  const [url, setUrl] = useState<string | null>(null);
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (!file) {
      setUrl(null);
      return;
    }
    const u = URL.createObjectURL(file);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);

  useEffect(() => () => window.clearTimeout(stopTimer.current), []);

  const seek = (t: number) => {
    if (audioRef.current) audioRef.current.currentTime = t;
    setTime(t);
  };

  // Play a few seconds around a moment, then stop.
  const preview = (t: number) => {
    const el = audioRef.current;
    if (!el) return;
    window.clearTimeout(stopTimer.current);
    el.currentTime = Math.max(0, t - 2);
    void el.play();
    stopTimer.current = window.setTimeout(() => el.pause(), 5000);
  };

  return { audioRef, url, time, setTime, seek, preview };
      }
