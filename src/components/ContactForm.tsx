"use client";

import { FormEvent, useState } from "react";

type FormState = "idle" | "loading" | "success" | "error";

export function ContactForm() {
  const [state, setState] = useState<FormState>("idle");
  const [errors, setErrors] = useState<string[]>([]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");
    setErrors([]);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      company: (formData.get("company") as string) || undefined,
      phone: (formData.get("phone") as string) || undefined,
      offerAmount: (formData.get("offerAmount") as string) || undefined,
      message: formData.get("message") as string,
      website: (formData.get("website") as string) || undefined,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors(data.errors ?? [data.message ?? "Bir hata oluştu"]);
        setState("error");
        return;
      }

      setState("success");
      form.reset();
    } catch {
      setErrors(["Bağlantı hatası. Lütfen tekrar deneyin."]);
      setState("error");
    }
  }

  return (
    <section id="iletisim" className="relative py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <span className="text-sm font-semibold uppercase tracking-widest text-accent">
              İletişim
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
              Teklif Verin
            </h2>
            <p className="mt-4 leading-relaxed text-muted">
              paylater.ca ile ilgileniyorsanız formu doldurun. En kısa sürede
              size dönüş yapılacaktır. Ciddi teklifler önceliklidir.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-sm text-muted">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  ✉️
                </span>
                <div>
                  <div className="font-medium text-foreground">E-posta</div>
                  <div>info@paylater.ca</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  🌐
                </span>
                <div>
                  <div className="font-medium text-foreground">Domain</div>
                  <div>paylater.ca</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  🔒
                </span>
                <div>
                  <div className="font-medium text-foreground">Transfer</div>
                  <div>Güvenli escrow ile teslim</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-border bg-card p-8 backdrop-blur"
            >
              {state === "success" && (
                <div className="mb-6 rounded-xl border border-accent/30 bg-accent/10 p-4 text-sm text-accent-light">
                  ✓ Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.
                </div>
              )}

              {state === "error" && errors.length > 0 && (
                <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
                  {errors.map((err) => (
                    <div key={err}>• {err}</div>
                  ))}
                </div>
              )}

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="absolute -left-[9999px]" aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
                </div>
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
                    Ad Soyad <span className="text-accent">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    minLength={2}
                    className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm outline-none transition focus:border-accent/50 focus:ring-2 focus:ring-accent/20"
                    placeholder="Adınız Soyadınız"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
                    E-posta <span className="text-accent">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm outline-none transition focus:border-accent/50 focus:ring-2 focus:ring-accent/20"
                    placeholder="ornek@sirket.com"
                  />
                </div>
                <div>
                  <label htmlFor="company" className="mb-1.5 block text-sm font-medium">
                    Şirket
                  </label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm outline-none transition focus:border-accent/50 focus:ring-2 focus:ring-accent/20"
                    placeholder="Şirket adı"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="mb-1.5 block text-sm font-medium">
                    Telefon
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm outline-none transition focus:border-accent/50 focus:ring-2 focus:ring-accent/20"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div className="mt-5">
                <label htmlFor="offerAmount" className="mb-1.5 block text-sm font-medium">
                  Teklif Tutarı (USD/CAD)
                </label>
                <input
                  id="offerAmount"
                  name="offerAmount"
                  type="text"
                  className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm outline-none transition focus:border-accent/50 focus:ring-2 focus:ring-accent/20"
                  placeholder="ör. $25,000 CAD"
                />
              </div>

              <div className="mt-5">
                <label htmlFor="message" className="mb-1.5 block text-sm font-medium">
                  Mesajınız <span className="text-accent">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  minLength={10}
                  rows={4}
                  className="w-full resize-none rounded-xl border border-border bg-background/50 px-4 py-3 text-sm outline-none transition focus:border-accent/50 focus:ring-2 focus:ring-accent/20"
                  placeholder="Domain ile ilgili teklifiniz veya sorularınız..."
                />
              </div>

              <button
                type="submit"
                disabled={state === "loading"}
                className="mt-6 w-full rounded-2xl bg-accent py-3.5 text-base font-semibold text-background transition hover:bg-accent-light disabled:cursor-not-allowed disabled:opacity-60"
              >
                {state === "loading" ? "Gönderiliyor..." : "Teklif Gönder"}
              </button>

              <p className="mt-4 text-center text-xs text-muted">
                Bilgileriniz yalnızca domain satış süreci için kullanılır.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
