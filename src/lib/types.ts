export interface LineItem {
  id: string;
  description: string;
  qty: string;
  rate: string;
}

export interface InvoiceData {
  fromName: string;
  fromEmail: string;
  fromAddress: string;
  toName: string;
  toEmail: string;
  toAddress: string;
  invoiceNumber: string;
  issueDate: string; // yyyy-mm-dd
  dueDate: string; // yyyy-mm-dd
  currency: string; // currency code
  /** Invoice accent color, hex (#rrggbb) — personalizes the document. */
  accent: string;
  /** Logo as a processed data URL (≤ ~80 KB) — stays local, dies with the tab. */
  logo: string | null;
  items: LineItem[];
  discountType: "percent" | "flat";
  discountValue: string;
  taxRate: string;
  notes: string;
  paymentDetails: string;
}

export interface Totals {
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
}
