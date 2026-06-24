import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { verifyCaptchaChallenge } from "@/lib/captcha";
import { isValidLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { db } from "@/lib/db";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
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
    locale: z.string().optional(),
    captchaToken: z.string().min(1, t.captchaRequired),
    captchaAnswer: z.string().min(1, t.captchaRequired),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const locale: Locale =
      body.locale && isValidLocale(body.locale) ? body.locale : "en";
    const contactSchema = getContactSchema(locale);
    const data = contactSchema.parse(body);
    const t = getDictionary(locale).api;

    if (data.website) {
      return NextResponse.json({ success: true, id: "ok" }, { status: 201 });
    }

    if (!verifyCaptchaChallenge(data.captchaToken, data.captchaAnswer)) {
      return NextResponse.json(
        { success: false, message: t.captchaInvalid },
        { status: 400 },
      );
    }

    const email = data.email.trim().toLowerCase();
    const ipAddress = getClientIp(request);

    if (await checkRateLimit(email)) {
      return NextResponse.json(
        { success: false, message: t.rateLimitEmail },
        { status: 429 },
      );
    }

    const inquiry = await db.contactInquiry.create({
      data: {
        name: data.name.trim(),
        email,
        company: data.company?.trim() || null,
        phone: data.phone?.trim() || null,
        offerAmount: data.offerAmount?.trim() || null,
        message: data.message.trim(),
        ipAddress,
        userAgent: request.headers.get("user-agent") ?? null,
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

    return NextResponse.json(
      { success: true, id: inquiry.id },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.issues.map((i) => i.message) },
        { status: 400 },
      );
    }

    console.error("Contact form error:", error);
    return NextResponse.json(
      { success: false, message: getDictionary("en").api.serverError },
      { status: 500 },
    );
  }
}
