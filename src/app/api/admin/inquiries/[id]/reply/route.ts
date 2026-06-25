import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { normalizeInquiryMessages } from "@/lib/inquiry-messages";
import { sendInquiryReply } from "@/lib/send-inquiry-reply";

export const dynamic = "force-dynamic";

const replySchema = z.object({
  message: z.string().min(2, "Mesaj en az 2 karakter olmalı"),
});

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: NextRequest, context: RouteContext) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const body = await request.json();
    const { message } = replySchema.parse(body);
    const result = await sendInquiryReply({ inquiryId: id, body: message });

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const inquiry = await db.contactInquiry.findUnique({
      where: { id },
      include: {
        messages: { orderBy: { createdAt: "asc" } },
      },
    });

    if (!inquiry) {
      return NextResponse.json({ error: "Teklif bulunamadı" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      messages: normalizeInquiryMessages(inquiry),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "Geçersiz istek" },
        { status: 400 },
      );
    }

    console.error("Admin reply error:", error);
    return NextResponse.json({ error: "Yanıt gönderilemedi" }, { status: 500 });
  }
}
