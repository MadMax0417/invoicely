import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How Invoicely handles your data — it stays on your device.",
  alternates: { canonical: "./" },
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-16 sm:px-6">
      <Link
        href="/"
        className="text-sm font-medium text-indigo-600 transition hover:text-indigo-700"
      >
        ← Back to Invoicely
      </Link>

      <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">Privacy</h1>
      <p className="mt-2 text-[15px] text-gray-500">
        Last updated: October 22, 2026
      </p>

      <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-gray-700">
        <p>
          Invoicely is built on a simple promise: <strong>your invoice never leaves your
          device.</strong>
        </p>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">What we store</h2>
          <p>
            Nothing on our servers — we have none for this tool. While you work, your
            draft is kept in your browser&apos;s <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">sessionStorage</code>.
            It is erased automatically the moment you close the tab or the browser. No
            timers, no background sync, no copies.
          </p>
          <p>
            There&apos;s one more thing in there: a single anonymous number counting
            your downloads this session. We use it only to decide when to show the card
            after you download — it contains nothing about you or your invoices and is
            erased with your tab, just like your draft.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">How your PDF is made</h2>
          <p>
            The PDF is generated entirely in your browser and downloaded straight to
            you. No invoice content is uploaded, logged, or seen by anyone else.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">Accounts &amp; tracking</h2>
          <p>
            No account is required and none is offered for this tool. We do not use
            advertising trackers. If analytics are ever added, they will be aggregated
            (page views only) and never tied to your invoice content.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">Third-party links</h2>
          <p>
            Invoicely links to other Saarthi Studio products. Visiting them is your
            choice and their own privacy policies apply.
          </p>
        </section>

        <p className="border-t border-gray-200 pt-6 text-sm text-gray-500">
          Questions? Reach out via{" "}
          <a
            href="https://bio.saarthistudio.com"
            className="font-medium text-indigo-600 hover:underline"
          >
            Saarthi Studio
          </a>
          .
        </p>
      </div>
    </main>
  );
}
