import Link from "next/link";
import InvoicePreview from "@/components/invoice-preview";
import { STUDIO_LINKS } from "@/lib/links";
import { SAMPLE_INVOICE, SAMPLE_TOTALS } from "@/lib/sample-invoice";

/**
 * Marketing homepage hero — minimalism: thin type, hairlines, generous
 * whitespace, one restrained load animation. The visual is the REAL
 * InvoicePreview with sample data: the page demos the actual product.
 */
export default function Hero() {
  return (
    <header className="bg-gray-50">
      {/* Slim top bar */}
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 pt-6 sm:px-6">
        <div className="flex items-baseline gap-2.5">
          <span className="text-[17px] font-bold tracking-tight text-gray-900">
            Invoicely
          </span>
          <a
            href={STUDIO_LINKS.homepage}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-medium text-gray-400 transition hover:text-indigo-600"
          >
            by Saarthi Studio ↗
          </a>
        </div>
        <Link
          href="/tool"
          className="text-sm font-medium text-gray-500 transition hover:text-gray-900"
        >
          Open the tool →
        </Link>
      </div>

      <div className="mx-auto grid max-w-6xl gap-12 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-14 lg:pb-24 lg:pt-16">
        {/* Copy */}
        <div>
          <p className="fade-up text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">
            Free forever · No sign-up
          </p>
          <h1 className="fade-up delay-1 mt-3 text-4xl font-semibold leading-[1.08] tracking-tight text-gray-900 sm:text-5xl">
            <span className="text-indigo-600">Free Invoice Maker</span> — Create
            &amp; Download PDF Invoices Online
          </h1>
          <p className="fade-up delay-2 mt-5 max-w-xl text-[15px] leading-relaxed text-gray-500 sm:text-base">
            Fill in a simple form and watch the A4 page take shape — then download a
            clean PDF. Everything runs in your browser: no sign-up, no server, and
            your draft disappears the moment you close the tab.
          </p>
          <div className="fade-up delay-3 mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link
              href="/tool"
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-indigo-600 px-6 text-[15px] font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              Make an invoice now
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M5 12h14" />
                <path d="m13 6 6 6-6 6" />
              </svg>
            </Link>
            <Link
              href="#how"
              className="text-sm font-medium text-gray-500 transition hover:text-gray-900"
            >
              See how it works ↓
            </Link>
          </div>
          <p className="fade-up delay-3 mt-6 text-[13px] text-gray-400">
            12 currencies · Discounts &amp; tax · Your logo &amp; brand color
          </p>
        </div>

        {/* The real preview, framed in a browser chrome */}
        <div className="fade-up delay-2 relative">
          <div className="rounded-2xl border border-gray-200/80 bg-white shadow-[0_16px_48px_-16px_rgba(16,24,40,0.12)]">
            <div className="flex items-center gap-2 border-b border-gray-200/70 px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-gray-200" />
              <span className="h-2.5 w-2.5 rounded-full bg-gray-200" />
              <span className="h-2.5 w-2.5 rounded-full bg-gray-200" />
              <span className="flex flex-1 justify-center">
                <span className="rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] text-gray-400">
                  invoicely.saarthistudio.com
                </span>
              </span>
              <span className="w-10" />
            </div>
            <div className="overflow-x-auto bg-gray-50 p-4 sm:p-6">
              <div className="min-w-[320px]">
                <InvoicePreview data={SAMPLE_INVOICE} totals={SAMPLE_TOTALS} />
              </div>
            </div>
          </div>
          <p className="absolute -bottom-4 left-6 rounded-xl border border-gray-200/80 bg-white px-3 py-1.5 text-[12px] font-medium text-gray-500 shadow-sm">
            Live A4 preview — always in sync
          </p>
        </div>
      </div>
    </header>
  );
}
