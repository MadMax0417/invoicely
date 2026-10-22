import Link from "next/link";

const BIO_TOOL_URL = "https://bio.saarthistudio.com";

export default function SiteFooter() {
  return (
    <footer className="border-t border-gray-200/80 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-gray-900">
            Invoicely — a free tool by Saarthi Studio
          </p>
          <p className="text-[13px] leading-relaxed text-gray-500">
            No sign-up. Your draft stays in this browser and disappears when you close the
            tab. PDFs are generated on your device.
          </p>
        </div>
        <div className="flex items-center gap-8 text-sm">
          <a
            href={BIO_TOOL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-gray-600 transition hover:text-indigo-600"
          >
            Check out - Bio by Saarthi ↗
          </a>
          <Link href="/privacy" className="font-medium text-gray-600 transition hover:text-indigo-600">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
