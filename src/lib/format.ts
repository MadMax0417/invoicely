import { getCurrency } from "./currencies";

/** Format an amount for display, e.g. ₹1,25,000.00 or $1,250.00 */
export function formatMoney(amount: number, currencyCode: string): string {
  const currency = getCurrency(currencyCode);
  const safe = Number.isFinite(amount) ? amount : 0;
  try {
    return new Intl.NumberFormat(currency.locale, {
      style: "currency",
      currency: currency.code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(safe);
  } catch {
    return `${currency.symbol} ${safe.toFixed(2)}`;
  }
}

/** "2026-10-21" → "21 Oct 2026" */
export function formatDate(isoDate: string): string {
  if (!isoDate) return "";
  const date = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function todayISO(): string {
  return toISODate(new Date());
}

export function defaultInvoiceNumber(): string {
  const now = new Date();
  const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  return `INV-${stamp}`;
}

/** Blend a hex color toward white: tint("#0d9488", 0.08) → "#ecf6f5" (bad input → default indigo). */
export function tint(hex: string, alpha: number): string {
  const match = /^#([0-9a-fA-F]{6})$/.exec(hex);
  const value = match ? parseInt(match[1], 16) : 0x4f46e5;
  const a = Math.min(Math.max(alpha, 0), 1);
  const blend = (channel: number) => Math.round(channel * a + 255 * (1 - a));
  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  const r = blend((value >> 16) & 255);
  const g = blend((value >> 8) & 255);
  const b = blend(value & 255);
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
