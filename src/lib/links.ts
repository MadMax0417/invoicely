/**
 * UTM-tagged outbound destinations. Every click from Invoicely to Bio by
 * Saarthi (or the studio site) must be attributable in their analytics —
 * this is the funnel measured by `seo_changes.md` (P1). Never link to Bio
 * or the studio from this site without going through this module.
 */

const BIO_BASE = "https://bio.saarthistudio.com";
const STUDIO_BASE = "https://www.saarthistudio.com";

function tagged(base: string, medium: string, campaign = "bio_cta"): string {
  return `${base}/?utm_source=invoicely&utm_medium=${medium}&utm_campaign=${campaign}`;
}

/** Bio by Saarthi — the product Invoicely markets. */
export const BIO_LINKS = {
  /** The explainer card shown every 5th download (and on the 1st). */
  popup: tagged(BIO_BASE, "popup"),
  /** Footer link, site-wide. */
  footer: tagged(BIO_BASE, "footer"),
  /** Marketing homepage CTA band. */
  homepage: tagged(BIO_BASE, "homepage"),
  /** Privacy page "reach out" contact link. */
  privacy: tagged(BIO_BASE, "privacy"),
} as const;

/** Saarthi Studio — the maker. */
export const STUDIO_LINKS = {
  /** Badge in the tool's header. */
  header: tagged(STUDIO_BASE, "header", "studio_link"),
  /** Footnote inside the Bio download card. */
  popupFootnote: tagged(STUDIO_BASE, "popup", "studio_link"),
  /** Brand mention in the marketing homepage top bar. */
  homepage: tagged(STUDIO_BASE, "homepage", "studio_link"),
} as const;
