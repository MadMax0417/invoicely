/**
 * JSON-LD nodes for the whole site, in one place.
 *
 * Every node is referenced by a stable `@id` instead of being re-declared
 * inline. Answer engines resolve entities across a document by `@id`, so
 * duplicating "Saarthi Studio" as a literal object in three places (as the
 * first version of this markup did) gives them three anonymous organizations
 * instead of one recognizable brand.
 *
 * Keep this file free of React and of page copy — it is a data module.
 */

export const SITE_URL = "https://invoicely.saarthistudio.com";
export const STUDIO_URL = "https://www.saarthistudio.com";

export const ORG_ID = `${STUDIO_URL}/#organization`;
export const SITE_ID = `${SITE_URL}/#website`;
export const APP_ID = `${SITE_URL}/#app`;

export type JsonLd = Record<string, unknown>;

export const organization: JsonLd = {
  "@type": "Organization",
  "@id": ORG_ID,
  name: "Saarthi Studio",
  url: STUDIO_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/icon.svg`,
    width: 64,
    height: 64,
  },
};

export const website: JsonLd = {
  "@type": "WebSite",
  "@id": SITE_ID,
  name: "Invoicely",
  url: SITE_URL,
  inLanguage: "en",
  publisher: { "@id": ORG_ID },
};

/** The product itself. Same `@id` on every page that describes it. */
export function app(featureList?: string[]): JsonLd {
  return {
    "@type": "SoftwareApplication",
    "@id": APP_ID,
    name: "Invoicely",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: `${SITE_URL}/tool`,
    inLanguage: "en",
    description:
      "Create and download professional invoices in seconds. Free, no sign-up — your data never leaves your browser.",
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    ...(featureList ? { featureList } : {}),
    screenshot: `${SITE_URL}/opengraph-image`,
    publisher: { "@id": ORG_ID },
    isPartOf: { "@id": SITE_ID },
  };
}

export function faqPage(faqs: { q: string; a: string }[]): JsonLd {
  return {
    "@type": "FAQPage",
    "@id": `${SITE_URL}/#faq`,
    isPartOf: { "@id": SITE_ID },
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };
}

/** Breadcrumb trail; `path` is relative to the site root ("/" for the home). */
export function breadcrumb(trail: { name: string; path: string }[]): JsonLd {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.path === "/" ? SITE_URL : `${SITE_URL}${item.path}`,
    })),
  };
}

/** Wrap nodes in a single `@graph` so a page ships one JSON-LD block. */
export function graph(nodes: JsonLd[]): JsonLd {
  return { "@context": "https://schema.org", "@graph": nodes };
}
