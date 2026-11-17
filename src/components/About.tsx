import { tools } from "@/config/tools";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";
import { ToolCard } from "./ToolCard";

const focus = ["Visual storytelling", "Smooth transitions", "Motion graphics", "High-quality video enhancement"];

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="py-24 md:py-32">
      <div className="wrap grid gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <div>
          <SectionHeading id="about-title" title="Behind the Edits" />
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/85">
              I&apos;m a video editor with over 3 years of experience creating anime, movie and gaming edits. My focus
              is on visual storytelling, smooth transitions, motion graphics and high-quality video enhancement.
            </p>
            <ul className="mt-8 grid max-w-xl gap-x-8 gap-y-3 sm:grid-cols-2">
              {focus.map((f) => (
                <li key={f} className="flex items-center gap-3 border-t border-white/10 pt-3 text-sm text-muted">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
                  {f}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <h3 className="font-display text-3xl font-extrabold uppercase tracking-wide">Software &amp; Tools</h3>
          <ul className="mt-6 grid gap-3">
            {tools.map((t) => (
              <ToolCard key={t.name} tool={t} />
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
