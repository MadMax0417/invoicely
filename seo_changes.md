# SEO & Growth Changes — Invoicely

> Goal reframe: **Invoicely is the free lead-gen engine for Bio by Saarthi**
> (`bio.saarthistudio.com`). Organic search brings people in to use the free
> invoice tool, and every surface of the tool markets Bio. This file is the
> working checklist — derived from the Oct 2026 repo + live audit. Check items
> off as they ship.

Status key: [ ] todo · [~] in progress · [x] done

---

## The funnel we're building

```
Search / social → tool session (free, no sign-up)
  → invoice built → download (1st & every 5th: Bio popup)
  → PDF carries "Made with Invoicely" footer → client opens it
      ↳ client is ALSO the Bio ICP (freelancers/creators) → new session
```

Stage metrics: organic sessions → downloads → outbound Bio clicks
(UTM-tagged) → Bio signup (measured in Bio's analytics).

---

## P0 — Blocking (nothing else moves until these are green)

- [ ] **Deploy the site.** Every URL on `https://invoicely.saarthistudio.com`
  currently returns `404` (`x-vercel-error: DEPLOYMENT_NOT_FOUND`, behind
  Cloudflare). Redeploy in Vercel and assign the domain. Related: `pending.md`
  item 3 ("subdomain").
  *Metric: index coverage 0% → ≥90%. Unblocks all organic visibility.*

- [ ] **Verify SEO endpoints return 200 after deploy:**
  `/` · `/robots.txt` (src/app/robots.ts) · `/sitemap.xml` (src/app/sitemap.ts)
  · `/llms.txt` (public/llms.txt)

- [ ] **Search Console.** Verify property, submit `/sitemap.xml`, check Coverage.

- [ ] **PostHog events** (pending.md item 4): `pageview`, `download_click`,
  `download_success`, `bio_popup_shown`, `bio_cta_click`.
  *Metric: enables every row below to be prioritized by ROI.*

---

## P1 — Bio funnel instrumentation & viral loop (ship with deploy)

- [ ] **UTM-tag every outbound Bio/studio link.** Currently zero tracking on
  three surfaces, so Bio conversions from Invoicely are unmeasurable. Scheme:

  | Surface | File | URL |
  |---|---|---|
  | Popup CTA (1st & 5th download) | `src/components/download-popup.tsx` (L7, L155) | `bio.saarthistudio.com/?utm_source=invoicely&utm_medium=popup&utm_campaign=bio_cta` |
  | Footer link | `src/components/site-footer.tsx` (L3) | `...utm_medium=footer&utm_campaign=bio_cta` |
  | Header badge | `src/components/editor.tsx` (L14) — **currently points to `www.saarthistudio.com`, not Bio.** Decide: keep brand-link to studio (`utm_medium=header`) OR switch to Bio (`bio.saarthistudio.com/?utm_source=invoicely&utm_medium=header&utm_campaign=bio_cta`) — switching makes the scarcest pixel the money link |
  | PDF footer (below) | — | `invoicely.saarthistudio.com/?utm_source=invoice_pdf` |

  *Metric: outbound Bio CTR per surface; lets us kill weak placements.*

- [ ] **PDF viral footer — the highest-leverage single change.** Add a small,
  tasteful footer line to `src/components/invoice-pdf.tsx`:
  `Made with Invoicely — free invoice maker` with a link annotation to the
  UTM-tagged URL. Every invoice a user sends hands their client — exactly the
  Bio ICP — an impression. Rules: tiny (≈7-8pt), gray, single line, does NOT
  interfere with the professional look, always on. Verify with
  `pnpm pdf:sample`.
  *Metric: `?utm_source=invoice_pdf` sessions = direct loop measurement;
  K-factor proxy = invoice_pdf sessions ÷ total downloads.*

- [ ] **Quiet-toast CTA (cheap A/B test).** `download-confirmation.tsx` shows a
  plain toast with no CTA between popups. Test v1: keep as-is (control) vs
  v2: one text line under the confirm message
  ("Liked that it's free? Try Bio — one link for your work and payments."),
  whole-toast still non-interactive, linking not required for v1 test.
  *Metric: popup CTA CTR vs. download count — confirm 1-in-5 popup cadence
  isn't quietly annoying (watch `bio_popup_shown` vs `bio_cta_click` drop-off).*

- [ ] **Popup cadence stays deliberately restrained:** current logic
  (`editor.tsx` — full popup on 1st download, then every 5th) is right for a
  no-sign-up privacy-first tool. Do not increase frequency; the PDF footer is
  the growth lever, popups are the explainer.

---

## P1 — On-page relevance (ship with deploy)

- [ ] **Hero H1 above the form.** The page currently renders editor H2s first;
  the only H1 sits at the bottom (`src/components/seo-content.tsx:123`). Add a
  visible H1 above the toolbar: **"Free Invoice Maker — Create, Preview,
  Download PDF"**; demote the About heading to `<h2>`.
  Rule: exactly one H1/page, first in DOM order.
  *Metric: relevance for "free invoice maker"; controlled snippet.*

---

## P2 — Schema & sitemap hardening

- [ ] **`sitemap.ts` `lastModified: new Date()`** fake-stamps freshness every
  deploy. Use a build constant (last git commit date). `src/app/sitemap.ts`.

- [ ] **Harden JSON-LD** (`src/components/seo-content.tsx`): `WebSite` →
  `inLanguage: "en"`; `SoftwareApplication` → `featureList: [...FEATURES]`
  (reuse the existing array) + `brand` (Organization: Saarthi Studio).
  Keep FAQPage as-is (no SERP rich-result expectation since Google's Aug 2023
  restriction; still the LLM/AEO citation surface).

- [ ] **Template-page schema pattern** (for the cluster below):

```jsonld
{
  "@type": "SoftwareApplication",
  "@id": "https://invoicely.saarthistudio.com/#app",
  "name": "Invoicely",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "featureList": []
},
{
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Invoicely", "item": "https://invoicely.saarthistudio.com" },
    { "@type": "ListItem", "position": 2, "name": "Invoice Templates", "item": "https://invoicely.saarthistudio.com/invoice-templates" },
    { "@type": "ListItem", "position": 3, "name": "<TYPE> Invoice Template" }
  ]
}
```

  (Skip `HowTo` — rich results deprecated.)

---

## P2 — Programmatic cluster `/invoice-templates/[type]`

This is the SEO growth lever AND the Bio ICP seeder — freelancer/creator
template pages attract Bio's exact audience. Volumes are directional; validate
in GSC ~3 weeks post-deploy before locking titles.

| Prio | Slug | Primary keyword | Intent | Role |
|---|---|---|---|---|
| 1 | `/invoice-templates` | invoice templates | transactional | hub |
| 2 | `/invoice-templates/free-invoice-template` | free invoice template | transactional | head-detail |
| 3 | `/invoice-templates/freelance-invoice-template` | freelance invoice template | transactional | Bio ICP core |
| 4 | `/invoice-templates/india-invoice-format` | invoice format India ₹ | transactional (geo) | USP: lakh/crore ₹ |
| 5 | `/invoice-templates/contractor-invoice-template` | contractor invoice template | transactional | long-tail |
| 6 | `/blog/create-invoice-for-first-freelance-client` | how to invoice a client | informational | TOFU → #3, Bio audience |

- [ ] Implement hub + Prio 2-4 first; details per page:
  - ≤60-char title `<type> Invoice Template — Free PDF Download · Invoicely`
  - Unique H1; **never reuse homepage's "maker/generator" head term**
  - 400-600 words, one 3-4 question FAQ mirroring PAA
  - Above-fold CTA → editor with type/currency preset (product-true: 12
    currencies, discounts+tax, logo+accent color, no sign-up, device-side PDF)
  - `lastUpdated` date for freshness (E-E-A-T)
  - Internal links: footer hub link, detail→hub breadcrumb, detail→related
- [ ] Homepage "templates" row linking hub + first details.
- [ ] Extend `src/app/sitemap.ts` with all new URLs.

*Metric: non-branded impressions/clicks; plus Bio popup exposure on those sessions.*

---

## P3 — Nice-to-have

- [ ] `viewport` export (`themeColor`) in `layout.tsx` — Next 16 expects it
      outside `metadata`; mobile UX polish, not a ranking factor.
- [ ] One-line "Made by Saarthi Studio" contact link on `/privacy` (E-E-A-T).
- [ ] `llms-full.txt` — skip until page count > 10.

---

## Post-deploy measurement plan

- [ ] **Week 2-3:** GSC first impressions (brand + "free invoice maker");
      Coverage clean; zero Coverage errors.
- [ ] **Week 3:** re-run cannibalization audit with page+query data before
      optimizing any cluster title. Homepage owns "free invoice maker".
- [ ] **Ongoing funnel:** organic sessions → downloads → `bio_cta_click` /
      `invoice_pdf` UTMs → Bio signups (Bio-side). Report LTV-input:
      Bio signup rate per Invoicely session.
- [ ] **Weeks 4-12:** cluster movement; expect compound non-branded growth
      ~8-12 weeks post-deploy. No field-data CWV until real traffic accrues.

## Cannibalization guardrail (every future page)

1. Cross-check target keyword vs existing titles/H1s before writing either.
2. One owner per query; homepage = "free invoice maker".
3. Template pages take `[type]`-specific long-tail only.
4. Self-referencing canonical on every page; no cross-canonicals.

## What we deliberately do NOT do

- No email capture/sign-up walls — breaks the privacy-by-design product truth
  (and the pitch), which is itself the SEO+AEO differentiator.
- No paid acquisition until organic funnel economics are measured.
- No `HowTo` schema, no FAQ rich-result chasing (dead SERP features).
