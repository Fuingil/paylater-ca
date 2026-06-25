const REF_PREFIX = "[PL:";

export function getInquiryRef(inquiryId: string): string {
  return inquiryId.slice(0, 8);
}

export function getInboundDomain(): string {
  return process.env.INBOUND_EMAIL_DOMAIN ?? "paylater.ca";
}

export function getReplyToAddress(inquiryId: string): string {
  return `replies+${inquiryId}@${getInboundDomain()}`;
}

export function getThreadSubject(_name: string, inquiryId: string): string {
  return `paylater.ca — Your inquiry ${formatInquiryRef(inquiryId)}`;
}

export function formatInquiryRef(inquiryId: string): string {
  return `${REF_PREFIX}${getInquiryRef(inquiryId)}]`;
}

export function parseInquiryIdFromAddresses(addresses: string[]): string | null {
  for (const address of addresses) {
    const match = address.match(/replies\+([^@\s>]+)@/i);
    if (match?.[1]) return match[1];
  }
  return null;
}

export function parseInquiryRefFromSubject(subject: string): string | null {
  const match = subject.match(/\[PL:([a-z0-9]+)\]/i);
  return match?.[1] ?? null;
}

export function getReplyFromAddress(): string {
  return (
    process.env.RESEND_REPLY_FROM ??
    process.env.RESEND_FROM_EMAIL ??
    "paylater.ca <info@paylater.ca>"
  );
}
