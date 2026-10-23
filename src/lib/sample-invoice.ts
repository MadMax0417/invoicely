import { computeTotals } from "@/lib/totals";
import type { InvoiceData, Totals } from "@/lib/types";

/**
 * Hero sample — a realistic freelancer invoice rendered by the *real*
 * InvoicePreview component on the marketing homepage, so the page demos the
 * actual product look (₹ lakh/crore grouping included).
 */
export const SAMPLE_INVOICE: InvoiceData = {
  fromName: "Meera Menon",
  fromEmail: "meera@menonstudio.in",
  fromAddress: "14 Carter Road, Bandra West\nMumbai 400050",
  toName: "Northwind Coffee Co.",
  toEmail: "accounts@northwindcoffee.in",
  toAddress: "22 Park Street, Fort\nMumbai 400001",
  invoiceNumber: "INV-2026-014",
  issueDate: "2026-10-14",
  dueDate: "2026-10-28",
  currency: "INR",
  accent: "#4f46e5",
  logo: null,
  items: [
    { id: "hero-1", description: "Brand identity — logo & wordmark", qty: "1", rate: "24000" },
    { id: "hero-2", description: "Packaging illustration (3 concepts)", qty: "3", rate: "3500" },
    { id: "hero-3", description: "Social media template set (6)", qty: "6", rate: "800" },
  ],
  discountType: "percent",
  discountValue: "",
  taxRate: "18",
  notes: "Thanks for working with Menon Studio!",
  paymentDetails: "UPI: meera@upi · HDFC ****3421",
};

export const SAMPLE_TOTALS: Totals = computeTotals(SAMPLE_INVOICE);
