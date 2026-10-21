"use client";

import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { formatDate, formatMoney, tint } from "@/lib/format";
import type { InvoiceData, Totals } from "@/lib/types";

// Bundled Inter (supports ₹ and other symbols — core PDF fonts don't).
// Browser: served from /public at the site root. Node (sample rendering):
// resolved from the working directory. This module only ever loads on demand.
const FONT_DIR =
  typeof window === "undefined" ? `${process.cwd()}/public/fonts` : "/fonts";

Font.register({
  family: "Inter",
  fonts: [
    { src: `${FONT_DIR}/Inter-Regular.ttf`, fontWeight: 400 },
    { src: `${FONT_DIR}/Inter-Medium.ttf`, fontWeight: 500 },
    { src: `${FONT_DIR}/Inter-SemiBold.ttf`, fontWeight: 600 },
    { src: `${FONT_DIR}/Inter-Bold.ttf`, fontWeight: 700 },
  ],
});

const INK = "#111418";
const MUTED = "#6b7280";
const FAINT = "#9ca3af";
const LINE = "#e5e7eb";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Inter",
    fontSize: 9,
    color: INK,
    paddingVertical: 44,
    paddingHorizontal: 48,
  },
  header: {
    fontFamily: "Inter",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: {
    fontFamily: "Inter",
    fontSize: 26,
    fontWeight: 700,
    letterSpacing: 1,
    color: INK,
    marginBottom: 4,
  },
  number: {
    fontFamily: "Inter",
    fontSize: 10,
    fontWeight: 500,
    color: MUTED,
  },
  fromName: {
    fontFamily: "Inter",
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 3,
  },
  metaLine: {
    fontFamily: "Inter",
    fontSize: 8.5,
    color: MUTED,
    marginBottom: 2,
    textAlign: "right",
  },
  metaLabel: {
    fontFamily: "Inter",
    color: FAINT,
  },
  billTo: {
    fontFamily: "Inter",
    marginTop: 34,
  },
  sectionLabel: {
    fontFamily: "Inter",
    fontSize: 7.5,
    fontWeight: 600,
    letterSpacing: 1.2,
    color: FAINT,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  billName: {
    fontFamily: "Inter",
    fontSize: 11,
    fontWeight: 600,
    marginBottom: 2,
  },
  mutedText: {
    fontFamily: "Inter",
    fontSize: 9,
    color: MUTED,
    lineHeight: 1.45,
  },
  table: {
    fontFamily: "Inter",
    marginTop: 30,
  },
  tableHead: {
    fontFamily: "Inter",
    flexDirection: "row",
    paddingVertical: 7,
    paddingHorizontal: 8,
  },
  headCell: {
    fontFamily: "Inter",
    fontSize: 7.5,
    fontWeight: 600,
    letterSpacing: 0.8,
    color: MUTED,
    textTransform: "uppercase",
  },
  row: {
    fontFamily: "Inter",
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: LINE,
  },
  cellDesc: { flex: 1, paddingRight: 8 },
  cellQty: { width: 46, textAlign: "right", paddingRight: 8 },
  cellRate: { width: 76, textAlign: "right", paddingRight: 8 },
  cellAmount: { width: 86, textAlign: "right" },
  rowText: { fontSize: 9, lineHeight: 1.4 },
  rightRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 3 },
  rightLabel: { color: MUTED, fontSize: 9 },
  rightValue: { fontSize: 9, fontWeight: 500 },
  totalsBox: {
    fontFamily: "Inter",
    width: 230,
    marginTop: 16,
    alignSelf: "flex-end",
  },
  totalRow: {
    fontFamily: "Inter",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1.5,
    borderTopColor: INK,
  },
  totalLabel: { fontSize: 10, fontWeight: 600, letterSpacing: 0.6 },
  totalValue: { fontSize: 15, fontWeight: 700 },
  infoRow: {
    fontFamily: "Inter",
    flexDirection: "row",
    gap: 36,
    marginTop: 34,
  },
  infoBox: { flex: 1 },
  infoText: { fontSize: 8.5, color: MUTED, lineHeight: 1.55 },
  footer: {
    fontFamily: "Inter",
    position: "absolute",
    bottom: 20,
    left: 48,
    right: 48,
    textAlign: "center",
    fontSize: 7,
    color: FAINT,
  },
  logo: {
    width: 130,
    maxHeight: 56,
    objectFit: "contain",
    marginBottom: 6,
  },
});

interface InvoicePDFProps {
  data: InvoiceData;
  totals: Totals;
}

