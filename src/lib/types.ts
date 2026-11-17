export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  url: string;
}

export interface YouTubeChannel {
  title: string;
  url: string;
  avatar: string | null;
  subscriberCount: number | null;
  subscribersHidden: boolean;
}

export interface YouTubePayload {
  channel: YouTubeChannel;
  videos: YouTubeVideo[];
  /** When YouTube data was actually fetched (ISO string). */
  updatedAt: string;
}

export type YouTubeErrorCode = "not_configured" | "channel_not_found" | "quota" | "upstream";
