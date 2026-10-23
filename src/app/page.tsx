import { CtaBand, Faq, Features, HowItWorks } from "@/components/marketing";
import SiteFooter from "@/components/site-footer";
import Hero from "@/components/hero";

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
