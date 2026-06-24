"use client";

import { useState } from "react";

import type { Dictionary } from "@/i18n/get-dictionary";

type Props = { dict: Dictionary };

export function FAQ({ dict }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-accent">
            {dict.faq.label}
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
            {dict.faq.title}
          </h2>
        </div>

        <div className="mt-12 space-y-3">
          {dict.faq.items.map((faq, index) => (
            <div
              key={faq.q}
              className="overflow-hidden rounded-2xl border border-border bg-card backdrop-blur"
            >
              <button
                type="button"
                className="flex w-full items-center justify-between px-6 py-4 text-left text-sm font-medium transition hover:bg-white/5 md:text-base"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                {faq.q}
                <svg
                  className={`h-5 w-5 shrink-0 text-muted transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === index && (
                <div className="border-t border-border px-6 py-4 text-sm leading-relaxed text-muted">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
