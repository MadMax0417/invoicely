# Invoicely by Saarthi Studio

A free, no-sign-up invoice maker. Fill the form, see a live A4 preview, download a
clean PDF — all in the browser. Personalize the document with an accent color and
your own logo (8 swatches + a custom color picker).

**Privacy by design:** drafts live in `sessionStorage` only (erased when the tab or
browser closes) and PDFs are generated on the device. There is no database, no auth
and no API — logos are processed entirely in the browser (≤ 5 MB in, downscaled and
re-encoded to ≤ ~80 KB, never uploaded).

## Stack

- Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · TypeScript
- `@react-pdf/renderer` for client-side A4 PDF generation (bundled Inter fonts, full ₹ support)

## Develop

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000

## Build

```bash
pnpm build
pnpm start
```

## Sample PDF render

Renders a sample invoice with the real PDF component (used to visually verify
fonts, ₹ symbols, and layout):

```bash
pnpm pdf:sample   # writes ./sample-invoice.pdf (gitignored)
```

## Deploy

Deploy to Vercel (or any Node host) and point **invoice.saarthistudio.com** at it.

## Structure

```
src/
  app/page.tsx            # the tool (single screen)
  app/privacy/page.tsx    # privacy promise page
  components/editor.tsx   # header, form, totals, download logic
  components/customize-bar.tsx    # accent swatches + logo upload (client-side)
  components/invoice-preview.tsx  # live A4 preview (mirrors the PDF)
  components/invoice-pdf.tsx      # PDF document (dynamically imported)
  lib/                    # types, totals, currencies, formatting, draft hook, image pipeline
public/fonts/             # Inter TTFs for the PDF (licensed, see LICENSE.txt)
```
