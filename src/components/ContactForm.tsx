"use client";

import { useActionState, useState } from "react";

import {
  refreshCaptchaAction,
  submitContactAction,
  type ContactFormState,
} from "@/app/actions/contact";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { CaptchaChallenge } from "@/lib/captcha";

type Props = {
  dict: Dictionary;
  locale: Locale;
  initialCaptcha: CaptchaChallenge;
};

export function ContactForm({ dict, locale, initialCaptcha }: Props) {
  const t = dict.contact;
  const [captchaOverride, setCaptchaOverride] = useState<CaptchaChallenge | null>(
    null,
  );
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const [captchaError, setCaptchaError] = useState(false);

  const [state, formAction, pending] = useActionState<
    ContactFormState,
    FormData
  >(submitContactAction, {
    success: false,
    errors: [],
    captcha: initialCaptcha,
  });

  const captcha = captchaOverride ?? state.captcha;
  const formKey = state.success ? `success-${state.captcha.token}` : "form";

  async function handleRefreshCaptcha() {
    setCaptchaLoading(true);
    setCaptchaError(false);
    try {
      setCaptchaOverride(await refreshCaptchaAction());
    } catch {
      setCaptchaError(true);
    } finally {
      setCaptchaLoading(false);
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
              key={formKey}
              action={formAction}
              onSubmit={() => setCaptchaOverride(null)}
              className="rounded-3xl border border-border bg-card p-8 backdrop-blur"
            >
              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="captchaToken" value={captcha.token} />

              {state.success && (
                <div className="mb-6 rounded-xl border border-accent/30 bg-accent/10 p-4 text-sm text-accent-light">
                  {t.success}
                </div>
              )}

              {!state.success && state.errors.length > 0 && (
                <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
                  {state.errors.map((err) => (
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
                    {captchaLoading ? "..." : `${captcha.question} = ?`}
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
                    onClick={() => void handleRefreshCaptcha()}
                    disabled={captchaLoading}
                    className="rounded-lg border border-border px-3 py-2 text-xs text-muted transition hover:bg-white/5 hover:text-foreground disabled:opacity-50"
                    title={t.captchaRefresh}
                  >
                    ↻ {t.captchaRefresh}
                  </button>
                </div>
                {captchaError && (
                  <p className="mt-2 text-xs text-red-300">{t.captchaLoadError}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={pending || captchaLoading}
                className="mt-6 w-full rounded-2xl bg-accent py-3.5 text-base font-semibold text-background transition hover:bg-accent-light disabled:cursor-not-allowed disabled:opacity-60"
              >
                {pending ? t.submitting : t.submit}
              </button>

              <p className="mt-4 text-center text-xs text-muted">{t.privacy}</p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
