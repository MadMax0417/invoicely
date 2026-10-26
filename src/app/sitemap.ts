import type { MetadataRoute } from "next";

const BASE_URL = "https://invoicely.saarthistudio.com";

/**
 * Dates are hard-coded per page and bumped when that page's content actually
 * changes.
 *
 * `lastModified: new Date()` (the shape in the Next docs) stamps every URL with
 * "modified right now" on every request — the route can't be cached, and
 * crawlers learn to distrust the signal. Bump the date in the same commit as
 * the content change.
 */
const PAGES: {
  path: string;
  lastModified: string;
  changeFrequency: "monthly" | "yearly";
  priority: number;
}[] = [
  { path: "/", lastModified: "2026-10-26", changeFrequency: "monthly", priority: 1 },
  { path: "/tool", lastModified: "2026-10-26", changeFrequency: "monthly", priority: 0.9 },
  { path: "/privacy", lastModified: "2026-10-22", changeFrequency: "yearly", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map((page) => ({
    url: page.path === "/" ? BASE_URL : `${BASE_URL}${page.path}`,
    lastModified: page.lastModified,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
