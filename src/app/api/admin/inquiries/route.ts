import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const inquiries = await db.contactInquiry.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      company: true,
      phone: true,
      offerAmount: true,
      message: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ inquiries, total: inquiries.length });
}
