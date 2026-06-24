import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/lib/db";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const contactSchema = z.object({
  name: z.string().min(2, "İsim en az 2 karakter olmalıdır"),
  email: z.string().email("Geçerli bir e-posta adresi girin"),
  company: z.string().optional(),
  phone: z.string().optional(),
  offerAmount: z.string().optional(),
  message: z.string().min(10, "Mesaj en az 10 karakter olmalıdır"),
  website: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = contactSchema.parse(body);

    if (data.website) {
      return NextResponse.json({ success: true, id: "ok" }, { status: 201 });
    }

    const email = data.email.trim().toLowerCase();
    const ipAddress = getClientIp(request);

    const rateLimitError = await checkRateLimit(email, ipAddress);
    if (rateLimitError) {
      return NextResponse.json({ success: false, message: rateLimitError }, { status: 429 });
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
      { success: false, message: "Bir hata oluştu. Lütfen tekrar deneyin." },
      { status: 500 },
    );
  }
}
