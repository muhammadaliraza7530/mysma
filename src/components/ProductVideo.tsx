import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX, Play, Pause } from "lucide-react";
import { Watermark } from "@/components/Watermark";

type Props = {
  src: string;
  poster?: string;
  label: string;
  /** Fill the parent box edge-to-edge (no letterboxing) */
  fill?: boolean;
  className?: string;
};

function fmt(t: number) {
  if (!Number.isFinite(t)) return "0:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function ProductVideo({ src, poster, label, fill, className }: Props) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);
  const [muted, setMuted] = useState(true);
  const [volume, setVolume] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const scrubbing = useRef(false);
  const hideTimer = useRef<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.muted = muted;
    el.volume = volume;
  }, [muted, volume]);


  const inView = useRef(false);
  const userPaused = useRef(false);

  // Autoplay muted whenever the section is on screen (muted autoplay is always allowed).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const play = async () => {
      if (userPaused.current) return;
      try {
        await el.play();
      } catch {
        // last resort: force muted and retry once
        el.muted = true;
        setMuted(true);
        try {
          await el.play();
        } catch {
          setPlaying(false);
        }
      }
    };

    const stop = () => {
      el.pause();
      setPlaying(false);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        const visible = entry.isIntersecting && entry.intersectionRatio >= 0.25;
        if (visible === inView.current) return;
        inView.current = visible;
        if (visible) void play();
        else stop();
      },
      { threshold: [0, 0.25, 0.75] },
    );

    io.observe(el);

    // Kick playback as soon as any data is ready (covers slow metadata on mobile).
    const onReady = () => {
      if (inView.current || el.readyState >= 2) void play();
    };
    el.addEventListener("loadeddata", onReady);
    el.addEventListener("canplay", onReady);

    // If the source stalls or errors, reload once so the poster never freezes.
    let recovered = false;
    const onError = () => {
      if (recovered) return;
      recovered = true;
      el.load();
      void play();
    };
    el.addEventListener("error", onError);
    el.addEventListener("stalled", onReady);

    el.load();
    void play();

    return () => {
      io.disconnect();
      el.removeEventListener("loadeddata", onReady);
      el.removeEventListener("canplay", onReady);
      el.removeEventListener("stalled", onReady);
      el.removeEventListener("error", onError);
    };
  }, [src]);


  // NOTE: no automatic unmuting. Browsers pause videos that get unmuted without a
  // direct gesture on the player itself — the speaker button below handles sound.




  const showControls = useCallback(() => {
    setControlsVisible(true);
    if (hideTimer.current !== null) window.clearTimeout(hideTimer.current);
    if (ref.current && !ref.current.paused && !scrubbing.current) {
      hideTimer.current = window.setTimeout(() => setControlsVisible(false), 2200);
    }
  }, []);

  useEffect(() => {
    if (playing) showControls();
    else {
      if (hideTimer.current !== null) window.clearTimeout(hideTimer.current);
      setControlsVisible(true);
    }
    return () => {
      if (hideTimer.current !== null) window.clearTimeout(hideTimer.current);
    };
  }, [playing, showControls]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const sync = () => {
      setPlaying(!el.paused && !el.ended);
      setTime(el.currentTime || 0);
      setDuration(Number.isFinite(el.duration) ? el.duration : 0);
    };

    sync();
    el.addEventListener("playing", sync);
    el.addEventListener("pause", sync);
    el.addEventListener("loadedmetadata", sync);
    el.addEventListener("durationchange", sync);
    el.addEventListener("seeked", sync);
    return () => {
      el.removeEventListener("playing", sync);
      el.removeEventListener("pause", sync);
      el.removeEventListener("loadedmetadata", sync);
      el.removeEventListener("durationchange", sync);
      el.removeEventListener("seeked", sync);
    };
  }, [src]);

  const togglePlayback = useCallback(async () => {
    const el = ref.current;
    if (!el) return;
    if (el.paused) {
      userPaused.current = false;
      try {
        await el.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    } else {
      userPaused.current = true;
      el.pause();
      setPlaying(false);
    }
  }, []);


  const seekFromClientX = useCallback((clientX: number) => {
    const el = ref.current;
    const bar = barRef.current;
    if (!el || !bar || !el.duration) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    el.currentTime = ratio * el.duration;
    setTime(el.currentTime);
  }, []);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (scrubbing.current) seekFromClientX(e.clientX);
    };
    const up = () => {
      scrubbing.current = false;
      showControls();
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [seekFromClientX, showControls]);

  const progress = duration ? (time / duration) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`glass-card relative overflow-hidden rounded-3xl ${fill ? "h-full w-full" : ""} ${className ?? ""}`}
      onPointerMove={showControls}
      onPointerDown={showControls}
      onPointerLeave={() => playing && setControlsVisible(false)}
    >
      <span className="pointer-events-none absolute inset-0 z-10 rounded-3xl [box-shadow:inset_0_0_0_1px_color-mix(in_oklab,var(--primary)_35%,transparent)]" />

      <video
        ref={ref}
        poster={poster}

        loop
        muted={muted}
        autoPlay
        playsInline
        preload="auto"

        aria-label={label}
        onClick={() => {
          if (!controlsVisible) {
            setControlsVisible(true);
            return;
          }
          togglePlayback();
        }}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 0)}
        onTimeUpdate={(e) => {

          if (!scrubbing.current) setTime(e.currentTarget.currentTime);
        }}
        onPlaying={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className={`relative block w-full cursor-pointer rounded-3xl ${
          fill ? "h-full object-cover" : "h-auto max-h-[70vh] object-contain"
        }`}
      >
        <source src={src} type="video/mp4" />
      </video>


      <Watermark />

      {/* premium control bar */}
      <div
        className={`absolute inset-x-0 bottom-0 z-30 flex items-center gap-3 rounded-b-3xl bg-gradient-to-t from-background/85 to-transparent px-4 pt-8 pb-3 transition-all duration-300 ${
          controlsVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
        }`}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            togglePlayback();
          }}
          aria-label={playing ? "Pause video" : "Play video"}
          className="inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-background/60 text-foreground backdrop-blur transition-transform hover:scale-110"
        >
          {playing ? <Pause className="size-3" /> : <Play className="size-3" />}
        </button>

        <div
          ref={barRef}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            scrubbing.current = true;
            seekFromClientX(e.clientX);
          }}
          onKeyDown={(e) => {
            const el = ref.current;
            if (!el || !duration) return;
            if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
              e.preventDefault();
              const change = e.key === "ArrowRight" ? 5 : -5;
              el.currentTime = Math.min(duration, Math.max(0, el.currentTime + change));
              setTime(el.currentTime);
            }
          }}
          role="slider"
          aria-label="Seek video"
          aria-valuemin={0}
          aria-valuemax={Math.round(duration)}
          aria-valuenow={Math.round(time)}
          tabIndex={0}
          className="group relative h-6 flex-1 cursor-pointer touch-none select-none"
        >
          <span className="absolute top-1/2 left-0 h-1 w-full -translate-y-1/2 rounded-full bg-foreground/20" />
          <span
            className="absolute top-1/2 left-0 h-1 -translate-y-1/2 rounded-full bg-primary"
            style={{ width: `${progress}%` }}
          />
          <span
            className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_10px_color-mix(in_oklab,var(--primary)_70%,transparent)] transition-transform group-hover:scale-125"
            style={{ left: `${progress}%` }}
          />
        </div>

        <span className="shrink-0 text-[10px] tabular-nums text-muted-foreground">
          {fmt(time)} / {fmt(duration)}
        </span>

        <div className="group/vol flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              const el = ref.current;
              if (!el) return;
              const nextMuted = !muted;
              el.muted = nextMuted;
              if (!nextMuted) {
                const v = volume > 0 ? volume : 1;
                el.volume = v;
                setVolume(v);
              }
              setMuted(nextMuted);
              if (el.paused) void el.play().catch(() => setPlaying(false));
            }}
            aria-label={muted ? "Unmute video" : "Mute video"}
            className="inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-background/60 text-foreground backdrop-blur transition-transform hover:scale-110"
          >
            {muted || volume === 0 ? <VolumeX className="size-3" /> : <Volume2 className="size-3" />}
          </button>

          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={muted ? 0 : volume}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => {
              const v = Number(e.target.value);
              const el = ref.current;
              setVolume(v);
              setMuted(v === 0);
              if (el) {
                el.volume = v;
                el.muted = v === 0;
              }
            }}
            aria-label="Volume"
            className="h-1 w-14 cursor-pointer appearance-none rounded-full bg-foreground/20 accent-[var(--primary)] transition-all sm:w-20"
            style={{
              background: `linear-gradient(to right, var(--primary) ${(muted ? 0 : volume) * 100}%, color-mix(in oklab, var(--foreground) 20%, transparent) ${(muted ? 0 : volume) * 100}%)`,
            }}
          />
        </div>

      </div>
    </motion.div>
  );
}
