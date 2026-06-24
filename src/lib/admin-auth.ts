import { NextRequest } from "next/server";

export function isAdminAuthenticated(request: NextRequest): boolean {
  const adminSecret = process.env.ADMIN_SECRET;
  if (!adminSecret) return false;

  const token = request.cookies.get("admin_token")?.value;
  return token === adminSecret;
}
