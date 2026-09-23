import { useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/** Shrinks big uploads so the browser storage does not overflow. */
async function compress(file: File, maxSize = 1100): Promise<string> {
  const dataUrl = await readAsDataUrl(file);
  if (typeof document === "undefined") return dataUrl;
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = reject;
      el.src = dataUrl;
    });
    const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
    const w = Math.max(1, Math.round(img.width * scale));
    const h = Math.max(1, Math.round(img.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return dataUrl;
    ctx.drawImage(img, 0, 0, w, h);
    return canvas.toDataURL("image/jpeg", 0.82);
  } catch {
    return dataUrl;
  }
}

type Props = {
  label: string;
  hint?: string;
  /** Single image mode */
  value?: string;
  onChange?: (value: string) => void;
  /** Multi image (gallery) mode */
  values?: string[];
  onChangeMany?: (values: string[]) => void;
};

export function ImageDropzone({ label, hint, value, onChange, values, onChangeMany }: Props) {
  const multi = Array.isArray(values) && !!onChangeMany;
  const [dragOver, setDragOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const [urlText, setUrlText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setBusy(true);
    try {
      const imageFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
      const results = await Promise.all(imageFiles.map((f) => compress(f)));
      if (multi) onChangeMany!([...(values ?? []), ...results]);
      else if (results[0]) onChange?.(results[0]);
    } finally {
      setBusy(false);
    }
  };

  const addUrl = () => {
    const url = urlText.trim();
    if (!url) return;
    if (multi) onChangeMany!([...(values ?? []), url]);
    else onChange?.(url);
    setUrlText("");
  };

  const previews = multi ? (values ?? []) : value ? [value] : [];

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between gap-3">
        <label className="text-sm font-semibold text-foreground">{label}</label>
        {hint && <span className="text-[11px] text-muted-foreground">{hint}</span>}
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          void handleFiles(e.dataTransfer.files);
        }}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-5 py-8 text-center transition-all ${
          dragOver
            ? "border-primary bg-primary/10 scale-[1.01]"
            : "border-border bg-card/60 hover:border-primary/60 hover:bg-card"
        }`}
      >
        {busy ? (
          <Loader2 className="size-6 animate-spin text-primary" />
        ) : (
          <ImagePlus className="size-6 text-primary" />
        )}
        <p className="text-sm font-semibold text-foreground">
          Drag &amp; drop {multi ? "images" : "an image"} here
        </p>
        <p className="text-xs text-muted-foreground">or click to choose from your device</p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multi}
        className="hidden"
        onChange={(e) => {
          void handleFiles(e.target.files);
          e.target.value = "";
        }}
      />

      <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
        <div className="relative flex-1">
          <Link2 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={urlText}
            onChange={(e) => setUrlText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addUrl();
              }
            }}
            placeholder="Or paste an image link / path"
            className="w-full rounded-xl border border-border bg-card/60 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary"
          />
        </div>
        <Button
          variant="outline"
          type="button"
          onClick={addUrl}
          className="h-full rounded-xl px-4 text-sm font-semibold"
        >
          Add
        </Button>
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {previews.map((src, idx) => (
            <div
              key={`${src.slice(0, 24)}-${idx}`}
              className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-black/40"
            >
              <img src={src} alt="" className="size-full object-cover" />
              <Button
                variant="destructive"
                size="icon"
                type="button"
                onClick={() => {
                  if (multi) onChangeMany!((values ?? []).filter((_, i) => i !== idx));
                  else onChange?.("");
                }}
                className="absolute right-1.5 top-1.5 size-8 rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                aria-label="Remove image"
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
