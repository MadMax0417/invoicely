import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://invoicely.saarthistudio.com"),
  title: {
    default: "Invoicely — Free Invoice Maker by Saarthi Studio",
    template: "%s · Invoicely",
  },
  description:
    "Create and download professional invoices in seconds. Free, no sign-up — your data never leaves your browser.",
  alternates: { canonical: "./" },
  openGraph: {
    title: "Invoicely — Free Invoice Maker",
    description:
      "Create and download professional invoices in seconds. Free, no sign-up, nothing leaves your device.",
    url: "https://invoicely.saarthistudio.com",
    siteName: "Invoicely by Saarthi Studio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Invoicely — Free Invoice Maker",
    description:
      "Create and download professional invoices in seconds. Free, no sign-up.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  authors: [{ name: "Saarthi Studio", url: "https://www.saarthistudio.com" }],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
