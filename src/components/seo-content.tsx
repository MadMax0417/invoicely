import Link from "next/link";

const SITE_URL = "https://invoicely.saarthistudio.com";

/**
 * Compact, colophon-style SEO/AEO block: one visible H1 + sentence, the rest
 * collapsed into native <details> accordions. Collapsed content stays fully
 * crawlable, and the JSON-LD text is shared with the visible FAQ below.
 */
const STEPS = [
  "Fill in your business details, the client's invoice, and the line items.",
  "Watch the live A4 preview update as you type — totals, logo and your brand color.",
  "Download the PDF. It is generated on your own device, never on a server.",
];

const FEATURES = [
  "No sign-up or account of any kind",
  "Data never leaves your device",
  "Live A4 preview — exactly what you download",
  "12 currencies with correct ₹ formatting",
  "Percentage or flat discounts, plus tax rates",
  "Your logo and brand color on every invoice",
  "Free forever — no ads, no trackers",
];

const FAQS = [
  {
    q: "Is Invoicely really free?",
    a: "Yes — creating and downloading invoices is completely free. There is no paid tier, no watermark and nothing is locked behind sign-up.",
  },
  {
    q: "Do I need to create an account?",
    a: "No. There is no sign-up, no login and no email required. Open the page and start filling in your invoice right away.",
  },
  {
    q: "Where is my invoice data stored?",
    a: "In your browser only, in sessionStorage. Your draft is erased automatically when you close the tab, and nothing — not your invoice or your details — is ever sent to a server.",
  },
  {
    q: "Which currencies can I use?",
    a: "Twelve: Indian Rupee (₹), US Dollar, Euro, British Pound, UAE Dirham, Saudi Riyal, Qatari Riyal, Singapore Dollar, Australian Dollar, Canadian Dollar, Malaysian Ringgit and Japanese Yen — each with correct amount formatting, including lakh/crore grouping for ₹.",
  },
  {
    q: "Can I add discounts and tax?",
    a: "Yes. Add line items, then apply a percentage or flat discount and a tax rate — totals recalculate live and appear on the downloaded PDF.",
  },
];

const LD_JSON = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "Invoicely",
      url: SITE_URL,
      publisher: {
        "@type": "Organization",
        name: "Saarthi Studio",
        url: "https://www.saarthistudio.com",
      },
    },
    {
      "@type": "SoftwareApplication",
      name: "Invoicely",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: SITE_URL,
      description:
        "Create and download professional invoices in seconds. Free, no sign-up — your data never leaves your browser.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
      publisher: {
        "@type": "Organization",
        name: "Saarthi Studio",
        url: "https://www.saarthistudio.com",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQS.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: { "@type": "Answer", text: faq.a },
      })),
    },
  ],
};

function Chevron() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="shrink-0 text-gray-400 transition-transform group-open:rotate-180"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function Details({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="group">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-3 text-sm font-medium text-gray-700 transition hover:text-gray-900 [&::-webkit-details-marker]:hidden">
        {title}
        <Chevron />
      </summary>
      <div className="pb-5 text-[14px] leading-relaxed text-gray-500">{children}</div>
    </details>
  );
}

export default function SeoContent() {
  return (
    <section aria-label="About Invoicely" className="border-t border-gray-200/80 bg-white">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <h1 className="text-lg font-semibold tracking-tight text-gray-900">
          Free Invoice Maker — Create Invoices Online, Download as PDF
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed text-gray-500">
          A simple form becomes a clean, professional PDF. Everything runs in your
          browser — no sign-up, no server, no cost, and your draft vanishes with the tab.
        </p>

        <div className="mt-6 divide-y divide-gray-200/80">
          <Details title="How it works">
            <ol className="list-decimal space-y-1.5 pl-5">
              {STEPS.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </Details>

          <Details title="Why Invoicely">
            <ul className="list-disc space-y-1.5 pl-5">
              {FEATURES.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </Details>

          <Details title="FAQ">
            <dl className="space-y-3">
              {FAQS.map((faq) => (
                <div key={faq.q}>
                  <dt className="text-[14px] font-medium text-gray-700">{faq.q}</dt>
                  <dd className="mt-0.5">{faq.a}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4">
              Every promise here is written down in the{" "}
              <Link
                href="/privacy"
                className="font-medium text-indigo-600 underline-offset-2 transition hover:underline"
              >
                privacy note
              </Link>
              .
            </p>
          </Details>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(LD_JSON) }}
      />
    </section>
  );
}
