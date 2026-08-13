import { useEffect } from "react";

// Global 3D effects hook: adds event listeners for hover tilt on elements with [.tilt-card]
export function use3DEffects() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const supportsTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

    function onMove(e: MouseEvent) {
      // target common 3D card classes used across the project
      const el = (e.target as HTMLElement)?.closest?.(".tilt-card, .card-3d, .glass-card") as HTMLElement | null;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const ry = (px - 0.5) * 20; // deg
      const rx = (0.5 - py) * 12; // deg
      el.style.setProperty("--card-tilt-x", `${rx}deg`);
      el.style.setProperty("--card-tilt-y", `${ry}deg`);
      el.style.setProperty("--card-pop", `translateZ(14px)`);
      el.classList.add("is-hovered");
    }

    function onLeave(e: MouseEvent) {
      const el = (e.target as HTMLElement)?.closest?.(".tilt-card, .card-3d, .glass-card") as HTMLElement | null;
      if (!el) return;
      el.style.setProperty("--card-tilt-x", `0deg`);
      el.style.setProperty("--card-tilt-y", `0deg`);
      el.style.setProperty("--card-pop", `translateZ(0)`);
      el.classList.remove("is-hovered");
    }

    if (!supportsTouch) {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerout", onLeave);
      window.addEventListener("pointerleave", onLeave);
    }

    return () => {
      window.removeEventListener("pointermove", onMove as any);
      window.removeEventListener("pointerout", onLeave as any);
      window.removeEventListener("pointerleave", onLeave as any);
    };
  }, []);
}
