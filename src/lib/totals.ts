import type { InvoiceData, Totals } from "./types";

/** Parse a user-typed amount ("1,200.50" / "12.5") into a finite number. */
export function num(value: string): number {
  const parsed = parseFloat(value.replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

export function computeTotals(data: InvoiceData): Totals {
  const subtotal = data.items.reduce(
    (sum, item) => sum + num(item.qty) * num(item.rate),
    0,
  );

  const discountRaw = num(data.discountValue);
  const discount =
    data.discountType === "percent"
      ? subtotal * (Math.min(Math.max(discountRaw, 0), 100) / 100)
      : Math.min(Math.max(discountRaw, 0), subtotal);

  const taxable = subtotal - discount;
  const tax = taxable * (Math.max(num(data.taxRate), 0) / 100);

  return {
    subtotal,
    discount,
    tax,
    total: taxable + tax,
  };
}
