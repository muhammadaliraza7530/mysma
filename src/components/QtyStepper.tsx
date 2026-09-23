import { Minus, Plus } from "lucide-react";

export function QtyStepper({
  value,
  onChange,
  size = "sm",
}: {
  value: number;
  onChange: (v: number) => void;
  size?: "sm" | "md";
}) {
  const btn =
    size === "sm"
      ? "size-6 text-xs"
      : "size-9 text-sm";
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-border bg-surface/70 p-1">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(1, value - 1))}
        className={`${btn} grid place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground`}
      >
        <Minus className="size-3.5" />
      </button>
      <span className={size === "sm" ? "w-5 text-center text-xs" : "w-8 text-center text-sm"}>
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(value + 1)}
        className={`${btn} grid place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground`}
      >
        <Plus className="size-3.5" />
      </button>
    </div>
  );
}
