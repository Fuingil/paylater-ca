import type { Dictionary } from "@/i18n/get-dictionary";

type Props = { dict: Dictionary };

export function UseCases({ dict }: Props) {
  return (
    <section id="use-cases" className="relative py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent" />
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-accent">
            {dict.useCases.label}
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
            {dict.useCases.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted">{dict.useCases.subtitle}</p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {dict.useCases.items.map((item) => (
            <article
              key={item.title}
              className="group rounded-2xl border border-border bg-card p-6 backdrop-blur transition hover:border-accent/30 hover:bg-accent/5"
            >
              <span className="text-3xl">{item.icon}</span>
              <h3 className="mt-4 font-display text-lg font-bold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
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
