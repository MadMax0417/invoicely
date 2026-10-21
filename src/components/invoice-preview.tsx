import { formatDate, formatMoney, tint } from "@/lib/format";
import type { InvoiceData, Totals } from "@/lib/types";

interface InvoicePreviewProps {
  data: InvoiceData;
  totals: Totals;
}

/**
 * On-screen preview of the PDF — same layout, same content, web typography.
 */
export default function InvoicePreview({ data, totals }: InvoicePreviewProps) {
  const muted = "text-gray-500";
  const sectionLabelCls = "text-[11px] font-semibold uppercase tracking-[0.14em]";

  return (
    <div className="rounded-2xl bg-white p-6 shadow-[0_1px_2px_rgba(16,24,40,0.05),0_12px_32px_-12px_rgba(16,24,40,0.12)] ring-1 ring-gray-900/5 sm:p-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          {data.logo ? (
            // eslint-disable-next-line @next/next/no-img-element -- local data URL, intentionally un-optimized
            <img
              src={data.logo}
              alt=""
              className="mb-2 h-10 w-auto max-w-[180px] object-contain"
            />
          ) : null}
          <p className="text-[15px] font-semibold text-gray-900">
            {data.fromName || <span className="text-gray-300">Your name / business</span>}
          </p>
          {data.fromEmail ? <p className="mt-0.5 text-[13px] text-gray-500">{data.fromEmail}</p> : null}
          {data.fromAddress ? (
            <p className="mt-0.5 max-w-[240px] whitespace-pre-line text-[13px] leading-relaxed text-gray-500">
              {data.fromAddress}
            </p>
          ) : null}
        </div>

        <div className="shrink-0 text-right">
          <p
            className="text-2xl font-bold tracking-wide"
            style={{ color: data.accent }}
          >
            INVOICE
          </p>
          <p className="mt-1 text-[13px] text-gray-500">
            <span className="text-gray-400">No. </span>
            {data.invoiceNumber || "—"}
          </p>
          <p className="text-[13px] text-gray-500">
            <span className="text-gray-400">Issued </span>
            {formatDate(data.issueDate) || "—"}
          </p>
          {data.dueDate ? (
            <p className="text-[13px] text-gray-500">
              <span className="text-gray-400">Due </span>
              {formatDate(data.dueDate)}
            </p>
          ) : null}
        </div>
      </div>

      {/* Bill to */}
      <div className="mt-8">
        <p className={sectionLabelCls} style={{ color: data.accent }}>
          Bill to
        </p>
        <p className="mt-1.5 text-[15px] font-semibold text-gray-900">
          {data.toName || <span className="text-gray-300">Client name</span>}
        </p>
        {data.toEmail ? <p className="text-[13px] text-gray-500">{data.toEmail}</p> : null}
        {data.toAddress ? (
          <p className="max-w-[320px] whitespace-pre-line text-[13px] leading-relaxed text-gray-500">
            {data.toAddress}
          </p>
        ) : null}
      </div>

      {/* Items */}
      <div className="mt-8">
        <div
          className="grid grid-cols-[minmax(0,1fr)_32px_74px_86px] gap-2 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500 sm:grid-cols-[minmax(0,1fr)_44px_84px_96px]"
          style={{ backgroundColor: tint(data.accent, 0.08) }}
        >
          <span>Description</span>
          <span className="text-right">Qty</span>
          <span className="text-right">Rate</span>
          <span className="text-right">Amount</span>
        </div>
        {data.items.map((item) => {
          const qty = parseFloat(item.qty.replace(/[^0-9.-]/g, "")) || 0;
          const rate = parseFloat(item.rate.replace(/[^0-9.-]/g, "")) || 0;
          return (
            <div
              key={item.id}
              className="grid grid-cols-[minmax(0,1fr)_32px_74px_86px] gap-2 border-b border-gray-200 px-3 py-2.5 text-[13px] text-gray-800 sm:grid-cols-[minmax(0,1fr)_44px_84px_96px]"
            >
              <span className={item.description ? "" : "text-gray-300"}>
                {item.description || "—"}
              </span>
              <span className="text-right">{qty}</span>
              <span className="text-right">{formatMoney(rate, data.currency)}</span>
              <span className="text-right">{formatMoney(qty * rate, data.currency)}</span>
            </div>
          );
        })}
      </div>

      {/* Totals */}
      <div className="ml-auto mt-4 w-full max-w-[240px] space-y-1.5 text-[13px]">
        <div className="flex justify-between">
          <span className="text-gray-500">Subtotal</span>
          <span className="font-medium text-gray-800">
            {formatMoney(totals.subtotal, data.currency)}
          </span>
        </div>
        {totals.discount > 0 ? (
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
        {totals.tax > 0 ? (
          <div className="flex justify-between">
            <span className="text-gray-500">Tax ({data.taxRate}%)</span>
            <span className="font-medium text-gray-800">
              +{formatMoney(totals.tax, data.currency)}
            </span>
          </div>
        ) : null}
        <div
          className="flex items-baseline justify-between border-t-2 pt-2"
          style={{ borderColor: data.accent }}
        >
          <span className="text-[13px] font-semibold tracking-wide text-gray-900">TOTAL</span>
          <span className="text-lg font-bold" style={{ color: data.accent }}>
            {formatMoney(totals.total, data.currency)}
          </span>
        </div>
      </div>

      {/* Notes + payment */}
      {data.notes || data.paymentDetails ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {data.notes ? (
            <div className="order-2">
              <p className={sectionLabelCls} style={{ color: data.accent }}>
                Notes
              </p>
              <p className={`mt-1.5 whitespace-pre-line text-[13px] leading-relaxed ${muted}`}>
                {data.notes}
              </p>
            </div>
          ) : null}
          {data.paymentDetails ? (
            <div>
              <p className={sectionLabelCls} style={{ color: data.accent }}>
                Payment details
              </p>
              <p className={`mt-1.5 whitespace-pre-line text-[13px] leading-relaxed ${muted}`}>
                {data.paymentDetails}
              </p>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* The only branding on the document */}
      <p className="mt-10 border-t border-gray-100 pt-4 text-center text-[11px] text-gray-300">
        Made with Invoicely · Saarthi Studio
      </p>
    </div>
  );
}
