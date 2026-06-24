const reasons = [
  {
    stat: "3T$+",
    label: "2030 BNPL pazar büyüklüğü tahmini",
  },
  {
    stat: "%67",
    label: "Kanadalı tüketicilerin BNPL kullanım oranı",
  },
  {
    stat: "Top 1%",
    label: "Fintech domain kalitesi",
  },
  {
    stat: "Anında",
    label: "Marka tanınırlığı ve güven",
  },
];

const features = [
  "Kısa, akılda kalıcı ve telaffuzu kolay",
  "İngilizce ve Fransızca pazarlarda anlaşılır",
  "Google'da \"pay later canada\" aramalarına uygun",
  "Sosyal medya kullanıcı adlarıyla uyumlu (@paylater)",
  "Trademark dostu, jenerik ve açıklayıcı",
  "Mobil uygulama ve API dokümantasyonu için ideal URL yapısı",
];

export function WhyDomain() {
  return (
    <section id="neden" className="relative py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/5 to-transparent" />
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="grid gap-16 lg:grid-cols-2">
          <div>
            <span className="text-sm font-semibold uppercase tracking-widest text-gold">
              Yatırım Değeri
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
              Neden <span className="gradient-text">paylater.ca</span>?
            </h2>
            <p className="mt-5 leading-relaxed text-muted">
              Premium domain&apos;ler dijital gayrimenkul gibidir — doğru
              konumdaki doğru isim, yıllarca süren pazarlama yatırımının
              yerini alır. Bu domain, BNPL sektörünün tam kalbinde duruyor.
            </p>

            <ul className="mt-8 space-y-3">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-muted">
                  <svg
                    className="mt-0.5 h-5 w-5 shrink-0 text-accent"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {reasons.map((reason) => (
              <div
                key={reason.label}
                className="flex flex-col justify-center rounded-2xl border border-border bg-card p-6 text-center backdrop-blur"
              >
                <div className="font-display text-3xl font-extrabold text-accent md:text-4xl">
                  {reason.stat}
                </div>
                <p className="mt-2 text-xs leading-snug text-muted md:text-sm">
                  {reason.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
