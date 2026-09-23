import { useMemo } from "react";

export function Starfield({ count = 46 }: { count?: number }) {
  const stars = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: (i * 37.5) % 100,
        top: (i * 61.3) % 100,
        size: (i % 3) + 1,
        delay: (i % 7) * 0.6,
      })),
    [count],
  );

  return (
    <div aria-hidden className="starfield pointer-events-none absolute inset-0 overflow-hidden">
      {stars.map((s) => (
        <span
          key={s.id}
          className="absolute animate-twinkle rounded-full bg-foreground/70"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
