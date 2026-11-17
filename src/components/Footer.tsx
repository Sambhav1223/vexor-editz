import { siteConfig } from "@/config/site";
import { YouTubeIcon } from "./ui/icons";

export function Footer() {
  return (
    <footer className="relative bg-ink">
      <div className="h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent" aria-hidden="true" />
      <div className="wrap flex flex-col gap-8 py-12 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-3xl font-black tracking-wide">
            {siteConfig.name}
            <span className="text-accent">.</span>
          </p>
          <p className="mt-1 text-sm text-muted">Video editing for anime, movie, gaming and cinematic edits.</p>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-muted">
            {siteConfig.nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="transition-colors hover:text-white">
                  {n.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={siteConfig.youtube.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 transition-colors hover:text-white"
              >
                <YouTubeIcon className="h-4 w-4" />
                YouTube
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="wrap border-t border-white/10 py-6 text-xs text-muted">
        &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
      </div>
    </footer>
  );
}
