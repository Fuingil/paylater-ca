import { Resend } from "resend";

import { db } from "@/lib/db";
import {
  getReplyFromAddress,
  getReplyToAddress,
  getThreadSubject,
} from "@/lib/inquiry-thread";

type SendReplyInput = {
  inquiryId: string;
  body: string;
};

export async function sendInquiryReply({
  inquiryId,
  body,
}: SendReplyInput): Promise<{ ok: true } | { ok: false; error: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { ok: false, error: "E-posta servisi yapılandırılmamış" };
  }

  const inquiry = await db.contactInquiry.findUnique({
    where: { id: inquiryId },
  });

  if (!inquiry) {
    return { ok: false, error: "Teklif bulunamadı" };
  }

  const trimmed = body.trim();
  if (trimmed.length < 2) {
    return { ok: false, error: "Mesaj çok kısa" };
  }

  const from = getReplyFromAddress();
  const replyTo = getReplyToAddress(inquiryId);
  const subject = getThreadSubject(inquiry.name, inquiryId);
  const resend = new Resend(apiKey);

  const { data, error } = await resend.emails.send({
    from,
    to: [inquiry.email],
    replyTo,
    subject,
    text: trimmed,
    html: `
      <div style="font-family:system-ui,sans-serif;background:#030712;color:#f8fafc;padding:32px">
        <p style="margin:0 0 16px;color:#94a3b8;font-size:13px">paylater.ca</p>
        <div style="padding:16px;background:#0f172a;border-radius:12px">
          <p style="margin:0;color:#f8fafc;font-size:15px;line-height:1.7;white-space:pre-wrap">${escapeHtml(trimmed)}</p>
        </div>
        <p style="margin-top:24px;font-size:12px;color:#64748b">
          Bu e-postayı yanıtlayarak bizimle iletişime devam edebilirsiniz.
        </p>
      </div>
    `,
  });

  if (error) {
    console.error("Inquiry reply send failed:", error);
    return { ok: false, error: error.message ?? "E-posta gönderilemedi" };
  }

  await db.inquiryMessage.create({
    data: {
      inquiryId,
      direction: "outbound",
      body: trimmed,
      subject,
      fromEmail: from,
      toEmail: inquiry.email,
      resendId: data?.id ?? null,
    },
  });

  return { ok: true };
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
