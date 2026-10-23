import type { Metadata } from "next";
import Editor from "@/components/editor";
import SiteFooter from "@/components/site-footer";

/**
 * The tool itself. Route-level metadata distinguishes it from the marketing
 * homepage WITHOUT reusing the homepage's "invoice maker" head term
 * (cannibalization rule in seo_changes.md): the homepage owns search queries,
 * /tool is where referrals land to do the work.
 */
export const metadata: Metadata = {
  title: "Create an Invoice — Free, Instant, No Sign-Up",
  description:
    "Fill the form, preview the A4 page live and download a clean PDF with your logo, discounts and tax — generated on your own device.",
  alternates: { canonical: "./" },
  openGraph: {
    title: "Create an Invoice — Free, Instant, No Sign-Up · Invoicely",
    description:
      "Fill the form, preview the A4 page live and download a clean PDF — generated on your own device.",
    url: "https://invoicely.saarthistudio.com/tool",
  },
  twitter: {
    title: "Create an Invoice — Free, Instant, No Sign-Up · Invoicely",
    description:
      "Fill the form, preview the A4 page live and download a clean PDF — generated on your own device.",
  },
};

export default function ToolPage() {
  return (
    <>
      <Editor />
      <SiteFooter />
    </>
  );
}
