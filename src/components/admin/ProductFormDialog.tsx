import { useEffect, useState } from "react";
import { X, Plus, Trash2, Save, Sparkles } from "lucide-react";
import { ImageDropzone } from "@/components/admin/ImageDropzone";
import { VideoDropzone } from "@/components/admin/VideoDropzone";
import type { CatalogProduct } from "@/context/CatalogContext";
import { Button } from "@/components/ui/button";

export type ProductDraft = {
  name: string;
  tagline: string;
  eyebrow: string;
  price: number;
  description: string;
  image: string;
  video: string;
  gallery: string[];
  features: string[];
  specs: { label: string; value: string }[];
  hidden: boolean;
};

export function emptyDraft(): ProductDraft {
  return {
    name: "",
    tagline: "",
    eyebrow: "",
    price: 0,
    description: "",
    image: "",
    video: "",
    gallery: [],
    features: [""],
    specs: [{ label: "", value: "" }],
    hidden: false,
  };
}

export function draftFromProduct(p: CatalogProduct): ProductDraft {
  return {
    name: p.name,
    tagline: p.tagline,
    eyebrow: p.eyebrow,
    price: p.price,
    description: p.description,
    image: p.image,
    video: p.video ?? "",
    gallery: [...(p.gallery ?? [])],
    features: p.features?.length ? [...p.features] : [""],
    specs: p.specs?.length ? p.specs.map((s) => ({ ...s })) : [{ label: "", value: "" }],
    hidden: !!p.hidden,
  };
}

const field =
  "w-full rounded-xl border border-border bg-card/60 px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary";

function Label({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="mb-1.5 flex items-baseline justify-between gap-3">
      <label className="text-sm font-semibold text-foreground">{children}</label>
      {hint && <span className="text-[11px] text-muted-foreground">{hint}</span>}
    </div>
  );
}

type Props = {
  open: boolean;
  mode: "add" | "edit";
  initial: ProductDraft;
  onClose: () => void;
  onSave: (draft: ProductDraft) => void;
};

