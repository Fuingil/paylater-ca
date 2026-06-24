import { Resend } from "resend";

type InquiryEmail = {
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  offerAmount: string | null;
  message: string;
  locale: string;
};

export async function sendInquiryNotification(inquiry: InquiryEmail): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.NOTIFY_EMAIL;

  if (!apiKey || !notifyEmail) {
    console.warn("Email notification skipped: RESEND_API_KEY or NOTIFY_EMAIL not set");
    return;
  }

  const from =
    process.env.RESEND_FROM_EMAIL ?? "paylater.ca <noreply@paylater.ca>";

  const resend = new Resend(apiKey);

  const rows = [
    ["Name", inquiry.name],
    ["Email", inquiry.email],
    ["Company", inquiry.company],
    ["Phone", inquiry.phone],
    ["Offer", inquiry.offerAmount],
    ["Language", inquiry.locale.toUpperCase()],
  ]
    .filter(([, value]) => value)
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px;color:#94a3b8;font-size:13px">${label}</td><td style="padding:8px 12px;color:#f8fafc;font-size:14px">${escapeHtml(value!)}</td></tr>`,
    )
    .join("");

  await resend.emails.send({
    from,
    to: [notifyEmail],
    replyTo: inquiry.email,
    subject: `paylater.ca — New offer from ${inquiry.name}`,
    html: `
      <div style="font-family:system-ui,sans-serif;background:#030712;color:#f8fafc;padding:32px">
        <h1 style="margin:0 0 8px;font-size:20px">New domain inquiry</h1>
        <p style="margin:0 0 24px;color:#94a3b8;font-size:14px">A new offer was submitted on paylater.ca</p>
        <table style="width:100%;border-collapse:collapse;background:#0f172a;border-radius:12px;overflow:hidden">${rows}</table>
        <div style="margin-top:24px;padding:16px;background:#0f172a;border-radius:12px">
          <p style="margin:0 0 8px;color:#94a3b8;font-size:12px;text-transform:uppercase">Message</p>
          <p style="margin:0;color:#f8fafc;font-size:14px;line-height:1.6;white-space:pre-wrap">${escapeHtml(inquiry.message)}</p>
        </div>
        <p style="margin-top:24px;font-size:12px;color:#64748b">
          Reply directly to this email to contact ${escapeHtml(inquiry.name)}.
        </p>
      </div>
    `,
  });
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
