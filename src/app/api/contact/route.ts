import { NextRequest, NextResponse } from "next/server";

import { isValidLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getClientIp } from "@/lib/rate-limit";
import { submitContactInquiry } from "@/lib/submit-contact-inquiry";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const locale: Locale =
      body.locale && isValidLocale(body.locale) ? body.locale : "en";

    const result = await submitContactInquiry({
      name: body.name ?? "",
      email: body.email ?? "",
      company: body.company,
      phone: body.phone,
      offerAmount: body.offerAmount,
      message: body.message ?? "",
      website: body.website,
      captchaToken: body.captchaToken ?? "",
      captchaAnswer: body.captchaAnswer ?? "",
      locale,
      ipAddress: getClientIp(request),
      userAgent: request.headers.get("user-agent"),
    });

    if (result.ok) {
      return NextResponse.json(
        { success: true, id: result.id },
        { status: 201 },
      );
    }

    const status = !result.ok && result.rateLimited ? 429 : 400;

    return NextResponse.json(
      {
        success: false,
        message: result.errors[0],
        errors: result.errors,
      },
      { status },
    );
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { success: false, message: getDictionary("en").api.serverError },
      { status: 500 },
    );
  }
}
