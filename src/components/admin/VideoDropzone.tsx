import { useRef, useState } from "react";
import { Film, Loader2, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function VideoDropzone({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chooseVideo = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      setError("Please choose a video file.");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setError("Please choose a video smaller than 3 MB.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      onChange(await readAsDataUrl(file));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between gap-3">
        <label className="text-sm font-semibold text-foreground">Product video</label>
        <span className="text-[11px] text-muted-foreground">Optional</span>
      </div>

      {value ? (
        <div className="overflow-hidden rounded-xl border border-border bg-card/60">
          <video src={value} controls preload="metadata" className="aspect-video w-full bg-background object-contain" />
          <div className="flex items-center justify-between gap-3 p-3">
            <span className="flex min-w-0 items-center gap-2 text-sm font-semibold">
              <Film className="size-4 shrink-0 text-primary" />
              <span className="truncate">Video added</span>
            </span>
            <Button type="button" variant="destructive" size="sm" onClick={() => onChange("")}>
              <Trash2 className="size-4" /> Remove
            </Button>
          </div>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") inputRef.current?.click();
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragOver(false);
            void chooseVideo(event.dataTransfer.files?.[0]);
          }}
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-5 py-8 text-center transition-colors ${
            dragOver
              ? "border-primary bg-primary/10"
              : "border-border bg-card/60 hover:border-primary/60 hover:bg-card"
          }`}
        >
          {busy ? <Loader2 className="size-5 animate-spin" /> : <Upload className="size-5 text-primary" />}
          <p className="text-sm font-semibold text-foreground">Drag &amp; drop a video here</p>
          <p className="text-xs text-muted-foreground">or click to choose from your device</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime"
        className="hidden"
        onChange={(event) => {
          void chooseVideo(event.target.files?.[0]);
          event.target.value = "";
        }}
      />

      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}