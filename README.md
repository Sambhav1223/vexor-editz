# VEXOR EDITZ Portfolio

Next.js 15 (App Router), TypeScript, Tailwind CSS, Motion, Lucide icons and the YouTube Data API v3.

## 1. Install dependencies

Requires Node.js 18.18 or newer.

```bash
npm install
```

## 2. Run locally

```bash
cp .env.example .env.local   # then add your YouTube API key (see step 3)
npm run dev
```

Open http://localhost:3000. The site works without an API key: the YouTube section shows a clear "not connected" message until you add one.

Useful commands: `npm run build` (production build), `npm run start` (serve it), `npm run typecheck`.

## 3. Configure the YouTube API key securely

1. Go to https://console.cloud.google.com and create (or select) a project.
2. Open **APIs & Services > Library**, search for **YouTube Data API v3** and click **Enable**.
3. Open **APIs & Services > Credentials > Create credentials > API key**.
4. Click **Edit API key** and under **API restrictions** choose **Restrict key > YouTube Data API v3**. (Do not use "HTTP referrer" restrictions: the key is called from the server, not the browser.)
5. Put the key in `.env.local`:

   ```
   YOUTUBE_API_KEY=your_key_here
   ```

Why this is safe: the key is only read in `src/lib/youtube.ts`, which runs on the server behind `/api/youtube`. The variable has no `NEXT_PUBLIC_` prefix, so it is never sent to the browser. `.env.local` is git-ignored. Never paste the key into a component or commit it.

How the feed behaves:
- The channel is found from the handle in `src/config/site.ts` (`@VexorEditzOfficial`).
- Responses are cached on the server for 15 minutes, and the page re-checks every 10 minutes while open and when the tab regains focus. Each refresh costs about 2 quota units out of the 10,000 free per day.
- "Last updated" shows when YouTube data was actually fetched.
- Subscriber counts come as YouTube provides them (rounded to 3 significant digits), so the site shows e.g. "12.3K" rather than a false exact number. If the channel hides its count, the site says so.

## 4. Deploy on Vercel

1. Push this folder to a GitHub repository.
2. On https://vercel.com click **Add New > Project** and import the repository. Framework is detected as Next.js; keep the defaults.
3. Under **Environment Variables** add:
   - `YOUTUBE_API_KEY` = your key
   - `NEXT_PUBLIC_SITE_URL` = your live address, e.g. `https://vexoreditz.com` (used for SEO and link previews)
4. Click **Deploy**. Later pushes to the main branch redeploy automatically.
5. If you add or change environment variables after deploying, redeploy once so they apply.

## 5. Add, edit and remove portfolio projects

Everything lives in `src/config/portfolio.ts`.

- **Add:** copy an object in the `projects` array, give it a unique `id`, a `title`, a `category` (Anime Edits, Movie Edits, Gaming Edits or Cinematic Edits) and the `youtubeId`.
- **Edit:** change any field on the object.
- **Remove:** delete the object.

`youtubeId` is the part after `v=` in the video link (`https://www.youtube.com/watch?v=dQw4w9WgXcQ` gives `dQw4w9WgXcQ`).

Use `orientation: "vertical"` for Shorts (9:16); leave it out for normal 16:9 videos. Shorts links work too: the ID is the part after `/shorts/`. Filter tabs appear only for categories that have projects.

Optional fields: `description` (one line on the card), `thumbnail` (a custom image path or URL, e.g. `/thumbs/my-edit.jpg` from the `public` folder) and `previewStart` (second the hover preview starts at).

Entries with no `youtubeId` render as clearly labelled **Placeholder** cards with a disabled button. The eight starter entries are placeholders; replace or delete them as you add real work. Hover previews are muted and only play on devices with a mouse.

## 6. Configure contact and social links

Edit `src/config/site.ts`:

```ts
contact: {
  email: "",          // your email address
  discordHandle: "",  // your Discord username
  discordUrl: "",     // optional Discord invite/profile link
},
youtube: { handle: "@VexorEditzOfficial", url: "https://www.youtube.com/@VexorEditzOfficial" },
```

Empty values display "Coming soon" instead of a broken link. The enquiry form opens the visitor's email app with a pre-filled message to your `email`, and is disabled until you set one.

## Other things you may want to change

- **Software list:** `src/config/tools.ts`. The Adobe cards use simple lookalike badges; to use official logos, add the files to `public/logos` and swap them into `src/components/ToolCard.tsx`.
- **Copy:** hero text is in `src/components/Hero.tsx`, about text in `src/components/About.tsx`, contact heading in `src/components/Contact.tsx`.
- **Colours:** `tailwind.config.ts` (`ink`, `surface`, `accent`, `accent.soft`, `muted`).
- **Fonts:** Big Shoulders (headings) and Hanken Grotesk (body), set up in `src/app/layout.tsx`.
- **Favicon / share image:** `src/app/icon.svg` and `src/app/opengraph-image.tsx`.

## Project structure

```
src/
  app/            layout, page, API route (/api/youtube), SEO files
  components/     Hero, Portfolio, ProjectCard, VideoModal, YouTubeSection, About, Contact, ...
  config/         site.ts, portfolio.ts, tools.ts   <- the files you edit
  lib/            youtube.ts (server only), utils, types
```
