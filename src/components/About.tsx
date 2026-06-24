import type { Dictionary } from "@/i18n/get-dictionary";

type Props = { dict: Dictionary };

export function About({ dict }: Props) {
  return (
    <section id="about" className="relative py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <span className="text-sm font-semibold uppercase tracking-widest text-accent">
              {dict.about.label}
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
              {dict.about.title}{" "}
              <span className="gradient-text">{dict.about.titleHighlight}</span>
            </h2>
            <p className="mt-5 leading-relaxed text-muted">{dict.about.p1}</p>
            <p className="mt-4 leading-relaxed text-muted">{dict.about.p2}</p>
          </div>

          <div className="relative">
            <div className="rounded-3xl border border-border bg-card p-8 backdrop-blur">
              <div className="space-y-6">
                {dict.about.features.map((item) => (
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
