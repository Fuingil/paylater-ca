"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";

type FormState = "idle" | "loading" | "success" | "error";

type CaptchaData = {
  question: string;
  token: string;
};

type Props = {
  dict: Dictionary;
  locale: Locale;
};

export function ContactForm({ dict, locale }: Props) {
  const [state, setState] = useState<FormState>("idle");
  const [errors, setErrors] = useState<string[]>([]);
  const [captcha, setCaptcha] = useState<CaptchaData | null>(null);
  const [captchaLoading, setCaptchaLoading] = useState(true);
  const t = dict.contact;

  const loadCaptcha = useCallback(async (showLoading = true) => {
    if (showLoading) setCaptchaLoading(true);
    try {
      const res = await fetch("/api/captcha");
      if (res.ok) {
        setCaptcha(await res.json());
      }
    } finally {
      setCaptchaLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/captcha");
        if (!cancelled && res.ok) {
          setCaptcha(await res.json());
        }
      } finally {
        if (!cancelled) setCaptchaLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");
    setErrors([]);

    if (!captcha) {
      setErrors([t.captchaInvalid]);
      setState("error");
      return;
    }

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
      captchaToken: captcha.token,
      captchaAnswer: formData.get("captchaAnswer") as string,
      locale,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors(data.errors ?? [data.message ?? t.genericError]);
        setState("error");
        await loadCaptcha();
        return;
      }

      setState("success");
      form.reset();
      await loadCaptcha();
    } catch {
      setErrors([t.connectionError]);
      setState("error");
      await loadCaptcha();
    }
  }

  return (
    <section id="contact" className="relative py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <span className="text-sm font-semibold uppercase tracking-widest text-accent">
              {t.label}
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
              {t.title}
            </h2>
            <p className="mt-4 leading-relaxed text-muted">{t.subtitle}</p>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-sm text-muted">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  ✉️
                </span>
                <div>
                  <div className="font-medium text-foreground">{t.email}</div>
                  <div>info@paylater.ca</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  🌐
                </span>
                <div>
                  <div className="font-medium text-foreground">{t.domain}</div>
                  <div>paylater.ca</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  🔒
                </span>
                <div>
                  <div className="font-medium text-foreground">{t.transfer}</div>
                  <div>{t.transferValue}</div>
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
                  {t.success}
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
                    {t.name} <span className="text-accent">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    minLength={2}
                    className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm outline-none transition focus:border-accent/50 focus:ring-2 focus:ring-accent/20"
                    placeholder={t.namePlaceholder}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
                    {t.email} <span className="text-accent">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm outline-none transition focus:border-accent/50 focus:ring-2 focus:ring-accent/20"
                    placeholder={t.emailPlaceholder}
                  />
                </div>
                <div>
                  <label htmlFor="company" className="mb-1.5 block text-sm font-medium">
                    {t.company}
                  </label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm outline-none transition focus:border-accent/50 focus:ring-2 focus:ring-accent/20"
                    placeholder={t.companyPlaceholder}
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="mb-1.5 block text-sm font-medium">
                    {t.phone}
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm outline-none transition focus:border-accent/50 focus:ring-2 focus:ring-accent/20"
                    placeholder={t.phonePlaceholder}
                  />
                </div>
              </div>

              <div className="mt-5">
                <label htmlFor="offerAmount" className="mb-1.5 block text-sm font-medium">
                  {t.offerAmount}
                </label>
                <input
                  id="offerAmount"
                  name="offerAmount"
                  type="text"
                  className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm outline-none transition focus:border-accent/50 focus:ring-2 focus:ring-accent/20"
                  placeholder={t.offerPlaceholder}
                />
              </div>

              <div className="mt-5">
                <label htmlFor="message" className="mb-1.5 block text-sm font-medium">
                  {t.message} <span className="text-accent">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  minLength={10}
                  rows={4}
                  className="w-full resize-none rounded-xl border border-border bg-background/50 px-4 py-3 text-sm outline-none transition focus:border-accent/50 focus:ring-2 focus:ring-accent/20"
                  placeholder={t.messagePlaceholder}
                />
              </div>

              <div className="mt-5 rounded-xl border border-border bg-background/40 p-4">
                <label htmlFor="captchaAnswer" className="mb-2 block text-sm font-medium">
                  {t.captchaLabel} <span className="text-accent">*</span>
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex h-11 min-w-[120px] items-center justify-center rounded-lg bg-accent/10 px-4 font-mono text-lg font-bold tracking-widest text-accent-light">
                    {captchaLoading ? "..." : `${captcha?.question} = ?`}
                  </div>
                  <input
                    id="captchaAnswer"
                    name="captchaAnswer"
                    type="text"
                    inputMode="numeric"
                    required
                    autoComplete="off"
                    className="w-24 rounded-xl border border-border bg-background/50 px-4 py-3 text-sm outline-none transition focus:border-accent/50 focus:ring-2 focus:ring-accent/20"
                    placeholder="?"
                  />
                  <button
                    type="button"
                    onClick={() => void loadCaptcha()}
                    className="rounded-lg border border-border px-3 py-2 text-xs text-muted transition hover:bg-white/5 hover:text-foreground"
                    title={t.captchaRefresh}
                  >
                    ↻ {t.captchaRefresh}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={state === "loading" || captchaLoading || !captcha}
                className="mt-6 w-full rounded-2xl bg-accent py-3.5 text-base font-semibold text-background transition hover:bg-accent-light disabled:cursor-not-allowed disabled:opacity-60"
              >
                {state === "loading" ? t.submitting : t.submit}
              </button>

              <p className="mt-4 text-center text-xs text-muted">{t.privacy}</p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
