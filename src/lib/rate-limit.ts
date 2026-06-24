import type { NextRequest } from "next/server";

import { db } from "@/lib/db";

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const MAX_SUBMISSIONS_PER_EMAIL = 3;
const MAX_SUBMISSIONS_PER_IP = 5;

export type RateLimitReason = "email" | "ip";

export async function checkRateLimit(
  email: string,
  ipAddress: string | null,
): Promise<RateLimitReason | null> {
  const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MS);

  const emailCount = await db.contactInquiry.count({
    where: { email, createdAt: { gte: since } },
  });

  if (emailCount >= MAX_SUBMISSIONS_PER_EMAIL) return "email";

  if (ipAddress) {
    const ipCount = await db.contactInquiry.count({
      where: { ipAddress, createdAt: { gte: since } },
    });

    if (ipCount >= MAX_SUBMISSIONS_PER_IP) return "ip";
  }

  return null;
}

export function getClientIp(request: NextRequest): string | null {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    null
  );
}
