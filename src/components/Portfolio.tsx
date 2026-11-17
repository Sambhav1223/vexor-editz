"use client";

import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { categories, projects, type Project } from "@/config/portfolio";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./ui/SectionHeading";
import { ProjectCard } from "./ProjectCard";
import { VideoModal } from "./VideoModal";

type Filter = "All" | (typeof categories)[number];

export function Portfolio() {
  const [active, setActive] = useState<Filter>("All");
  const [playing, setPlaying] = useState<Project | null>(null);
  const close = useCallback(() => setPlaying(null), []);

  const visible = useMemo(
    () => (active === "All" ? projects : projects.filter((p) => p.category === active)),
    [active],
  );
  const filters = useMemo<Filter[]>(
    () => ["All", ...categories.filter((c) => projects.some((p) => p.category === c))],
    [],
  );
  const allVertical = visible.length > 0 && visible.every((p) => p.orientation === "vertical");
  const hasPlaceholders = projects.some((p) => !p.youtubeId);

  return (
    <section id="portfolio" aria-labelledby="portfolio-title" className="py-24 md:py-32">
      <div className="wrap">
        <SectionHeading
          id="portfolio-title"
          title="Selected Works"
          description="Hover a project to preview it, or open it to watch in full."
        />

        <div role="group" aria-label="Filter projects by category" className="mt-10 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={active === f}
              onClick={() => setActive(f)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                active === f
                  ? "border-accent bg-accent text-white"
                  : "border-white/15 text-muted hover:border-accent-soft/60 hover:text-white",
              )}
            >
              {f}
            </button>
          ))}
        </div>

        {hasPlaceholders ? (
          <p className="mt-6 max-w-xl text-sm text-muted">
            Cards marked Placeholder are empty slots. Finished projects replace them as they are added.
          </p>
        ) : null}

        <motion.div layout className={cn(
            "mx-auto mt-10 grid gap-6 sm:mx-0 sm:grid-cols-2",
            allVertical ? "max-w-sm sm:max-w-none lg:grid-cols-3 xl:grid-cols-4" : "lg:grid-cols-3",
          )}>
          <AnimatePresence mode="popLayout">
            {visible.map((p) => (
              <ProjectCard key={p.id} project={p} onWatch={setPlaying} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>{playing ? <VideoModal key={playing.id} project={playing} onClose={close} /> : null}</AnimatePresence>
    </section>
  );
}