export function ProductFormDialog({ open, mode, initial, onClose, onSave }: Props) {
  const [draft, setDraft] = useState<ProductDraft>(initial);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setDraft(initial);
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const set = <K extends keyof ProductDraft>(key: K, value: ProductDraft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const submit = () => {
    if (!draft.name.trim()) {
      setError("Please write the product name.");
      return;
    }
    if (!Number.isFinite(draft.price) || draft.price <= 0) {
      setError("Please write the price.");
      return;
    }
    if (!draft.image.trim()) {
      setError("Please add a main product photo.");
      return;
    }
    onSave({
      ...draft,
      name: draft.name.trim(),
      price: draft.price,
      features: draft.features.map((feature) => feature.trim()).filter(Boolean),
      specs: draft.specs.filter((s) => s.label.trim() || s.value.trim()),
    });
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto bg-background/90 p-0 backdrop-blur-sm sm:p-6">
      <div className="glass-panel relative min-h-dvh w-full border-primary/25 shadow-2xl sm:my-4 sm:min-h-0 sm:max-w-3xl sm:rounded-3xl sm:border">
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 rounded-t-3xl border-b border-border/60 bg-card/95 px-5 py-4 backdrop-blur-xl sm:px-7">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.25em] text-primary uppercase">
              {mode === "add" ? "New product" : "Edit product"}
            </p>
            <h2 className="mt-1 text-xl font-bold text-foreground sm:text-2xl">
              {mode === "add" ? "Add a product" : draft.name || "Edit product"}
            </h2>
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 rounded-full"
          >
            <X className="size-4" />
          </Button>
        </div>

        <div className="space-y-7 px-5 py-6 sm:px-7">
          <p className="rounded-xl bg-primary/10 px-4 py-3 text-sm font-medium text-foreground">
            Just add the name, price and photo. Everything else is optional.
          </p>

          <section className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label hint="Shown everywhere on the site">Product name</Label>
              <input
                className={field}
                value={draft.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Mini Washing Machine"
              />
            </div>
            <div>
              <Label hint="e.g. PKR 24,900">Price</Label>
               <input
                 type="number"
                 min="0"
                 step="1"
                className={field}
                value={draft.price}
                 onChange={(e) => set("price", Number(e.target.value))}
                 placeholder="65000"
              />
            </div>
            <div className="sm:col-span-2">
              <Label hint="Optional">Short line</Label>
              <input
                className={field}
                value={draft.tagline}
                onChange={(e) => set("tagline", e.target.value)}
                placeholder="Sky Panel intelligence in a palm-sized drum"
              />
            </div>
          </section>

          <section className="space-y-6 rounded-xl border border-border/60 bg-card/40 p-4 sm:p-5">
            <ImageDropzone
              label="Main photo"
              hint="Required"
              value={draft.image}
              onChange={(v) => set("image", v)}
            />
            <ImageDropzone
              label="Extra photos (gallery)"
              hint="Any number"
              values={draft.gallery}
              onChangeMany={(v) => set("gallery", v)}
            />
            <VideoDropzone value={draft.video} onChange={(value) => set("video", value)} />
          </section>

          <details className="rounded-xl border border-border/60 bg-card/30 p-4">
            <summary className="cursor-pointer text-sm font-bold text-foreground">More details (optional)</summary>
            <div className="mt-5 space-y-6">
              <div>
                <Label>Product description</Label>
                <textarea
                  className={`${field} min-h-28 resize-y`}
                  value={draft.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="Write about the product..."
                />
              </div>
              <div>
                <Label>Small heading</Label>
                <input
                  className={field}
                  value={draft.eyebrow}
                  onChange={(e) => set("eyebrow", e.target.value)}
                  placeholder="Compact laundry"
                />
              </div>
          <section>
            <Label hint="Tick-marked list on the product page">Key points</Label>
            <div className="space-y-2">
               {draft.features.map((h, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    className={field}
                    value={h}
                    onChange={(e) =>
                      set(
                         "features",
                         draft.features.map((x, j) => (j === i ? e.target.value : x)),
                      )
                    }
                    placeholder="Smart panel with one-tap programs"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    type="button"
                    onClick={() =>
                      set(
                         "features",
                         draft.features.filter((_, j) => j !== i),
                      )
                    }
                    className="h-auto shrink-0 rounded-xl text-destructive"
                    aria-label="Remove point"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              type="button"
               onClick={() => set("features", [...draft.features, ""])}
              className="mt-2 rounded-full"
            >
              <Plus className="size-3.5" /> Add point
            </Button>
          </section>

          {/* SPECS */}
          <section>
            <Label hint="Shown as spec cards">Specifications</Label>
            <div className="space-y-2">
              {draft.specs.map((s, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    className={field}
                    value={s.label}
                    onChange={(e) =>
                      set(
                        "specs",
                        draft.specs.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)),
                      )
                    }
                    placeholder="Capacity"
                  />
                  <input
                    className={field}
                    value={s.value}
                    onChange={(e) =>
                      set(
                        "specs",
                        draft.specs.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)),
                      )
                    }
                    placeholder="3.0 kg"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    type="button"
                    onClick={() =>
                      set(
                        "specs",
                        draft.specs.filter((_, j) => j !== i),
                      )
                    }
                    className="h-auto shrink-0 rounded-xl text-destructive"
                    aria-label="Remove specification"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => set("specs", [...draft.specs, { label: "", value: "" }])}
              className="mt-2 rounded-full"
            >
              <Plus className="size-3.5" /> Add specification
            </Button>
          </section>
            </div>
          </details>

          <section className="flex items-center justify-between rounded-2xl border border-border/60 bg-black/20 px-4 py-3">
            <div>
              <p className="text-sm font-semibold">Show on website</p>
              <p className="text-xs text-muted-foreground">Turn off to hide without deleting.</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              type="button"
              onClick={() => set("hidden", !draft.hidden)}
              className={`relative h-7 w-13 shrink-0 rounded-full p-0 transition-colors ${
                draft.hidden ? "bg-muted" : "bg-primary"
              }`}
              aria-label="Toggle visibility"
            >
              <span
                className={`absolute top-1 size-5 rounded-full bg-primary-foreground transition-all ${
                  draft.hidden ? "left-1" : "left-7"
                }`}
              />
            </Button>
          </section>

          {error && (
            <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </p>
          )}
        </div>

        <div className="sticky bottom-0 grid grid-cols-2 gap-3 border-t border-border/60 bg-card/95 px-5 py-4 backdrop-blur-xl sm:flex sm:justify-end sm:rounded-b-3xl sm:px-7">
          <Button
            variant="outline"
            onClick={onClose}
            className="h-12 rounded-full px-6 text-sm font-semibold"
          >
            Cancel
          </Button>
          <Button
            onClick={submit}
            className="h-12 rounded-full px-7 text-sm font-bold"
          >
            {mode === "add" ? <Sparkles className="size-4" /> : <Save className="size-4" />}
            {mode === "add" ? "Add product" : "Save changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
