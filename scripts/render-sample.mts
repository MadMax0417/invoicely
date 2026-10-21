/**
 * Renders a sample invoice PDF with the real document component —
 * run from the project root:
 *
 *   pnpm pdf:sample [output-path]
 *
 * Default output: ./sample-invoice.pdf (gitignored)
 */
import { writeFileSync } from "node:fs";
import { deflateSync } from "node:zlib";
import { createElement, type ReactElement } from "react";
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import { InvoicePDF } from "../src/components/invoice-pdf";
import { computeTotals } from "../src/lib/totals";
import type { InvoiceData } from "../src/lib/types";

/** Minimal dependency-free PNG encoder — used to fake a logo for the sample. */
function crc32(buf: Buffer): number {
  let c = 0xffffffff;
  for (const byte of buf) {
    c ^= byte;
    for (let k = 0; k < 8; k++) c = c & 1 ? (c >>> 1) ^ 0xedb88320 : c >>> 1;
  }
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type: string, data: Buffer): Buffer {
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const out = Buffer.alloc(12 + data.length);
  out.writeUInt32BE(data.length, 0);
  body.copy(out, 4);
  out.writeUInt32BE(crc32(body), 8 + data.length);
  return out;
}

function fakeLogoPng(w: number, h: number): string {
  const row = Buffer.alloc(1 + w * 4);
  const rows: Buffer[] = [];
  for (let y = 0; y < h; y++) {
    row[0] = 0; // filter: none
    for (let x = 0; x < w; x++) {
      const i = 1 + x * 4;
      const inside = x > 6 && x < w - 6 && y > 6 && y < h - 6;
      const bar = inside && y > h * 0.35 && y < h * 0.65 && x > w * 0.3;
      if (!inside) {
        row[i] = 0; row[i + 1] = 0; row[i + 2] = 0; row[i + 3] = 0; // transparent corners
      } else if (bar) {
        row[i] = 255; row[i + 1] = 255; row[i + 2] = 255; row[i + 3] = 255;
      } else {
        row[i] = 13; row[i + 1] = 148; row[i + 2] = 136; row[i + 3] = 255; // teal
      }
    }
    rows.push(Buffer.from(row));
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  const png = Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", deflateSync(Buffer.concat(rows))),
    pngChunk("IEND", Buffer.alloc(0)),
  ]);
  return `data:image/png;base64,${png.toString("base64")}`;
}

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
  accent: "#0d9488",
  logo: fakeLogoPng(180, 60),
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
