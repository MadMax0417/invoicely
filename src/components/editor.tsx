"use client";

import { useCallback, useMemo, useState } from "react";
import CustomizeBar from "./customize-bar";
import DownloadConfirmation from "./download-confirmation";
import DownloadPopup from "./download-popup";
import InvoicePreview from "./invoice-preview";
import { CURRENCIES } from "@/lib/currencies";
import { bumpDownloadCount } from "@/lib/download-count";
import { formatMoney } from "@/lib/format";
import { computeTotals } from "@/lib/totals";
import { useInvoiceDraft } from "@/lib/use-invoice";
import Link from "next/link";
import { STUDIO_LINKS } from "@/lib/links";

/** What the download flow shows after an attempt: the full Bio popup every 5th
 *  download, a quiet confirmation in between, and the failure popup on errors. */
type DownloadResult = "full" | "quiet" | "error";

/** Field styling without any width — compose with w-full / flex-1 / w-28. */
const fieldBase =
  "rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-[15px] text-gray-900 placeholder:text-gray-300 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10";

const inputCls = `w-full ${fieldBase}`;

const labelCls = "mb-1.5 block text-[13px] font-medium text-gray-500";

const sectionTitleCls =
  "text-[13px] font-semibold uppercase tracking-[0.1em] text-gray-400";

const cardCls = "rounded-2xl border border-gray-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)] sm:p-6";

const itemsGridCls =
  "grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_32px] gap-2 sm:grid-cols-[minmax(0,1fr)_72px_104px_112px_32px] sm:items-center sm:gap-3";

/** Keep numeric inputs clean while typing. */
function sanitizeNumeric(value: string): string {
  return value.replace(/[^0-9.]/g, "");
}

