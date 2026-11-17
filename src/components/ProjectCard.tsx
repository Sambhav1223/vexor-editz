"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Play } from "lucide-react";
import type { Project } from "@/config/portfolio";
import { cn, youtubeThumb } from "@/lib/utils";

function PlaceholderArt() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-[#171428] to-[#0d0b16]">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(167,139,250,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(167,139,250,0.08) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="absolute inset-x-6 bottom-6 space-y-1.5">
        <div className="h-2 w-2/3 rounded-sm bg-accent/25" />
        <div className="ml-10 h-2 w-1/2 rounded-sm bg-accent-soft/20" />
      </div>
      <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-ink/70 px-3 py-1 text-xs font-medium text-muted">
        Placeholder
      </span>
    </div>
  );
}

export function ProjectCard({ project, onWatch }: { project: Project; onWatch: (p: Project) => void }) {
  const { youtubeId } = project;
  const vertical = project.orientation === "vertical";
  const [thumb, setThumb] = useState(project.thumbnail ?? (youtubeId ? youtubeThumb(youtubeId) : ""));
  const [preview, setPreview] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const startPreview = () => {
    if (!youtubeId || !window.matchMedia("(hover: hover)").matches) return;
    timer.current = setTimeout(() => setPreview(true), 500);
  };
  const stopPreview = () => {
    if (timer.current) clearTimeout(timer.current);
    setPreview(false);
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="card group overflow-hidden transition-colors duration-300 hover:border-accent/60"
      onMouseEnter={startPreview}
      onMouseLeave={stopPreview}
    >
      <div className={cn("relative overflow-hidden bg-black", vertical ? "aspect-[9/16]" : "aspect-video")}>
        {youtubeId ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumb}
              alt={`Thumbnail for ${project.title}`}
              loading="lazy"
              onError={() => !project.thumbnail && setThumb(youtubeThumb(youtubeId, "hqdefault"))}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
            {preview ? (
              <iframe
                aria-hidden="true"
                tabIndex={-1}
                title={`Preview of ${project.title}`}
                className="pointer-events-none absolute inset-0 h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=1&controls=0&modestbranding=1&playsinline=1&disablekb=1&loop=1&playlist=${youtubeId}&start=${project.previewStart ?? 0}`}
                allow="autoplay; encrypted-media"
              />
            ) : null}
            <button
              type="button"
              onClick={() => onWatch(project)}
              aria-label={`Play ${project.title}`}
              className="absolute inset-0 flex items-center justify-center"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/90 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
                <Play size={22} fill="currentColor" aria-hidden="true" />
              </span>
            </button>
          </>
        ) : (
          <PlaceholderArt />
        )}
      </div>

      <div className="p-5">
        <p className="text-xs font-medium text-accent-soft">{project.category}</p>
        <h3 className="mt-1 font-display text-2xl font-extrabold uppercase leading-tight tracking-wide">
          {project.title}
        </h3>
        {project.description ? <p className="mt-2 text-sm text-muted">{project.description}</p> : null}
        <div className="mt-4">
          {youtubeId ? (
            <button type="button" onClick={() => onWatch(project)} className="btn-primary !px-5 !py-2.5">
              <Play size={14} fill="currentColor" aria-hidden="true" />
              Watch Full Video
            </button>
          ) : (
            <button type="button" disabled className="btn-primary !px-5 !py-2.5">
              Video not added yet
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}
