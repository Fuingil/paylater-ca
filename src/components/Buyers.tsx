import type { Dictionary } from "@/i18n/get-dictionary";

type Props = { dict: Dictionary };

export function Buyers({ dict }: Props) {
  return (
    <section id="buyers" className="relative py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-accent">
            {dict.buyers.label}
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
            {dict.buyers.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted">{dict.buyers.subtitle}</p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {dict.buyers.items.map((buyer) => (
            <article
              key={buyer.title}
              className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 backdrop-blur"
            >
              <div className="absolute right-4 top-4 rounded-full bg-gold/10 px-3 py-1 text-xs font-medium text-gold">
                {buyer.highlight}
              </div>
              <span className="text-3xl">{buyer.icon}</span>
              <h3 className="mt-4 font-display text-lg font-bold">{buyer.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{buyer.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
