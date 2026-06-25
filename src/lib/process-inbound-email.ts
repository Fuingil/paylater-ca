import { Resend } from "resend";

import { db } from "@/lib/db";
import {
  parseInquiryIdFromAddresses,
  parseInquiryRefFromSubject,
} from "@/lib/inquiry-thread";

function getResend(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY not configured");
  return new Resend(apiKey);
}

function extractEmailAddress(value: string): string {
  const match = value.match(/<([^>]+)>/);
  return (match?.[1] ?? value).trim().toLowerCase();
}

async function findInquiryId(
  to: string[],
  from: string,
  subject: string,
): Promise<string | null> {
  const fromInquiryId = parseInquiryIdFromAddresses(to);
  if (fromInquiryId) {
    const inquiry = await db.contactInquiry.findUnique({
      where: { id: fromInquiryId },
      select: { id: true },
    });
    if (inquiry) return inquiry.id;
  }

  const ref = parseInquiryRefFromSubject(subject);
  if (ref) {
    const inquiry = await db.contactInquiry.findFirst({
      where: { id: { startsWith: ref } },
      orderBy: { createdAt: "desc" },
      select: { id: true },
    });
    if (inquiry) return inquiry.id;
  }

  const senderEmail = extractEmailAddress(from);
  const inquiry = await db.contactInquiry.findFirst({
    where: { email: senderEmail },
    orderBy: { createdAt: "desc" },
    select: { id: true },
  });

  return inquiry?.id ?? null;
}

export async function processInboundEmail(emailId: string): Promise<boolean> {
  const resend = getResend();
  const { data, error } = await resend.emails.receiving.get(emailId);

  if (error || !data) {
    console.error("Inbound email fetch failed:", error);
    return false;
  }

  const existing = await db.inquiryMessage.findUnique({
    where: { resendId: data.id },
  });
  if (existing) return true;

  const inquiryId = await findInquiryId(data.to, data.from, data.subject);
  if (!inquiryId) return false;

  const body =
    data.text?.trim() ||
    stripHtml(data.html ?? "") ||
    "(Boş mesaj)";

  await db.inquiryMessage.create({
    data: {
      inquiryId,
      direction: "inbound",
      body,
      subject: data.subject,
      fromEmail: data.from,
      toEmail: data.to.join(", "),
      resendId: data.id,
    },
  });

  return true;
}

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}