export function InvoicePDF({ data, totals }: InvoicePDFProps) {
  const hasDiscount = totals.discount > 0;
  const hasTax = totals.tax > 0;

  return (
    <Document
      title={`Invoice ${data.invoiceNumber || ""}`.trim()}
      author={data.fromName || "Invoicely"}
      creator="Invoicely by Saarthi Studio"
    >
      <Page size="A4" style={styles.page}>
        {/* Header: who it's from + invoice identity */}
        <View style={styles.header}>
          <View style={{ maxWidth: 250 }}>
            {data.logo ? (
              // PDF primitive — alt text doesn't exist in PDF; the logo is decorative
              // here because the sender's name is always printed right below it.
              // eslint-disable-next-line jsx-a11y/alt-text
              <Image src={data.logo} style={styles.logo} />
            ) : null}
            <Text style={styles.fromName}>{data.fromName || "Your name / business"}</Text>
            {data.fromEmail ? (
              <Text style={styles.mutedText}>{data.fromEmail}</Text>
            ) : null}
            {data.fromAddress ? (
              <Text style={styles.mutedText} wrap>
                {data.fromAddress}
              </Text>
            ) : null}
          </View>

          <View>
            <Text style={[styles.title, { color: data.accent }]}>INVOICE</Text>
            <Text style={styles.metaLine}>
              <Text style={styles.metaLabel}>No. </Text>
              {data.invoiceNumber || "—"}
            </Text>
            <Text style={styles.metaLine}>
              <Text style={styles.metaLabel}>Issued </Text>
              {formatDate(data.issueDate) || "—"}
            </Text>
            {data.dueDate ? (
              <Text style={styles.metaLine}>
                <Text style={styles.metaLabel}>Due </Text>
                {formatDate(data.dueDate)}
              </Text>
            ) : null}
          </View>
        </View>

        {/* Bill to */}
        <View style={styles.billTo}>
          <Text style={[styles.sectionLabel, { color: data.accent }]}>Bill to</Text>
          <Text style={styles.billName}>{data.toName || "Client name"}</Text>
          {data.toEmail ? <Text style={styles.mutedText}>{data.toEmail}</Text> : null}
          {data.toAddress ? (
            <Text style={styles.mutedText} wrap>
              {data.toAddress}
            </Text>
          ) : null}
        </View>

        {/* Items */}
        <View style={styles.table}>
          <View
            style={[styles.tableHead, { backgroundColor: tint(data.accent, 0.08) }]}
            fixed={false}
          >
            <Text style={[styles.headCell, styles.cellDesc]}>Description</Text>
            <Text style={[styles.headCell, styles.cellQty]}>Qty</Text>
            <Text style={[styles.headCell, styles.cellRate]}>Rate</Text>
            <Text style={[styles.headCell, styles.cellAmount]}>Amount</Text>
          </View>

          {data.items.map((item) => {
            const qty = parseFloat(item.qty.replace(/[^0-9.-]/g, "")) || 0;
            const rate = parseFloat(item.rate.replace(/[^0-9.-]/g, "")) || 0;
            return (
              <View key={item.id} style={styles.row} wrap={false}>
                <Text style={[styles.rowText, styles.cellDesc]} wrap>
                  {item.description || "—"}
                </Text>
                <Text style={[styles.rowText, styles.cellQty]}>{qty}</Text>
                <Text style={[styles.rowText, styles.cellRate]}>
                  {formatMoney(rate, data.currency)}
                </Text>
                <Text style={[styles.rowText, styles.cellAmount]}>
                  {formatMoney(qty * rate, data.currency)}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Totals */}
        <View style={styles.totalsBox}>
          <View style={styles.rightRow}>
            <Text style={styles.rightLabel}>Subtotal</Text>
            <Text style={styles.rightValue}>{formatMoney(totals.subtotal, data.currency)}</Text>
          </View>
          {hasDiscount ? (
            <View style={styles.rightRow}>
              <Text style={styles.rightLabel}>
                Discount
                {data.discountType === "percent" ? ` (${data.discountValue}%)` : ""}
              </Text>
              <Text style={styles.rightValue}>
                −{formatMoney(totals.discount, data.currency)}
              </Text>
            </View>
          ) : null}
          {hasTax ? (
            <View style={styles.rightRow}>
              <Text style={styles.rightLabel}>Tax ({data.taxRate}%)</Text>
              <Text style={styles.rightValue}>
                +{formatMoney(totals.tax, data.currency)}
              </Text>
            </View>
          ) : null}
          <View style={[styles.totalRow, { borderTopColor: data.accent }]}>
            <Text style={styles.totalLabel}>TOTAL</Text>
            <Text style={[styles.totalValue, { color: data.accent }]}>
              {formatMoney(totals.total, data.currency)}
            </Text>
          </View>
        </View>

        {/* Notes + payment details */}
        {data.notes || data.paymentDetails ? (
          <View style={styles.infoRow}>
            {data.notes ? (
              <View style={styles.infoBox}>
                <Text style={[styles.sectionLabel, { color: data.accent }]}>Notes</Text>
                <Text style={styles.infoText} wrap>
                  {data.notes}
                </Text>
              </View>
            ) : null}
            {data.paymentDetails ? (
              <View style={styles.infoBox}>
                <Text style={[styles.sectionLabel, { color: data.accent }]}>
                  Payment details
                </Text>
                <Text style={styles.infoText} wrap>
                  {data.paymentDetails}
                </Text>
              </View>
            ) : null}
          </View>
        ) : null}

        {/* Small credit — the only branding on the document */}
        <Text style={styles.footer} fixed>
          Made with Invoicely · Saarthi Studio
        </Text>
      </Page>
    </Document>
  );
}
