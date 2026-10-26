import type { MetadataRoute } from "next";

const BASE_URL = "https://invoicely.saarthistudio.com";

/**
 * AI crawler policy — reviewed 2026-10-26.
 *
 * Invoicely is a free, public, stateless tool: no accounts, no server-side
 * invoice storage, nothing personal to protect. Being readable, quotable and
 * citable by answer engines IS the acquisition strategy, so the policy is
 * "allow everything" — but the agents that matter are named explicitly instead
 * of relying on the `*` wildcard. Explicit groups survive a future tightening
 * of the catch-all rule, and they document the decision for whoever edits this
 * file next.
 *
 * Discovery files served alongside this one:
 *   /llms.txt        index for LLM ingestion (facts + page map)
 *   /llms-full.txt   full site text in one fetch
 *   /sitemap.xml     HTML pages
 *
 * Do not add a Disallow to this file without a written business decision —
 * see seo_changes.md. Blocking by accident is the most common AEO failure.
 */

/** Crawlers that produce AI answers, citations or search results we want. */
const AI_CRAWLERS = [
  // OpenAI — ChatGPT browsing, search and training
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  // Anthropic — Claude responses, user-initiated fetches, search
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  // Perplexity — real-time answers with citations
  "PerplexityBot",
  "Perplexity-User",
  // Google — Gemini training/grounding (separate from Googlebot)
  "Google-Extended",
  // Apple — Siri and Apple Intelligence
  "Applebot",
  "Applebot-Extended",
  // Everything else with meaningful distribution
  "Amazonbot",
  "Meta-ExternalAgent",
  "MistralAI-User",
  "DuckAssistBot",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Baseline: the whole site is public and safe to crawl.
      { userAgent: "*", allow: "/" },
      // Named allow-list: same permission, explicit intent.
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
