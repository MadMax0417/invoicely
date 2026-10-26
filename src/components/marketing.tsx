import Link from "next/link";
import { BIO_LINKS } from "@/lib/links";
import { app, faqPage, graph, organization, website } from "@/lib/schema";

const KICKER_CLS =
  "text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400";
const H2_CLS = "text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl";

const STEPS = [
  "Fill in your business details, the client's invoice, and the line items.",
  "Watch the live A4 preview update as you type — totals, logo and your brand color.",
  "Download the PDF. It is generated on your own device, never on a server.",
];

const FEATURES = [
  {
    title: "No account, ever",
    desc: "Open the page and start — there is nothing to register, verify or pay for.",
  },
  {
    title: "Private by design",
    desc: "Drafts live in your browser's sessionStorage and vanish when the tab closes. PDFs are generated on your device — nothing is ever uploaded.",
  },
  {
    title: "Live A4 preview",
    desc: "The page you fill is the page you download — totals, logo and accent color, always in sync.",
  },
  {
    title: "12 currencies",
    desc: "From ₹ with proper lakh/crore grouping to USD, EUR, GBP and JPY — amounts format themselves.",
  },
  {
    title: "Discounts & tax",
    desc: "Percentage or flat discounts plus tax rates, recalculated live as you type.",
  },
  {
    title: "Your branding",
    desc: "Add your logo and your accent color — the PDF looks like you sent it.",
  },
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

const LD_JSON = graph([
  organization,
  website,
  app(FEATURES.map((feature) => feature.title)),
  faqPage(FAQS),
]);

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

export function HowItWorks() {
  return (
    <section id="how" aria-labelledby="how-title" className="border-t border-gray-200/70 bg-white">
      <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
        <p className={KICKER_CLS}>How it works</p>
        <h2 id="how-title" className={`${H2_CLS} mt-2`}>
          Three steps, about a minute
        </h2>
        <ol className="mt-8 divide-y divide-gray-200/70 border-y border-gray-200/70">
          {STEPS.map((step, i) => (
            <li key={step} className="flex gap-4 py-5">
              <span className="w-8 shrink-0 text-[13px] font-semibold text-indigo-600 tabular-nums">
                0{i + 1}
              </span>
              <p className="text-[15px] leading-relaxed text-gray-600">{step}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Features() {
  return (
    <section aria-labelledby="features-title" className="border-t border-gray-200/70 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <p className={KICKER_CLS}>Why Invoicely</p>
        <h2 id="features-title" className={`${H2_CLS} mt-2`}>
          Everything paid tools make you work for
        </h2>
        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-gray-200/70 bg-gray-200/70 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="bg-white p-6">
              <p className="text-[14px] font-semibold text-gray-900">{feature.title}</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-gray-500">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Faq() {
  return (
    <section aria-labelledby="faq-title" className="border-t border-gray-200/70 bg-white">
      <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
        <p className={KICKER_CLS}>FAQ</p>
        <h2 id="faq-title" className={`${H2_CLS} mt-2`}>
          Questions, answered
        </h2>
        <div className="mt-6 divide-y divide-gray-200/70">
          <Details title="Is Invoicely really free?">
            <p>{FAQS[0].a}</p>
          </Details>
          <Details title="Do I need to create an account?">
            <p>{FAQS[1].a}</p>
          </Details>
          <Details title="Where is my invoice data stored?">
            <p>{FAQS[2].a}</p>
          </Details>
          <Details title="Which currencies can I use?">
            <p>{FAQS[3].a}</p>
          </Details>
          <Details title="Can I add discounts and tax?">
            <p>{FAQS[4].a}</p>
          </Details>
        </div>
        <p className="mt-4 text-[13px] text-gray-400">
          Every promise here is written down in the{" "}
          <Link
            href="/privacy"
            className="font-medium text-indigo-600 underline-offset-2 transition hover:underline"
          >
            privacy note
          </Link>
          .
        </p>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(LD_JSON) }}
      />
    </section>
  );
}

export function CtaBand() {
  return (
    <section className="bg-indigo-600">
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Your first invoice is about a minute away.
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-indigo-100">
          No sign-up, no ads, no trackers — free forever.
        </p>
        <Link
          href="/tool"
          className="mt-8 inline-flex h-12 items-center rounded-xl bg-white px-6 text-[15px] font-semibold text-indigo-700 shadow-sm transition hover:bg-indigo-50"
        >
          Make an invoice now
        </Link>
        <p className="mt-6 text-[13px] text-indigo-200">
          Need one link for your work, contacts and payments?{" "}
          <a
            href={BIO_LINKS.homepage}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-white underline-offset-2 transition hover:underline"
          >
            Try Bio by Saarthi ↗
          </a>
        </p>
      </div>
    </section>
  );
}
