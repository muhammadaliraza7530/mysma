type Size = "xs" | "sm" | "md";

/**
 * Premium logo watermark placed on the left side of product imagery.
 * Purely decorative — never intercepts pointer events.
 */
export function Watermark({ size = "md" }: { size?: Size }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute z-20 select-none ${
        size === "xs"
          ? "left-2 top-2 w-9 sm:w-11"
          : size === "sm"
            ? "left-4 top-4 w-16 sm:left-5 sm:top-5 sm:w-20"
            : "left-4 top-4 w-20 sm:left-5 sm:top-5 sm:w-28"
      }`}
      style={{ opacity: 0.7, mixBlendMode: "screen" }}
    >
      <img
        src="/images/logo-alpha.webp"
        alt=""
        loading="lazy"
        decoding="async"
        draggable={false}
        className="w-full drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)]"
      />
    </span>
  );
}
