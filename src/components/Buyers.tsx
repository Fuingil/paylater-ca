const buyers = [
  {
    icon: "🚀",
    title: "Fintech Startup'ları",
    description:
      "Seed veya Series A aşamasındaki BNPL, ödeme ve lending startup'ları için hazır marka kimliği.",
    highlight: "Hızlı pazar girişi",
  },
  {
    icon: "🏛️",
    title: "Bankalar & Kredi Kuruluşları",
    description:
      "Geleneksel bankaların dijital BNPL ürünleri ve genç müşteri segmentine yönelik marka alanı.",
    highlight: "Dijital dönüşüm",
  },
  {
    icon: "🛍️",
    title: "E-Ticaret Platformları",
    description:
      "Shopify, WooCommerce ve marketplace entegrasyonları sunan ödeme çözüm sağlayıcıları.",
    highlight: "Checkout optimizasyonu",
  },
  {
    icon: "💼",
    title: "Yatırımcılar & Domain Yatırımcıları",
    description:
      "Fintech sektörünün büyümesinden pay almak isteyen stratejik domain portföy yatırımcıları.",
    highlight: "Değer artışı potansiyeli",
  },
  {
    icon: "🌐",
    title: "Global Fintech Şirketleri",
    description:
      "Kanada pazarına giriş yapmak isteyen uluslararası BNPL ve ödeme devleri (Klarna, Affirm vb.).",
    highlight: "Kanada expansion",
  },
  {
    icon: "⚡",
    title: "Ajanslar & Danışmanlıklar",
    description:
      "Müşterilerine fintech çözümleri sunan dijital ajanslar ve teknoloji danışmanlık firmaları.",
    highlight: "White-label fırsatı",
  },
];

export function Buyers() {
  return (
    <section id="alicilar" className="relative py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-accent">
            Hedef Alıcılar
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
            Kimler Bu Domain&apos;i Almalı?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted">
            paylater.ca, aşağıdaki profildeki şirket ve girişimler için
            stratejik bir yatırım fırsatı sunuyor.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {buyers.map((buyer) => (
            <article
              key={buyer.title}
              className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 backdrop-blur"
            >
              <div className="absolute right-4 top-4 rounded-full bg-gold/10 px-3 py-1 text-xs font-medium text-gold">
                {buyer.highlight}
              </div>
              <span className="text-3xl">{buyer.icon}</span>
              <h3 className="mt-4 font-display text-lg font-bold">{buyer.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {buyer.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
