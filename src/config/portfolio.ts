/**
 * PORTFOLIO PROJECTS
 * ------------------
 * Add, edit or remove entries in the `projects` array below.
 *
 * - Add a project:    copy one object, give it a unique `id`, set `youtubeId`.
 * - Edit a project:   change its title, category, description or youtubeId.
 * - Remove a project: delete its object.
 *
 * `youtubeId` is the part after "v=" (or after "/shorts/") in a YouTube link:
 *   https://www.youtube.com/watch?v=dQw4w9WgXcQ   ->  "dQw4w9WgXcQ"
 *   https://youtube.com/shorts/2DEJtbOb08k?si=..  ->  "2DEJtbOb08k"
 *
 * Use orientation: "vertical" for Shorts (9:16) and leave it out for normal 16:9 videos.
 *
 * Category filter tabs appear automatically, and only for categories that
 * have at least one project. Entries WITHOUT a `youtubeId` are shown as
 * clearly labelled placeholders.
 */

export const categories = [
  "Anime Edits",
  "Movie Edits",
  "Famous Personalities",
  "Gaming Edits",
  "Cinematic Edits",
] as const;

export type Category = (typeof categories)[number];

export interface Project {
  id: string;
  title: string;
  category: Category;
  /** YouTube video ID. Leave undefined for a placeholder slot. */
  youtubeId?: string;
  /** "vertical" for Shorts (9:16). Defaults to horizontal (16:9). */
  orientation?: "horizontal" | "vertical";
  /** Optional custom thumbnail (path in /public or a full URL). Defaults to the YouTube thumbnail. */
  thumbnail?: string;
  /** Optional second the hover preview starts from. */
  previewStart?: number;
  /** Optional one-line description shown on the card. */
  description?: string;
}

export const projects: Project[] = [
  // --- Anime Edits ---
  { id: "anime-1", title: "Anime Edit 1", category: "Anime Edits", youtubeId: "GEJ79XJUJ-o", orientation: "vertical" },
  { id: "anime-2", title: "Anime Edit 2", category: "Anime Edits", youtubeId: "FHZ1ZT-SqJU", orientation: "vertical" },

  // --- Movie Edits ---
  { id: "movie-1", title: "Movie Edit 1", category: "Movie Edits", youtubeId: "2DEJtbOb08k", orientation: "vertical" },
  { id: "movie-2", title: "Movie Edit 2", category: "Movie Edits", youtubeId: "xjqntNmcRWc", orientation: "vertical" },

  // --- Famous Personalities ---
  { id: "personality-1", title: "Famous Personality Edit 1", category: "Famous Personalities", youtubeId: "PHgwhe6agS0", orientation: "vertical" },
  { id: "personality-2", title: "Famous Personality Edit 2", category: "Famous Personalities", youtubeId: "aDbxZgXNxxw", orientation: "vertical" },

  // --- Gaming Edits / Cinematic Edits: add projects here when you have them ---
];
