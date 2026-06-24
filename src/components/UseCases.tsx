const useCases = [
  {
    icon: "💳",
    title: "BNPL Platformu",
    description:
      "Tüketicilere alışverişte taksitli ödeme sunan tam kapsamlı bir Buy Now Pay Later platformu.",
    tags: ["Fintech", "B2C"],
  },
  {
    icon: "🛒",
    title: "E-Ticaret Entegrasyonu",
    description:
      "Online mağazalara checkout aşamasında ödeme erteleme ve taksit seçenekleri ekleyen SaaS çözümü.",
    tags: ["E-Commerce", "SaaS"],
  },
  {
    icon: "🏦",
    title: "Dijital Bankacılık",
    description:
      "Neobank veya dijital banka uygulamasının BNPL ve esnek ödeme modülü için marka alanı.",
    tags: ["Banking", "Neobank"],
  },
  {
    icon: "📱",
    title: "Mobil Ödeme Uygulaması",
    description:
      "QR kod, NFC ve online ödemelerde 'sonra öde' özelliği sunan consumer fintech uygulaması.",
    tags: ["Mobile", "Payments"],
  },
  {
    icon: "🏢",
    title: "B2B Ticari Kredi",
    description:
      "KOBİ'lere envanter ve tedarik zinciri finansmanı sunan ticari BNPL çözümü.",
    tags: ["B2B", "Lending"],
  },
  {
    icon: "🔗",
    title: "Ödeme API Gateway",
    description:
      "Geliştiricilere BNPL entegrasyonu sağlayan API platformu ve developer portal.",
    tags: ["API", "Developer"],
  },
];

export function UseCases() {
  return (
    <section id="kullanim" className="relative py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent" />
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-accent">
            Kullanım Alanları
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
            Bu Domain ile Neler Yapılabilir?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted">
            paylater.ca, fintech ekosisteminde onlarca farklı iş modeline
            ev sahipliği yapabilir. İşte en güçlü senaryolar:
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {useCases.map((item) => (
            <article
              key={item.title}
              className="group rounded-2xl border border-border bg-card p-6 backdrop-blur transition hover:border-accent/30 hover:bg-accent/5"
            >
              <span className="text-3xl">{item.icon}</span>
              <h3 className="mt-4 font-display text-lg font-bold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {item.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent-light"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
