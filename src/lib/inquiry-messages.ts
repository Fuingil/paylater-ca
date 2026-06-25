export type InquiryMessageDto = {
  id: string;
  direction: string;
  body: string;
  subject: string | null;
  fromEmail: string;
  toEmail: string;
  createdAt: string;
};

type InquiryWithMessages = {
  id: string;
  email: string;
  message: string;
  createdAt: Date | string;
  messages: Array<{
    id: string;
    direction: string;
    body: string;
    subject: string | null;
    fromEmail: string;
    toEmail: string;
    createdAt: Date | string;
  }>;
};

function toIsoDate(value: Date | string): string {
  return typeof value === "string" ? value : value.toISOString();
}

function toMessageDto(
  message: InquiryWithMessages["messages"][number],
): InquiryMessageDto {
  return {
    id: message.id,
    direction: message.direction,
    body: message.body,
    subject: message.subject,
    fromEmail: message.fromEmail,
    toEmail: message.toEmail,
    createdAt: toIsoDate(message.createdAt),
  };
}

export function normalizeInquiryMessages(
  inquiry: InquiryWithMessages,
): InquiryMessageDto[] {
  const hasInitial = inquiry.messages.some((m) => m.direction === "initial");
  const result = inquiry.messages.map(toMessageDto);

  if (!hasInitial && inquiry.message.trim()) {
    result.unshift({
      id: `initial-${inquiry.id}`,
      direction: "initial",
      body: inquiry.message.trim(),
      subject: "Initial inquiry",
      fromEmail: inquiry.email,
      toEmail: "info@paylater.ca",
      createdAt: toIsoDate(inquiry.createdAt),
    });
  }

  return result.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
}

export function formatMessageDateTime(iso: string): string {
  return new Date(iso).toLocaleString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
