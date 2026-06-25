import { NextRequest, NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { normalizeInquiryMessages } from "@/lib/inquiry-messages";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const inquiries = await db.contactInquiry.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  return NextResponse.json(
    {
      inquiries: inquiries.map((inquiry) => ({
        ...inquiry,
        messages: normalizeInquiryMessages(inquiry),
      })),
      total: inquiries.length,
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    },
  );
}
