"use server";

import { headers } from "next/headers";

import {
  createCaptchaChallenge,
  type CaptchaChallenge,
} from "@/lib/captcha";
import { isValidLocale, type Locale } from "@/i18n/config";
import { submitContactInquiry } from "@/lib/submit-contact-inquiry";

export type ContactFormState = {
  success: boolean;
  errors: string[];
  captcha: CaptchaChallenge;
};

export async function refreshCaptchaAction(): Promise<CaptchaChallenge> {
  return createCaptchaChallenge();
}

export async function submitContactAction(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const localeRaw = String(formData.get("locale") ?? "en");
  const locale: Locale = isValidLocale(localeRaw) ? localeRaw : "en";

  const headerList = await headers();
  const ipAddress =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headerList.get("x-real-ip") ??
    null;

  const result = await submitContactInquiry({
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    company: String(formData.get("company") ?? "") || undefined,
    phone: String(formData.get("phone") ?? "") || undefined,
    offerAmount: String(formData.get("offerAmount") ?? "") || undefined,
    message: String(formData.get("message") ?? ""),
    website: String(formData.get("website") ?? "") || undefined,
    captchaToken: String(formData.get("captchaToken") ?? ""),
    captchaAnswer: String(formData.get("captchaAnswer") ?? ""),
    locale,
    ipAddress,
    userAgent: headerList.get("user-agent"),
  });

  const nextCaptcha = createCaptchaChallenge();

  if (result.ok) {
    return { success: true, errors: [], captcha: nextCaptcha };
  }

  return { success: false, errors: result.errors, captcha: nextCaptcha };
}
