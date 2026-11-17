"use client";

import { useEffect } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ArrowDown } from "lucide-react";
import { siteConfig } from "@/config/site";

const TOTAL_SECONDS = 12;
const FPS = 24;
const SWEEP = 2.8;

const pad = (n: number) => String(n).padStart(2, "0");

type ClipDef = { l: number; w: number };
const tracks: { label: string; kind: "video" | "audio"; clips: ClipDef[] }[] = [
  { label: "V2", kind: "video", clips: [{ l: 6, w: 14 }, { l: 24, w: 9 }, { l: 52, w: 20 }, { l: 78, w: 12 }] },
  { label: "V1", kind: "video", clips: [{ l: 0, w: 22 }, { l: 22, w: 18 }, { l: 40, w: 26 }, { l: 66, w: 14 }, { l: 80, w: 20 }] },
  { label: "A1", kind: "audio", clips: [{ l: 0, w: 34 }, { l: 36, w: 30 }, { l: 68, w: 32 }] },
];

const waveform = Array.from({ length: 90 }, (_, i) =>
  Math.round(20 + 70 * Math.abs(Math.sin(i * 0.7) * Math.cos(i * 0.23))),
);

function Clip({ clip, kind, index, progress }: { clip: ClipDef; kind: "video" | "audio"; index: number; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [clip.l, clip.l + 1.5], [0.12, 1]);
  return (
    <motion.div
      style={{ opacity, left: `${clip.l}%`, width: `calc(${clip.w}% - 3px)` }}
      className={
        kind === "video"
          ? `absolute inset-y-0 rounded-[3px] ${index % 2 ? "bg-accent-soft/80" : "bg-accent"}`
          : "absolute inset-y-0 flex items-center gap-[2px] overflow-hidden rounded-[3px] bg-white/10 px-1"
      }
    >
      {kind === "audio"
        ? waveform.map((h, i) => (
            <span key={i} className="w-[2px] shrink-0 rounded-full bg-accent-soft/70" style={{ height: `${h}%` }} />
          ))
        : null}
    </motion.div>
  );
}

function Timeline() {
  const reduce = useReducedMotion();
  const progress = useMotionValue(0);
  const left = useTransform(progress, (v) => `${v}%`);
  const timecode = useTransform(progress, (v) => {
    const frames = Math.floor((v / 100) * TOTAL_SECONDS * FPS);
    return `00:00:${pad(Math.floor(frames / FPS))}:${pad(frames % FPS)}`;
  });
  const headOpacity = useTransform(progress, [96, 100], [1, 0.35]);

  useEffect(() => {
    if (reduce) {
      progress.set(100);
      return;
    }
    const controls = animate(progress, 100, { duration: SWEEP, delay: 0.35, ease: [0.65, 0, 0.35, 1] });
    return () => controls.stop();
  }, [reduce, progress]);

  return (
    <div aria-hidden="true" className="select-none rounded-xl border border-white/10 bg-surface/60">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5 text-xs">
        <span className="font-semibold tracking-wide text-white">{siteConfig.name}</span>
        <motion.span className="tabular-nums text-accent-soft">{timecode}</motion.span>
      </div>
      <div className="flex gap-3 p-3 sm:p-4">
        <div className="flex w-6 flex-col gap-2 text-[10px] font-medium text-muted">
          {tracks.map((t) => (
            <span key={t.label} className="flex h-8 items-center sm:h-9">
              {t.label}
            </span>
          ))}
        </div>
        <div className="relative flex-1">
          <div className="flex flex-col gap-2">
            {tracks.map((t) => (
              <div key={t.label} className="relative h-8 rounded-[3px] bg-white/[0.03] sm:h-9">
                {t.clips.map((c, i) => (
                  <Clip key={i} clip={c} kind={t.kind} index={i} progress={progress} />
                ))}
              </div>
            ))}
          </div>
          <motion.div style={{ left, opacity: headOpacity }} className="pointer-events-none absolute -bottom-1 -top-1 w-px bg-accent-soft shadow-[0_0_22px_3px_rgba(139,92,246,0.7)]">
            <span className="absolute -left-[5px] -top-1 h-2.5 w-2.5 rotate-45 rounded-[2px] bg-accent-soft" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

const lines = ["CRAFTING", "VISUALS THAT", "SPEAK."];
const subtitle = ["VIDEO EDITOR", "MOTION GRAPHICS", "CREATIVE STORYTELLING"];

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section id="home" aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 -z-10 h-[40rem] w-[40rem] rounded-full opacity-40"
        style={{ background: "radial-gradient(closest-side, rgba(139,92,246,0.35), transparent)" }}
        animate={reduce ? undefined : { x: [0, -60, 0], y: [0, 40, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-64 bg-gradient-to-t from-ink to-transparent"
      />

      <div className="wrap flex min-h-[100svh] flex-col justify-center pb-14 pt-28 md:pt-32">
        <h1
          id="hero-title"
          className="font-display text-[clamp(4.25rem,14vw,12.5rem)] font-black uppercase leading-[0.86] tracking-tight"
        >
          <span className="sr-only">Crafting visuals that speak.</span>
          <span aria-hidden="true" className="block">
            {lines.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.04em]">
                <motion.span
                  className="block"
                  initial={reduce ? false : { y: "105%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, delay: 0.1 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </span>
        </h1>

        <p className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold tracking-[0.22em] text-accent-soft sm:text-sm">
          {subtitle.map((s, i) => (
            <span key={s} className="flex items-center gap-3">
              {s}
              {i < subtitle.length - 1 ? (
                <span aria-hidden="true" className="text-white/25">
                  |
                </span>
              ) : null}
            </span>
          ))}
        </p>

        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg">
          I&apos;m a passionate video editor specializing in anime, cinematic and gaming edits. I transform ordinary
          footage into visually engaging experiences.
        </p>

        <div className="mt-9 flex flex-wrap gap-3">
          <a href="#portfolio" className="btn-primary">
            Explore My Work
            <ArrowDown size={16} aria-hidden="true" />
          </a>
          <a href="#contact" className="btn-ghost">
            Contact Me
          </a>
        </div>

        <div className="mt-14 md:mt-20">
          <Timeline />
        </div>
      </div>
    </section>
  );
}
