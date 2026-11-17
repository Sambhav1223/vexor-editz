"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, RefreshCw } from "lucide-react";
import { siteConfig } from "@/config/site";
import type { YouTubePayload } from "@/lib/types";
import { formatDate, formatSubscribers, timeAgo } from "@/lib/utils";
import { SectionHeading } from "./ui/SectionHeading";
import { YouTubeIcon } from "./ui/icons";

const POLL_MS = 10 * 60 * 1000;
const STALE_MS = 5 * 60 * 1000;

const errorCopy: Record<string, string> = {
  not_configured: "The YouTube feed isn't connected yet. Add a YOUTUBE_API_KEY to enable it.",
  channel_not_found: "The YouTube channel couldn't be found. Check the channel handle in the site config.",
  quota: "The YouTube API limit was reached. The feed will return shortly.",
  upstream: "YouTube didn't respond. Try again in a moment.",
};

export function YouTubeSection() {
  const [data, setData] = useState<YouTubePayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(() => Date.now());
  const lastFetch = useRef(0);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/youtube", { cache: "no-store" });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error ?? "upstream");
      setData(body as YouTubePayload);
      setError(null);
    } catch (e) {
      setError(e instanceof Error && e.message in errorCopy ? e.message : "upstream");
    } finally {
      lastFetch.current = Date.now();
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const poll = setInterval(load, POLL_MS);
    const tick = setInterval(() => setNow(Date.now()), 30_000);
    const onVisible = () => {
      if (document.visibilityState === "visible" && Date.now() - lastFetch.current > STALE_MS) load();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(poll);
      clearInterval(tick);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [load]);

  const channel = data?.channel;

  return (
    <section id="youtube" aria-labelledby="youtube-title" className="border-y border-white/10 bg-surface py-24 md:py-28">
      <div className="wrap">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading id="youtube-title" title="Latest Uploads" description="Fresh from the channel, updated automatically." />

          <div className="flex flex-col gap-3 md:items-end">
            <div className="flex items-center gap-4">
              {channel?.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={channel.avatar} alt="" width={48} height={48} className="h-12 w-12 rounded-full" />
              ) : (
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-accent-soft">
                  <YouTubeIcon className="h-6 w-6" />
                </span>
              )}
              <div>
                <p className="font-semibold">{channel?.title ?? siteConfig.name}</p>
                <p className="text-sm text-muted" aria-live="polite">
                  {channel?.subscriberCount != null ? (
                    <>
                      <span className="font-semibold text-white">{formatSubscribers(channel.subscriberCount)}</span> subscribers
                    </>
                  ) : channel?.subscribersHidden ? (
                    "Subscriber count is hidden"
                  ) : loading ? (
                    "Loading subscribers"
                  ) : (
                    siteConfig.youtube.handle
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted">
              <span>
                {data ? (
                  <time dateTime={data.updatedAt} title={new Date(data.updatedAt).toLocaleString()}>
                    Last updated {timeAgo(data.updatedAt, now)}
                  </time>
                ) : loading ? (
                  "Checking YouTube"
                ) : (
                  "Not updated yet"
                )}
              </span>
              <button
                type="button"
                onClick={load}
                disabled={loading}
                aria-label="Refresh YouTube data"
                className="rounded-full border border-white/15 p-1.5 hover:bg-white/10 disabled:opacity-50"
              >
                <RefreshCw size={12} className={loading ? "animate-spin" : undefined} />
              </button>
            </div>
            {channel?.subscriberCount != null ? (
              <p className="text-xs text-muted">YouTube rounds public subscriber counts.</p>
            ) : null}
          </div>
        </div>

        {error ? (
          <div role="alert" className="mt-10 rounded-xl border border-white/10 bg-ink/60 p-6">
            <p className="text-sm text-muted">{errorCopy[error]}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button type="button" onClick={load} className="btn-ghost !py-2">
                Try again
              </button>
              <a href={siteConfig.youtube.url} target="_blank" rel="noopener noreferrer" className="btn-primary !py-2">
                Open the channel on YouTube
              </a>
            </div>
          </div>
        ) : null}

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-busy={loading && !data}>
          {!data && loading && !error
            ? Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="card animate-pulse overflow-hidden">
                  <div className="aspect-video bg-white/5" />
                  <div className="space-y-2 p-5">
                    <div className="h-4 w-4/5 rounded bg-white/10" />
                    <div className="h-4 w-2/5 rounded bg-white/10" />
                  </div>
                </div>
              ))
            : null}

          {data?.videos.map((v) => (
            <a
              key={v.id}
              href={v.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card group overflow-hidden transition-colors duration-300 hover:border-accent/60"
            >
              <div className="relative aspect-video overflow-hidden bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={v.thumbnail}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="p-5">
                <h3 className="line-clamp-2 font-semibold leading-snug">{v.title}</h3>
                <p className="mt-3 flex items-center justify-between text-xs text-muted">
                  {v.publishedAt ? formatDate(v.publishedAt) : "Recent upload"}
                  <span className="inline-flex items-center gap-1 text-accent-soft">
                    Watch on YouTube <ArrowUpRight size={14} aria-hidden="true" />
                  </span>
                </p>
              </div>
            </a>
          ))}
        </div>

        {data && data.videos.length === 0 && !error ? (
          <p className="mt-10 text-sm text-muted">No public uploads yet.</p>
        ) : null}

        <div className="mt-10">
          <a href={siteConfig.youtube.url} target="_blank" rel="noopener noreferrer" className="btn-ghost">
            <YouTubeIcon className="h-4 w-4" />
            Visit the channel
          </a>
        </div>
      </div>
    </section>
  );
}
