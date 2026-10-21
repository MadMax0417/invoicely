import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://invoice.saarthistudio.com"),
  title: {
    default: "Invoicely — Free Invoice Maker by Saarthi Studio",
    template: "%s · Invoicely",
  },
  description:
    "Create and download professional invoices in seconds. Free, no sign-up — your data never leaves your browser.",
  openGraph: {
    title: "Invoicely — Free Invoice Maker",
    description:
      "Create and download professional invoices in seconds. Free, no sign-up, nothing leaves your device.",
    url: "https://invoice.saarthistudio.com",
    siteName: "Invoicely by Saarthi Studio",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
