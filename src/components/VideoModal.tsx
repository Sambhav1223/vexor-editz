"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { ExternalLink, X } from "lucide-react";
import type { Project } from "@/config/portfolio";
import { cn, youtubeWatchUrl } from "@/lib/utils";

export function VideoModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onClose();
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, [onClose]);

  if (!project.youtubeId) return null;
  const vertical = project.orientation === "vertical";

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/90 p-4 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
        className={cn("w-full", vertical ? "" : "max-w-5xl")}
        style={vertical ? { maxWidth: "min(26rem, calc(68svh * 9 / 16))" } : undefined}
        initial={{ scale: 0.96, y: 12 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.97, opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs text-accent-soft">{project.category}</p>
            <h3 className="truncate font-display text-2xl font-extrabold uppercase tracking-wide">{project.title}</h3>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <a
              href={youtubeWatchUrl(project.youtubeId)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost !px-4 !py-2"
            >
              YouTube
              <ExternalLink size={14} aria-hidden="true" />
            </a>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close video"
              className="rounded-full border border-white/15 p-2 hover:bg-white/10"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        <div className={cn("overflow-hidden rounded-xl border border-white/10 bg-black", vertical ? "aspect-[9/16]" : "aspect-video")}>
          <iframe
            className="h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${project.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
            title={project.title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
