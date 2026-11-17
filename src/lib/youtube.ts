/**
 * Server-side YouTube Data API v3 client.
 * Only import this from server code (route handlers, server components).
 * The API key is read from process.env and never reaches the browser.
 */
import { siteConfig } from "@/config/site";
import type { YouTubeErrorCode, YouTubePayload, YouTubeVideo } from "./types";

const API_BASE = "https://www.googleapis.com/youtube/v3";
export const REVALIDATE_SECONDS = 900; // YouTube data is cached for 15 minutes

export class YouTubeApiError extends Error {
  constructor(
    public code: YouTubeErrorCode,
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "YouTubeApiError";
  }
}

interface Thumb {
  url: string;
}
interface Thumbs {
  maxres?: Thumb;
  standard?: Thumb;
  high?: Thumb;
  medium?: Thumb;
  default?: Thumb;
}
interface ChannelsResponse {
  items?: {
    id: string;
    snippet?: { title?: string; thumbnails?: Thumbs };
    statistics?: { subscriberCount?: string; hiddenSubscriberCount?: boolean };
    contentDetails?: { relatedPlaylists?: { uploads?: string } };
  }[];
}
interface PlaylistResponse {
  items?: {
    snippet?: { title?: string; publishedAt?: string; thumbnails?: Thumbs };
    contentDetails?: { videoId?: string; videoPublishedAt?: string };
  }[];
}

async function request<T>(endpoint: string, params: Record<string, string>) {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) throw new YouTubeApiError("not_configured", 503, "YOUTUBE_API_KEY is not set");

  const url = new URL(`${API_BASE}/${endpoint}`);
  for (const [name, value] of Object.entries(params)) url.searchParams.set(name, value);
  url.searchParams.set("key", key);

  let res: Response;
  try {
    res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
  } catch {
    throw new YouTubeApiError("upstream", 502, "Could not reach the YouTube API");
  }

  if (!res.ok) {
    let reason = "";
    try {
      const body = await res.json();
      reason = body?.error?.errors?.[0]?.reason ?? "";
    } catch {
      /* ignore */
    }
    if (reason === "quotaExceeded" || reason === "rateLimitExceeded") {
      throw new YouTubeApiError("quota", 503, "YouTube API quota exceeded");
    }
    throw new YouTubeApiError(
      "upstream",
      502,
      `YouTube API responded with ${res.status}${reason ? ` (${reason})` : ""}`,
    );
  }

  const dateHeader = res.headers.get("date");
  const fetchedAt = dateHeader ? new Date(dateHeader) : new Date();
  return { data: (await res.json()) as T, fetchedAt };
}

const bestThumb = (t?: Thumbs) =>
  t?.maxres?.url ?? t?.standard?.url ?? t?.high?.url ?? t?.medium?.url ?? t?.default?.url ?? null;

export async function getChannelData(limit = 6): Promise<YouTubePayload> {
  const channelId = process.env.YOUTUBE_CHANNEL_ID;
  const handle = process.env.YOUTUBE_CHANNEL_HANDLE || siteConfig.youtube.handle;

  const channelRes = await request<ChannelsResponse>("channels", {
    part: "snippet,statistics,contentDetails",
    ...(channelId ? { id: channelId } : { forHandle: handle }),
  });
  const channel = channelRes.data.items?.[0];
  if (!channel) throw new YouTubeApiError("channel_not_found", 404, "Channel not found");

  let videos: YouTubeVideo[] = [];
  let fetchedAt = channelRes.fetchedAt;

  const uploadsId = channel.contentDetails?.relatedPlaylists?.uploads;
  if (uploadsId) {
    const list = await request<PlaylistResponse>("playlistItems", {
      part: "snippet,contentDetails",
      playlistId: uploadsId,
      maxResults: String(Math.min(limit * 2, 50)), // headroom for private/deleted entries
    });
    if (list.fetchedAt < fetchedAt) fetchedAt = list.fetchedAt;

    videos = (list.data.items ?? [])
      .flatMap((item) => {
        const id = item.contentDetails?.videoId;
        const thumbnail = bestThumb(item.snippet?.thumbnails);
        const title = item.snippet?.title;
        // Private and deleted videos have no thumbnails; skip them.
        if (!id || !thumbnail || !title) return [];
        return [
          {
            id,
            title,
            thumbnail,
            publishedAt: item.contentDetails?.videoPublishedAt ?? item.snippet?.publishedAt ?? "",
            url: `https://www.youtube.com/watch?v=${id}`,
          },
        ];
      })
      .slice(0, limit);
  }

  const hidden = channel.statistics?.hiddenSubscriberCount ?? false;
  const subs = channel.statistics?.subscriberCount;

  return {
    channel: {
      title: channel.snippet?.title ?? siteConfig.name,
      url: siteConfig.youtube.url,
      avatar: bestThumb(channel.snippet?.thumbnails),
      subscriberCount: hidden || subs === undefined ? null : Number(subs),
      subscribersHidden: hidden,
    },
    videos,
    updatedAt: fetchedAt.toISOString(),
  };
}
