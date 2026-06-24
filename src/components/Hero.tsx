import type { Dictionary } from "@/i18n/get-dictionary";

type Props = { dict: Dictionary };

export function Hero({ dict }: Props) {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-32">
      <div className="glow-orb -top-32 left-1/4 h-96 w-96 bg-accent/20 animate-pulse-glow" />
      <div className="glow-orb top-20 right-1/4 h-72 w-72 bg-gold/10 animate-pulse-glow" style={{ animationDelay: "2s" }} />
      <div className="absolute inset-0 grid-bg opacity-50" />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm text-accent-light">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          {dict.hero.badge}
        </div>

        <h1 className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight md:text-7xl lg:text-8xl">
          <span className="gradient-text">paylater</span>
          <span className="text-foreground">.ca</span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">
          {dict.hero.subtitle}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-2xl bg-accent px-7 py-3.5 text-base font-semibold text-background shadow-lg shadow-accent/25 transition hover:bg-accent-light hover:shadow-accent/40"
          >
            {dict.hero.cta1}
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <a
            href="#use-cases"
            className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-7 py-3.5 text-base font-medium text-foreground backdrop-blur transition hover:border-accent/40 hover:bg-accent/5"
          >
            {dict.hero.cta2}
          </a>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {dict.hero.stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-border bg-card p-4 text-center backdrop-blur"
            >
              <div className="font-display text-2xl font-bold text-accent md:text-3xl">
                {stat.value}
              </div>
              <div className="mt-1 text-xs text-muted md:text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
