import { z } from "zod";

import { verifyCaptchaChallenge } from "@/lib/captcha";
import { isValidLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { db } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";
import { sendInquiryNotification } from "@/lib/send-inquiry-email";

function getContactSchema(locale: Locale) {
  const t = getDictionary(locale).api;
  return z.object({
    name: z.string().min(2, t.nameMin),
    email: z.string().email(t.emailInvalid),
    company: z.string().optional(),
    phone: z.string().optional(),
    offerAmount: z.string().optional(),
    message: z.string().min(10, t.messageMin),
    website: z.string().optional(),
    captchaToken: z.string().min(1, t.captchaRequired),
    captchaAnswer: z.string().min(1, t.captchaRequired),
  });
}

export type ContactInput = {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  offerAmount?: string;
  message: string;
  website?: string;
  captchaToken: string;
  captchaAnswer: string;
  locale: Locale;
  ipAddress?: string | null;
  userAgent?: string | null;
};

export type ContactResult =
  | { ok: true; id: string }
  | { ok: false; errors: string[]; rateLimited?: boolean };

export async function submitContactInquiry(
  input: ContactInput,
): Promise<ContactResult> {
  const locale = isValidLocale(input.locale) ? input.locale : "en";
  const t = getDictionary(locale).api;

  if (input.website) {
    return { ok: true, id: "ok" };
  }

  const parsed = getContactSchema(locale).safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      errors: parsed.error.issues.map((i) => i.message),
    };
  }

  const data = parsed.data;

  if (!verifyCaptchaChallenge(data.captchaToken, data.captchaAnswer)) {
    return { ok: false, errors: [t.captchaInvalid] };
  }

  const email = data.email.trim().toLowerCase();

  if (await checkRateLimit(email)) {
    return { ok: false, errors: [t.rateLimitEmail], rateLimited: true };
  }

  try {
    const inquiry = await db.contactInquiry.create({
      data: {
        name: data.name.trim(),
        email,
        company: data.company?.trim() || null,
        phone: data.phone?.trim() || null,
        offerAmount: data.offerAmount?.trim() || null,
        message: data.message.trim(),
        ipAddress: input.ipAddress ?? null,
        userAgent: input.userAgent ?? null,
        messages: {
          create: {
            direction: "initial",
            body: data.message.trim(),
            subject: "Initial inquiry",
            fromEmail: email,
            toEmail: "info@paylater.ca",
          },
        },
      },
    });

    try {
      await sendInquiryNotification({
        name: data.name.trim(),
        email,
        company: data.company?.trim() || null,
        phone: data.phone?.trim() || null,
        offerAmount: data.offerAmount?.trim() || null,
        message: data.message.trim(),
        locale,
      });
    } catch (emailError) {
      console.error("Inquiry email failed:", emailError);
    }

    return { ok: true, id: inquiry.id };
  } catch (error) {
    console.error("Contact form error:", error);
    return { ok: false, errors: [t.serverError] };
  }
}
