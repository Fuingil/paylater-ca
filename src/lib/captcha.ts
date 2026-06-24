import { createHmac, timingSafeEqual } from "crypto";

const CAPTCHA_TTL_MS = 10 * 60 * 1000;

function getSecret(): string {
  return process.env.CAPTCHA_SECRET ?? process.env.ADMIN_SECRET ?? "dev-captcha-secret";
}

export type CaptchaChallenge = {
  question: string;
  token: string;
};

export function createCaptchaChallenge(): CaptchaChallenge {
  const a = Math.floor(Math.random() * 9) + 1;
  const b = Math.floor(Math.random() * 9) + 1;
  const expires = Date.now() + CAPTCHA_TTL_MS;
  const payload = `${a}:${b}:${expires}`;
  const signature = sign(payload);

  return {
    question: `${a} + ${b}`,
    token: `${Buffer.from(payload).toString("base64url")}.${signature}`,
  };
}

export function verifyCaptchaChallenge(
  token: string,
  answer: string | number,
): boolean {
  const parsed = Number(String(answer).trim());
  if (!Number.isFinite(parsed)) return false;

  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return false;

  let payload: string;
  try {
    payload = Buffer.from(encoded, "base64url").toString("utf8");
  } catch {
    return false;
  }

  if (!safeEqual(sign(payload), signature)) return false;

  const [aStr, bStr, expiresStr] = payload.split(":");
  const a = Number(aStr);
  const b = Number(bStr);
  const expires = Number(expiresStr);

  if (!Number.isFinite(a) || !Number.isFinite(b) || !Number.isFinite(expires)) {
    return false;
  }

  if (Date.now() > expires) return false;

  return parsed === a + b;
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}
