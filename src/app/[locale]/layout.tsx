import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SetLang } from "@/components/SetLang";
import { isValidLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

const ogLocales: Record<Locale, string> = {
  en: "en_CA",
  tr: "tr_CA",
  fr: "fr_CA",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};

  const dict = getDictionary(locale);

  return {
    title: dict.meta.title,
    description: dict.meta.description,
    keywords: [...dict.meta.keywords],
    openGraph: {
      title: dict.meta.ogTitle,
      description: dict.meta.ogDescription,
      url: `https://paylater.ca/${locale}`,
      siteName: "paylater.ca",
      locale: ogLocales[locale],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.ogTitle,
      description: dict.meta.ogDescription,
    },
    alternates: {
      canonical: `https://paylater.ca/${locale}`,
      languages: {
        en: "https://paylater.ca/en",
        tr: "https://paylater.ca/tr",
        fr: "https://paylater.ca/fr",
      },
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  return (
    <>
      <SetLang locale={locale} />
      {children}
    </>
  );
}
