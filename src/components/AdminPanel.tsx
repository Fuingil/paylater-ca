"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

type InquiryMessage = {
  id: string;
  direction: string;
  body: string;
  subject: string | null;
  fromEmail: string;
  toEmail: string;
  createdAt: string;
};

type Inquiry = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  offerAmount: string | null;
  message: string;
  createdAt: string;
  messages: InquiryMessage[];
};

function getThreadMessages(inquiry: Inquiry): InquiryMessage[] {
  if (inquiry.messages.length > 0) return inquiry.messages;

  return [
    {
      id: `initial-${inquiry.id}`,
      direction: "initial",
      body: inquiry.message,
      subject: "İlk teklif mesajı",
      fromEmail: inquiry.email,
      toEmail: "info@paylater.ca",
      createdAt: inquiry.createdAt,
    },
  ];
}

function directionLabel(direction: string): string {
  switch (direction) {
    case "initial":
      return "İlk teklif";
    case "outbound":
      return "Sizin yanıtınız";
    case "inbound":
      return "Müşteri yanıtı";
    default:
      return direction;
  }
}

export function AdminPanel() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);
  const [replyError, setReplyError] = useState("");
  const [error, setError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const selectedInquiry =
    inquiries.find((inquiry) => inquiry.id === selectedId) ?? null;

  async function fetchInquiries(selectFirst = false) {
    const res = await fetch("/api/admin/inquiries");
    if (res.ok) {
      const data = await res.json();
      setInquiries(data.inquiries);
      setAuthenticated(true);
      if (selectFirst && data.inquiries.length > 0) {
        setSelectedId(data.inquiries[0].id);
      }
    } else {
      setAuthenticated(false);
    }
    setLoading(false);
  }

  useEffect(() => {
    let active = true;

    void (async () => {
      const res = await fetch("/api/admin/inquiries");
      if (!active) return;
      if (res.ok) {
        const data = await res.json();
        setInquiries(data.inquiries);
        setAuthenticated(true);
        if (data.inquiries.length > 0) {
          setSelectedId(data.inquiries[0].id);
        }
      } else {
        setAuthenticated(false);
      }
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, []);

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoginLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: formData.get("password") }),
    });

    if (res.ok) {
      await fetchInquiries(true);
    } else {
      setError("Geçersiz şifre");
    }
    setLoginLoading(false);
  }

  async function handleLogout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    setAuthenticated(false);
    setInquiries([]);
    setSelectedId(null);
  }

  async function handleReply(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedInquiry) return;

    setReplyLoading(true);
    setReplyError("");

    const res = await fetch(`/api/admin/inquiries/${selectedInquiry.id}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: replyText }),
    });

    const data = await res.json();

    if (res.ok) {
      setInquiries((current) =>
        current.map((inquiry) =>
          inquiry.id === selectedInquiry.id
            ? { ...inquiry, messages: data.messages }
            : inquiry,
        ),
      );
      setReplyText("");
    } else {
      setReplyError(data.error ?? "Yanıt gönderilemedi");
    }

    setReplyLoading(false);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-muted">Yükleniyor...</div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-2xl border border-border bg-card p-8"
        >
          <h1 className="font-display text-xl font-bold">Admin Girişi</h1>
          <p className="mt-2 text-sm text-muted">paylater.ca teklif yönetimi</p>

          {error && (
            <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </div>
          )}

          <input
            name="password"
            type="password"
            required
            placeholder="Admin şifresi"
            className="mt-6 w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm outline-none focus:border-accent/50"
          />

          <button
            type="submit"
            disabled={loginLoading}
            className="mt-4 w-full rounded-xl bg-accent py-3 text-sm font-semibold text-background disabled:opacity-60"
          >
            {loginLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <h1 className="font-display text-xl font-bold">
              Teklifler <span className="text-accent">({inquiries.length})</span>
            </h1>
            <p className="text-sm text-muted">
              Yanıtlar info@paylater.ca üzerinden gönderilir
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => void fetchInquiries()}
              className="rounded-lg border border-border px-4 py-2 text-sm text-muted hover:text-foreground"
            >
              Yenile
            </button>
            <Link
              href="/"
              className="rounded-lg border border-border px-4 py-2 text-sm text-muted hover:text-foreground"
            >
              Siteye Dön
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg bg-accent/10 px-4 py-2 text-sm text-accent-light"
            >
              Çıkış
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {inquiries.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-12 text-center text-muted">
            Henüz teklif yok. Form gönderimleri burada görünecek.
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
            <aside className="space-y-2">
              {inquiries.map((inquiry) => {
                const thread = getThreadMessages(inquiry);
                const lastMessage = thread[thread.length - 1];
                const isSelected = inquiry.id === selectedId;

                return (
                  <button
                    key={inquiry.id}
                    type="button"
                    onClick={() => {
                      setSelectedId(inquiry.id);
                      setReplyText("");
                      setReplyError("");
                    }}
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      isSelected
                        ? "border-accent/40 bg-accent/10"
                        : "border-border bg-card hover:border-accent/20"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-semibold text-foreground">
                          {inquiry.name}
                        </div>
                        <div className="text-xs text-muted">{inquiry.email}</div>
                      </div>
                      <time className="shrink-0 text-[10px] text-muted">
                        {new Date(inquiry.createdAt).toLocaleDateString("tr-TR")}
                      </time>
                    </div>
                    <p className="mt-2 line-clamp-2 text-xs text-muted">
                      {lastMessage.body}
                    </p>
                    <div className="mt-2 text-[10px] uppercase tracking-wide text-accent-light">
                      {thread.length} mesaj
                    </div>
                  </button>
                );
              })}
            </aside>

            {selectedInquiry ? (
              <section className="rounded-2xl border border-border bg-card">
                <div className="border-b border-border p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold">{selectedInquiry.name}</h2>
                      <a
                        href={`mailto:${selectedInquiry.email}`}
                        className="text-sm text-accent-light hover:underline"
                      >
                        {selectedInquiry.email}
                      </a>
                    </div>
                    <time className="text-xs text-muted">
                      {new Date(selectedInquiry.createdAt).toLocaleString("tr-TR")}
                    </time>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 text-sm">
                    {selectedInquiry.company && (
                      <span className="rounded-full bg-white/5 px-3 py-1 text-muted">
                        🏢 {selectedInquiry.company}
                      </span>
                    )}
                    {selectedInquiry.phone && (
                      <span className="rounded-full bg-white/5 px-3 py-1 text-muted">
                        📞 {selectedInquiry.phone}
                      </span>
                    )}
                    {selectedInquiry.offerAmount && (
                      <span className="rounded-full bg-gold/10 px-3 py-1 font-medium text-gold">
                        💰 {selectedInquiry.offerAmount}
                      </span>
                    )}
                  </div>
                </div>

                <div className="max-h-[420px] space-y-4 overflow-y-auto p-6">
                  {getThreadMessages(selectedInquiry).map((message) => {
                    const isOutbound = message.direction === "outbound";

                    return (
                      <div
                        key={message.id}
                        className={`flex ${isOutbound ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                            isOutbound
                              ? "bg-accent/15 text-foreground"
                              : "bg-white/5 text-muted"
                          }`}
                        >
                          <div className="mb-1 flex items-center gap-2 text-[10px] uppercase tracking-wide">
                            <span className={isOutbound ? "text-accent-light" : "text-muted"}>
                              {directionLabel(message.direction)}
                            </span>
                            <span className="text-muted">
                              {new Date(message.createdAt).toLocaleString("tr-TR")}
                            </span>
                          </div>
                          <p className="whitespace-pre-wrap text-sm leading-relaxed">
                            {message.body}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <form
                  onSubmit={handleReply}
                  className="border-t border-border p-6"
                >
                  <label htmlFor="reply" className="mb-2 block text-sm font-medium">
                    Yanıt yaz
                  </label>
                  <textarea
                    id="reply"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    required
                    minLength={2}
                    rows={4}
                    placeholder="Müşteriye gönderilecek yanıtınız..."
                    className="w-full resize-none rounded-xl border border-border bg-background/50 px-4 py-3 text-sm outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20"
                  />

                  {replyError && (
                    <p className="mt-2 text-sm text-red-300">• {replyError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={replyLoading || replyText.trim().length < 2}
                    className="mt-4 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-background disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {replyLoading ? "Gönderiliyor..." : "E-posta ile Yanıtla"}
                  </button>
                </form>
              </section>
            ) : (
              <div className="flex items-center justify-center rounded-2xl border border-border bg-card p-12 text-muted">
                Görüntülemek için bir teklif seçin
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
