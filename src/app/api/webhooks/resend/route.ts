import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

import { processInboundEmail } from "@/lib/process-inbound-email";

type ReceivedWebhook = {
  type: string;
  data?: {
    email_id?: string;
    from?: string;
    to?: string[];
    subject?: string;
  };
};

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY not configured");
  return new Resend(apiKey);
}

export async function POST(request: NextRequest) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  try {
    const rawBody = await request.text();
    const resend = getResend();
    let event: ReceivedWebhook;

    if (process.env.RESEND_WEBHOOK_SECRET) {
      event = resend.webhooks.verify({
        payload: rawBody,
        headers: {
          id: request.headers.get("svix-id") ?? "",
          timestamp: request.headers.get("svix-timestamp") ?? "",
          signature: request.headers.get("svix-signature") ?? "",
        },
        webhookSecret: process.env.RESEND_WEBHOOK_SECRET,
      }) as ReceivedWebhook;
    } else {
      event = JSON.parse(rawBody) as ReceivedWebhook;
    }

    if (event.type !== "email.received" || !event.data?.email_id) {
      return NextResponse.json({ ok: true });
    }

    const stored = await processInboundEmail(event.data.email_id);

    const notifyEmail = process.env.NOTIFY_EMAIL;
    if (!stored && notifyEmail) {
      const fromAddress =
        process.env.RESEND_FROM_EMAIL ?? "paylater.ca <noreply@paylater.ca>";

      await resend.emails.receiving.forward({
        emailId: event.data.email_id,
        to: notifyEmail,
        from: fromAddress,
        passthrough: true,
      });
    }

    return NextResponse.json({ ok: true, stored });
  } catch (error) {
    console.error("Resend webhook error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 400 });
  }
}
