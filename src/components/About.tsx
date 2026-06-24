export function About() {
  return (
    <section id="hakkinda" className="relative py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <span className="text-sm font-semibold uppercase tracking-widest text-accent">
              Domain Hakkında
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
              Fintech&apos;in Geleceği İçin{" "}
              <span className="gradient-text">Mükemmel İsim</span>
            </h2>
            <p className="mt-5 leading-relaxed text-muted">
              <strong className="text-foreground">paylater.ca</strong>, &quot;şimdi al,
              sonra öde&quot; anlamını doğrudan taşıyan, uluslararası tanınan bir
              kavramı Kanada&apos;nın güvenilir <code className="rounded bg-white/5 px-1.5 py-0.5 text-accent-light">.ca</code>{" "}
              uzantısıyla birleştiriyor.
            </p>
            <p className="mt-4 leading-relaxed text-muted">
              BNPL pazarı 2030 yılına kadar küresel olarak 3 trilyon dolara
              ulaşması beklenen devasa bir sektör. Kanada&apos;da Affirm, Klarna,
              Sezzle ve yerel oyuncular hızla büyürken, doğru domain adı rekabet
              avantajının temelidir.
            </p>
          </div>

          <div className="relative">
            <div className="rounded-3xl border border-border bg-card p-8 backdrop-blur">
              <div className="space-y-6">
                {[
                  {
                    icon: "🎯",
                    title: "Doğrudan Anlam",
                    desc: "\"Pay Later\" — BNPL sektörünün evrensel terimi",
                  },
                  {
                    icon: "🇨🇦",
                    title: "Kanada Odaklı",
                    desc: ".ca uzantısı yerel güven ve CIRA uyumluluğu sağlar",
                  },
                  {
                    icon: "📈",
                    title: "SEO Avantajı",
                    desc: "Anahtar kelime zengin, kısa ve akılda kalıcı",
                  },
                  {
                    icon: "💎",
                    title: "Premium Kalite",
                    desc: "9 karakter, tire yok, rakam yok — saf marka değeri",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <h3 className="font-semibold text-foreground">{item.title}</h3>
                      <p className="mt-0.5 text-sm text-muted">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-3xl bg-accent/10" />
          </div>
        </div>
      </div>
    </section>
  );
}
