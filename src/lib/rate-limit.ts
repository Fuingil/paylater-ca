import type { NextRequest } from "next/server";

import { db } from "@/lib/db";

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const MAX_SUBMISSIONS_PER_EMAIL = 10;

export async function checkRateLimit(email: string): Promise<boolean> {
  const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MS);

  const emailCount = await db.contactInquiry.count({
    where: { email, createdAt: { gte: since } },
  });

  return emailCount >= MAX_SUBMISSIONS_PER_EMAIL;
}

export function getClientIp(request: NextRequest): string | null {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    null
  );
}