export default function Editor() {
  const { data, setField, updateItem, addItem, removeItem, reset } = useInvoiceDraft();
  const totals = useMemo(() => computeTotals(data), [data]);
  const [downloading, setDownloading] = useState(false);
  const [result, setResult] = useState<DownloadResult | null>(null);
  const closeResult = useCallback(() => setResult(null), []);

  const hasDiscount = totals.discount > 0;
  const hasTax = totals.tax > 0;

  async function handleDownload() {
    if (downloading) return;
    setDownloading(true);
    try {
      const [{ pdf }, { InvoicePDF }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/components/invoice-pdf"),
      ]);
      const blob = await pdf(<InvoicePDF data={data} totals={totals} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${(data.invoiceNumber || "invoice").replace(/[^a-z0-9-_]+/gi, "-")}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      const count = bumpDownloadCount();
      setResult(count === 1 || count % 5 === 0 ? "full" : "quiet");
    } catch (error) {
      console.error("PDF generation failed", error);
      setResult("error");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-gray-200/80 bg-white/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-2.5">
            <Link
              href="/"
              aria-label="Invoicely — home"
              className="text-[17px] font-bold tracking-tight text-gray-900 transition hover:text-indigo-600"
            >
              Invoicely
            </Link>
            <a
              href={STUDIO_LINKS.header}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] font-medium text-gray-500 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 sm:inline-flex"
            >
              by Saarthi Studio
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M7 17 17 7" />
                <path d="M7 7h10v10" />
              </svg>
            </a>
          </div>

          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-wait disabled:opacity-70"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 3v12" />
              <path d="m7 11 5 5 5-5" />
              <path d="M5 21h14" />
            </svg>
            {downloading ? "Preparing…" : "Download PDF"}
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pt-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] lg:gap-10">
          {/* Form */}
          <form className="space-y-5" onSubmit={(event) => event.preventDefault()}>
            {/* Parties */}
            <div className="grid gap-5 md:grid-cols-2">
              <section className={cardCls}>
                <h2 className={sectionTitleCls}>From — you</h2>
                <div className="mt-4 space-y-4">
                  <div>
                    <label className={labelCls} htmlFor="from-name">
                      Name / business
                    </label>
                    <input
                      id="from-name"
                      className={inputCls}
                      placeholder="e.g. Acme Studio or your name"
                      value={data.fromName}
                      onChange={(e) => setField("fromName", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="from-email">
                      Email <span className="font-normal text-gray-400">(optional)</span>
                    </label>
                    <input
                      id="from-email"
                      type="email"
                      className={inputCls}
                      placeholder="you@example.com"
                      value={data.fromEmail}
                      onChange={(e) => setField("fromEmail", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="from-address">
                      Address <span className="font-normal text-gray-400">(optional)</span>
                    </label>
                    <textarea
                      id="from-address"
                      rows={3}
                      className={`${inputCls} resize-y`}
                      placeholder="Street, city, state, PIN code"
                      value={data.fromAddress}
                      onChange={(e) => setField("fromAddress", e.target.value)}
                    />
                  </div>
                </div>
              </section>

              <section className={cardCls}>
                <h2 className={sectionTitleCls}>To — client</h2>
                <div className="mt-4 space-y-4">
                  <div>
                    <label className={labelCls} htmlFor="to-name">
                      Name / business
                    </label>
                    <input
                      id="to-name"
                      className={inputCls}
                      placeholder="e.g. Rahul Sharma / Acme Corp"
                      value={data.toName}
                      onChange={(e) => setField("toName", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="to-email">
                      Email <span className="font-normal text-gray-400">(optional)</span>
                    </label>
                    <input
                      id="to-email"
                      type="email"
                      className={inputCls}
                      placeholder="client@example.com"
                      value={data.toEmail}
                      onChange={(e) => setField("toEmail", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="to-address">
                      Address <span className="font-normal text-gray-400">(optional)</span>
                    </label>
                    <textarea
                      id="to-address"
                      rows={3}
                      className={`${inputCls} resize-y`}
                      placeholder="Street, city, state, PIN code"
                      value={data.toAddress}
                      onChange={(e) => setField("toAddress", e.target.value)}
                    />
                  </div>
                </div>
              </section>
            </div>

            {/* Invoice details */}
            <section className={cardCls}>
              <h2 className={sectionTitleCls}>Invoice details</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className={labelCls} htmlFor="invoice-number">
                    Invoice number
                  </label>
                  <input
                    id="invoice-number"
                    className={inputCls}
                    placeholder="INV-001"
                    value={data.invoiceNumber}
                    onChange={(e) => setField("invoiceNumber", e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelCls} htmlFor="issue-date">
                    Date
                  </label>
                  <input
                    id="issue-date"
                    type="date"
                    className={inputCls}
                    value={data.issueDate}
                    onChange={(e) => setField("issueDate", e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelCls} htmlFor="due-date">
                    Due date <span className="font-normal text-gray-400">(optional)</span>
                  </label>
                  <input
                    id="due-date"
                    type="date"
                    className={inputCls}
                    value={data.dueDate}
                    onChange={(e) => setField("dueDate", e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelCls} htmlFor="currency">
                    Currency
                  </label>
                  <select
                    id="currency"
                    className={`${inputCls} input-chevron appearance-none pr-9`}
                    value={data.currency}
                    onChange={(e) => setField("currency", e.target.value)}
                  >
                    {CURRENCIES.map((currency) => (
                      <option key={currency.code} value={currency.code}>
                        {currency.code} {currency.symbol}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* Line items */}
            <section className={cardCls}>
              <div className="flex items-center justify-between gap-3">
                <h2 className={sectionTitleCls}>Line items</h2>
                <button
                  type="button"
                  onClick={addItem}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-[13px] font-medium text-gray-600 transition hover:border-indigo-300 hover:text-indigo-600"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
                    <path d="M12 5v14" />
                    <path d="M5 12h14" />
                  </svg>
                  Add row
                </button>
              </div>

              {/* Column headers (desktop) */}
              <div
                className={`mt-4 hidden gap-3 pb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400 sm:grid ${itemsGridCls}`}
                aria-hidden
              >
                <span>Description</span>
                <span className="text-right">Qty</span>
                <span className="text-right">Rate</span>
                <span className="text-right">Amount</span>
                <span />
              </div>

              <ul className="mt-3 space-y-3 sm:mt-1 sm:space-y-2">
                {data.items.map((item) => {
                  const qty = parseFloat(item.qty.replace(/[^0-9.-]/g, "")) || 0;
                  const rate = parseFloat(item.rate.replace(/[^0-9.-]/g, "")) || 0;
                  return (
                    <li
                      key={item.id}
                      className="rounded-xl border border-gray-200 p-3 sm:border-0 sm:p-0"
                    >
                      <div className={itemsGridCls}>
                        <input
                          className={`${inputCls} col-span-4 py-2 sm:col-span-1`}
                          placeholder="What did you deliver?"
                          aria-label="Description"
                          value={item.description}
                          onChange={(e) => updateItem(item.id, { description: e.target.value })}
                        />
                        <input
                          className={`${inputCls} py-2 text-right`}
                          inputMode="decimal"
                          aria-label="Quantity"
                          value={item.qty}
                          onChange={(e) => updateItem(item.id, { qty: sanitizeNumeric(e.target.value) })}
                        />
                        <input
                          className={`${inputCls} py-2 text-right`}
                          inputMode="decimal"
                          placeholder="0.00"
                          aria-label="Rate"
                          value={item.rate}
                          onChange={(e) => updateItem(item.id, { rate: sanitizeNumeric(e.target.value) })}
                        />
                        <div className="text-right text-sm font-medium tabular-nums text-gray-800">
                          {formatMoney(qty * rate, data.currency)}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          aria-label="Remove row"
                          className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg text-gray-300 transition hover:bg-red-50 hover:text-red-500 sm:mx-0"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                          </svg>
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>

            {/* Discount + tax */}
            <section className={cardCls}>
              <h2 className={sectionTitleCls}>Discount &amp; tax</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelCls} htmlFor="discount">
                    Discount
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="discount"
                      className={`${fieldBase} flex-1`}
                      inputMode="decimal"
                      placeholder="0"
                      value={data.discountValue}
                      onChange={(e) =>
                        setField("discountValue", sanitizeNumeric(e.target.value))
                      }
                    />
                    <select
                      className={`${fieldBase} input-chevron w-28 appearance-none pr-9`}
                      aria-label="Discount type"
                      value={data.discountType}
                      onChange={(e) =>
                        setField("discountType", e.target.value as "percent" | "flat")
                      }
                    >
                      <option value="percent">%</option>
                      <option value="flat">Fixed</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className={labelCls} htmlFor="tax">
                    Tax (%)
                  </label>
                  <input
                    id="tax"
                    className={inputCls}
                    inputMode="decimal"
                    placeholder="0"
                    value={data.taxRate}
                    onChange={(e) => setField("taxRate", sanitizeNumeric(e.target.value))}
                  />
                </div>
              </div>
            </section>

            {/* Totals */}
            <section className={cardCls}>
              <div className="ml-auto w-full max-w-[320px] space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium text-gray-800">
                    {formatMoney(totals.subtotal, data.currency)}
                  </span>
                </div>
                {hasDiscount ? (
                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      Discount
                      {data.discountType === "percent" ? ` (${data.discountValue}%)` : ""}
                    </span>
                    <span className="font-medium text-gray-800">
                      −{formatMoney(totals.discount, data.currency)}
                    </span>
                  </div>
                ) : null}
                {hasTax ? (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tax ({data.taxRate}%)</span>
                    <span className="font-medium text-gray-800">
                      +{formatMoney(totals.tax, data.currency)}
                    </span>
                  </div>
                ) : null}
                <div className="flex items-baseline justify-between border-t-2 border-gray-900 pt-2.5">
                  <span className="text-sm font-semibold tracking-wide text-gray-900">
                    TOTAL
                  </span>
                  <span className="text-2xl font-bold tabular-nums text-gray-900">
                    {formatMoney(totals.total, data.currency)}
                  </span>
                </div>
              </div>
            </section>

            {/* Notes + payment */}
            <section className={cardCls}>
              <h2 className={sectionTitleCls}>Notes &amp; payment</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelCls} htmlFor="notes">
                    Notes <span className="font-normal text-gray-400">(optional)</span>
                  </label>
                  <textarea
                    id="notes"
                    rows={4}
                    className={`${inputCls} resize-y`}
                    placeholder="Thank you for your business!"
                    value={data.notes}
                    onChange={(e) => setField("notes", e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelCls} htmlFor="payment">
                    Payment details <span className="font-normal text-gray-400">(optional)</span>
                  </label>
                  <textarea
                    id="payment"
                    rows={4}
                    className={`${inputCls} resize-y`}
                    placeholder={"Bank, account number, IFSC / UPI ID…"}
                    value={data.paymentDetails}
                    onChange={(e) => setField("paymentDetails", e.target.value)}
                  />
                </div>
              </div>
            </section>

            <div className="flex justify-center pt-1">
              <button
                type="button"
                onClick={reset}
                className="text-[13px] font-medium text-gray-400 underline-offset-4 transition hover:text-gray-600 hover:underline"
              >
                Clear &amp; start a new invoice
              </button>
            </div>
          </form>

          {/* Customize + preview */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="space-y-3">
              <CustomizeBar
                accent={data.accent}
                logo={data.logo}
                onAccentChange={(hex) => setField("accent", hex)}
                onLogoChange={(dataUrl) => setField("logo", dataUrl)}
                onLogoRemove={() => setField("logo", null)}
              />
              <div className="flex items-baseline justify-between px-1">
                <p className="text-[13px] font-semibold uppercase tracking-[0.1em] text-gray-400">
                  Preview
                </p>
                <p className="text-xs text-gray-400">A4 · exactly what you download</p>
              </div>
              <InvoicePreview data={data} totals={totals} />
            </div>
          </div>
        </div>
      </main>

      {/* Download result — the full Bio popup every 5th download, a quiet toast otherwise */}
      {result === "full" && <DownloadPopup popup="success" onClose={closeResult} />}
      {result === "quiet" && <DownloadConfirmation onClose={closeResult} />}
      {result === "error" && <DownloadPopup popup="error" onClose={closeResult} />}
    </div>
  );
}
