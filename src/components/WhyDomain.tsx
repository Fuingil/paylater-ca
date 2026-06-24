import type { Dictionary } from "@/i18n/get-dictionary";

type Props = { dict: Dictionary };

export function WhyDomain({ dict }: Props) {
  return (
    <section id="why" className="relative py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/5 to-transparent" />
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="grid gap-16 lg:grid-cols-2">
          <div>
            <span className="text-sm font-semibold uppercase tracking-widest text-gold">
              {dict.why.label}
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
              {dict.why.title}{" "}
              <span className="gradient-text">{dict.why.titleDomain}</span>
              {dict.why.titleEnd}
            </h2>
            <p className="mt-5 leading-relaxed text-muted">{dict.why.subtitle}</p>

            <ul className="mt-8 space-y-3">
              {dict.why.features.map((feature) => (
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
            {dict.why.stats.map((reason) => (
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
