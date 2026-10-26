import type { Metadata } from "next";
import { CtaBand, Faq, Features, HowItWorks } from "@/components/marketing";
import SiteFooter from "@/components/site-footer";
import Hero from "@/components/hero";

/** Meta keywords live here, not in the root layout: layout metadata is
 *  inherited by every route, which was leaking the homepage's head terms
 *  ("invoice generator", "free invoice maker") onto /tool and /privacy.
 *  Google ignores the tag, but the leak is still a cannibalization smell for
 *  every other crawler that reads it. */
export const metadata: Metadata = {
  keywords: [
    "free invoice maker",
    "invoice generator",
    "create invoice online",
    "invoice maker no sign up",
    "download invoice pdf",
  ],
};

/** Marketing homepage. Title/description/OG/robots come from the root layout
 *  (default metadata) — the homepage owns the "free invoice maker" head terms
 *  and funnels to /tool where the actual editor lives. */
export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Features />
      <Faq />
      <CtaBand />
      <SiteFooter />
    </>
  );
}
