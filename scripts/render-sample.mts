/**
 * Renders a sample invoice PDF with the real document component —
 * run from the project root:
 *
 *   pnpm tsx scripts/render-sample.mts [output-path]
 *
 * Default output: ./sample-invoice.pdf (gitignored)
 */
import { writeFileSync } from "node:fs";
import { createElement, type ReactElement } from "react";
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import { InvoicePDF } from "../src/components/invoice-pdf";
import { computeTotals } from "../src/lib/totals";
import type { InvoiceData } from "../src/lib/types";

const sample: InvoiceData = {
  fromName: "Saarthi Studio",
  fromEmail: "hello@saarthistudio.com",
  fromAddress: "14, MG Road, Bengaluru\nKarnataka 560001, India",
  toName: "Acme Corp Pvt Ltd",
  toEmail: "accounts@acmecorp.com",
  toAddress: "221B, Linking Road, Mumbai\nMaharashtra 400050, India",
  invoiceNumber: "INV-20261021",
  issueDate: "2026-10-21",
  dueDate: "2026-11-04",
  currency: "INR",
  items: [
    { id: "1", description: "Brand identity design — logo, colors, type", qty: "1", rate: "45000" },
    { id: "2", description: "Landing page design (Figma)", qty: "2", rate: "18000" },
    { id: "3", description: "Social media kit (12 posts)", qty: "1", rate: "12500.50" },
  ],
  discountType: "percent",
  discountValue: "10",
  taxRate: "18",
  notes: "Thank you for your business! Payment due within 14 days.",
  paymentDetails:
    "Bank: HDFC Bank\nA/c: 50200012345678\nIFSC: HDFC0000123\nUPI: saarthistudio@upi",
};

async function main() {
  const totals = computeTotals(sample);
  const outputPath = process.argv[2] ?? `${process.cwd()}/sample-invoice.pdf`;
  const buffer = await renderToBuffer(
    createElement(InvoicePDF, { data: sample, totals }) as unknown as ReactElement<DocumentProps>,
  );
  writeFileSync(outputPath, buffer);
  console.log(`Wrote ${outputPath} (${buffer.length} bytes)`);
  console.log("Totals:", totals);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
