import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Syne } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: "paylater.ca — Premium Domain Satılık | BNPL & Fintech",
  description:
    "paylater.ca premium domain satılık. Kanada'nın .ca uzantılı, Buy Now Pay Later ve fintech sektörü için ideal marka alan adı. Teklif verin.",
  keywords: [
    "paylater.ca",
    "domain satılık",
    "premium domain",
    "BNPL",
    "buy now pay later",
    "fintech domain",
    "canada domain",
    ".ca domain",
  ],
  openGraph: {
    title: "paylater.ca — Premium Domain Satılık",
    description:
      "Kanada fintech ve BNPL sektörü için mükemmel premium domain. Hemen teklif verin.",
    url: "https://paylater.ca",
    siteName: "paylater.ca",
    locale: "tr_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "paylater.ca — Premium Domain Satılık",
    description: "BNPL ve fintech için ideal Kanada domain'i.",
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${jakarta.variable} ${syne.variable} scroll-smooth`}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
