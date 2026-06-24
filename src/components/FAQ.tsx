"use client";

import { useState } from "react";

const faqs = [
  {
    q: "Domain transferi nasıl yapılır?",
    a: "Anlaşma sağlandıktan sonra güvenli bir escrow hizmeti (Escrow.com, Dan.com vb.) üzerinden transfer gerçekleştirilir. Ödeme onaylandıktan sonra domain hesabınıza aktarılır.",
  },
  {
    q: "Fiyat sabit mi, pazarlık yapılabilir mi?",
    a: "Ciddi alıcılar için teklif usulü çalışıyoruz. Form üzerinden teklifinizi iletebilir veya doğrudan iletişime geçebilirsiniz.",
  },
  {
    q: "Domain şu an aktif mi?",
    a: "Evet, paylater.ca şu an bu tanıtım sayfasına yönlendirilmektedir. Transfer sonrası yeni sahibi dilediği şekilde kullanabilir.",
  },
  {
    q: "BNPL dışında başka amaçlarla kullanılabilir mi?",
    a: "Kesinlikle. \"Pay later\" kavramı ödeme erteleme, abonelik modeli, rezervasyon ve daha birçok sektörde kullanılabilir. Ancak asıl değer fintech ve BNPL alanındadır.",
  },
  {
    q: "Kanada dışından alıcı kabul ediyor musunuz?",
    a: "Evet, global alıcılar memnuniyetle karşılanır. Uluslararası transfer ve escrow seçenekleri mevcuttur.",
  },
  {
    q: "Trademark sorunu var mı?",
    a: "\"Pay later\" jenerik bir terimdir ve domain adı olarak kullanımı yaygındır. Yine de kendi hukuki danışmanınızla doğrulamanızı öneririz.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="sss" className="relative py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-accent">
            SSS
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
            Sıkça Sorulan Sorular
          </h2>
        </div>

        <div className="mt-12 space-y-3">
          {faqs.map((faq, index) => (
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
