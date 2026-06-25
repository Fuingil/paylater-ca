/**
 * Resend audit + auto-setup for paylater.ca
 * Usage: RESEND_API_KEY=re_xxx node scripts/setup-resend.mjs
 */

import { Resend } from "resend";

const DOMAIN = "paylater.ca";
const WEBHOOK_URL = "https://paylater.ca/api/webhooks/resend";
const WEBHOOK_EVENTS = ["email.received"];

const apiKey = process.env.RESEND_API_KEY;
if (!apiKey) {
  console.error("RESEND_API_KEY required");
  process.exit(1);
}

const resend = new Resend(apiKey);

function log(section, data) {
  console.log(`\n=== ${section} ===`);
  console.log(typeof data === "string" ? data : JSON.stringify(data, null, 2));
}

async function getDomain() {
  const list = await resend.domains.list();
  if (list.error) throw new Error(list.error.message);

  const domain = list.data?.data?.find((d) => d.name === DOMAIN);
  if (!domain) return null;

  const detail = await resend.domains.get(domain.id);
  if (detail.error) throw new Error(detail.error.message);
  return detail.data;
}

async function ensureDomain() {
  let domain = await getDomain();

  if (!domain) {
    log("DOMAIN", `Creating ${DOMAIN}...`);
    const created = await resend.domains.create({
      name: DOMAIN,
      region: "us-east-1",
      capabilities: { sending: "enabled", receiving: "enabled" },
    });
    if (created.error) throw new Error(created.error.message);
    domain = created.data;
    log("DOMAIN CREATED", domain);
  }

  const receiving = domain.capabilities?.receiving;
  const sending = domain.capabilities?.sending;

  if (receiving !== "enabled" || sending !== "enabled") {
    log("DOMAIN UPDATE", "Enabling sending + receiving...");
    const updated = await resend.domains.update({
      id: domain.id,
      capabilities: { sending: "enabled", receiving: "enabled" },
    });
    if (updated.error) throw new Error(updated.error.message);
    domain = await getDomain();
  }

  if (domain.status !== "verified") {
    log("DOMAIN VERIFY", "Triggering verification...");
    await resend.domains.verify(domain.id);
    domain = await getDomain();
  }

  return domain;
}

async function ensureWebhook() {
  const list = await resend.webhooks.list();
  if (list.error) throw new Error(list.error.message);

  const existing = list.data?.data?.find((w) => w.endpoint === WEBHOOK_URL);

  if (existing) {
    const needsEvents = WEBHOOK_EVENTS.some(
      (e) => !existing.events?.includes(e),
    );
    if (needsEvents) {
      const events = [...new Set([...(existing.events ?? []), ...WEBHOOK_EVENTS])];
      await resend.webhooks.update(existing.id, { events });
      log("WEBHOOK", `Updated events on ${existing.id}`);
    } else {
      log("WEBHOOK", `Already configured: ${existing.id}`);
    }
    return { id: existing.id, signing_secret: null, existing: true };
  }

  const created = await resend.webhooks.create({
    endpoint: WEBHOOK_URL,
    events: WEBHOOK_EVENTS,
  });

  if (created.error) throw new Error(created.error.message);

  log("WEBHOOK CREATED", {
    id: created.data.id,
    signing_secret: created.data.signing_secret,
  });

  return {
    id: created.data.id,
    signing_secret: created.data.signing_secret,
    existing: false,
  };
}

async function main() {
  log("START", `Resend setup for ${DOMAIN}`);

  const domain = await ensureDomain();
  log("DOMAIN STATUS", {
    name: domain.name,
    status: domain.status,
    capabilities: domain.capabilities,
    records: domain.records,
  });

  const webhook = await ensureWebhook();

  const mxRecord = domain.records?.find(
    (r) => r.type === "MX" && r.record === "Receiving",
  );
  const pending = domain.records?.filter((r) => r.status !== "verified") ?? [];

  log("DNS CHECKLIST", {
    mx_for_receiving: mxRecord ?? "not found — enable receiving in Resend",
    pending_records: pending.map((r) => ({
      type: r.type,
      name: r.name,
      value: r.value,
      status: r.status,
    })),
  });

  if (webhook.signing_secret) {
    log("VERCEL ENV", {
      RESEND_WEBHOOK_SECRET: webhook.signing_secret,
      note: "Run: vercel env add RESEND_WEBHOOK_SECRET production",
    });
  }

  log("DONE", "Review pending DNS records above if any are not verified");
}

main().catch((err) => {
  console.error("SETUP FAILED:", err.message);
  process.exit(1);
});
