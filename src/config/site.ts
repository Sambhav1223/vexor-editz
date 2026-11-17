/**
 * Central site configuration.
 * Edit the values below to change links, contact details and navigation.
 */

function resolveSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "http://localhost:3000";
}

export const siteConfig = {
  name: "VEXOR EDITZ",
  logo: "VEXOR",
  title: "VEXOR EDITZ | Video Editor Portfolio",
  description:
    "Portfolio of VEXOR EDITZ, a video editor specializing in anime, movie, gaming and cinematic edits with motion graphics and creative storytelling.",
  url: resolveSiteUrl(),

  youtube: {
    handle: "@VexorEditzOfficial",
    url: "https://www.youtube.com/@VexorEditzOfficial",
  },

  /**
   * Contact details. Leave a value empty ("") and the site shows "Coming soon"
   * instead of a broken link. Nothing here is invented: fill in your own.
   */
  contact: {
    email: "vexorforbusinessyt0077@gmail.com",
    discordHandle: "", // optional, e.g. "vexor.editz" (adds a copy button)
    discordUrl: "https://discord.gg/Fa7UrGNtM",
  },

  nav: [
    { label: "Home", href: "#home" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ],
} as const;
