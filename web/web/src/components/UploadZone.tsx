import { DragEvent, useRef, useState } from "react";

interface Props {
  accept: string[];
  maxMb: number;
  label: string;
  onFile?: (file: File | null) => void;
}

const formatSize = (bytes: number) =>
  bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(0)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

export default function UploadZone({ accept, maxMb, label, onFile }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const validate = (f: File): string | null => {
    const ext = "." + (f.name.split(".").pop() ?? "").toLowerCase();
    if (!accept.includes(ext)) return `Unsupported file type. Use one of: ${accept.join(", ")}`;
    if (f.size === 0) return "That file is empty.";
    if (f.size > maxMb * 1024 * 1024) return `File is too large (${formatSize(f.size)}). The limit is ${maxMb} MB.`;
    return null;
  };

  const handle = (f: File | undefined) => {
    if (!f) return;
    const problem = validate(f);
    if (problem) {
      setError(problem);
      setFile(null);
      onFile?.(null);
      return;
    }
    setError(null);
    setFile(f);
    onFile?.(f);
  };

  const clear = () => {
    setFile(null);
    setError(null);
    onFile?.(null);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    handle(e.dataTransfer.files[0]);
  };

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`rounded-xl border-2 border-dashe
