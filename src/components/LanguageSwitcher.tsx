"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { localeLabels, locales, type Locale } from "@/i18n/config";

type Props = {
  locale: Locale;
};

export function LanguageSwitcher({ locale }: Props) {
  const pathname = usePathname();

  function hrefFor(target: Locale) {
    const segments = pathname.split("/");
    if (locales.includes(segments[1] as Locale)) {
      segments[1] = target;
      return segments.join("/") || `/${target}`;
    }
    return `/${target}`;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-0.5 rounded-full border border-border bg-card/95 p-1 shadow-lg shadow-black/20 backdrop-blur-xl">
      {locales.map((loc) => (
        <Link
          key={loc}
          href={hrefFor(loc)}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
            loc === locale
              ? "bg-accent text-background"
              : "text-muted hover:bg-white/5 hover:text-foreground"
          }`}
          aria-current={loc === locale ? "page" : undefined}
        >
          {localeLabels[loc]}
        </Link>
      ))}
    </div>
  );
}
