"use client";

import { FormEvent, useEffect, useState } from "react";

type Inquiry = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  offerAmount: string | null;
  message: string;
  createdAt: string;
};

export function AdminPanel() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [error, setError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  async function fetchInquiries() {
    const res = await fetch("/api/admin/inquiries");
    if (res.ok) {
      const data = await res.json();
      setInquiries(data.inquiries);
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchInquiries();
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
      await fetchInquiries();
    } else {
      setError("Geçersiz şifre");
    }
    setLoginLoading(false);
  }

  async function handleLogout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    setAuthenticated(false);
    setInquiries([]);
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
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <h1 className="font-display text-xl font-bold">
              Teklifler <span className="text-accent">({inquiries.length})</span>
            </h1>
            <p className="text-sm text-muted">paylater.ca domain teklifleri</p>
          </div>
          <div className="flex gap-3">
            <a
              href="/"
              className="rounded-lg border border-border px-4 py-2 text-sm text-muted hover:text-foreground"
            >
              Siteye Dön
            </a>
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

      <main className="mx-auto max-w-6xl px-6 py-8">
        {inquiries.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-12 text-center text-muted">
            Henüz teklif yok. Form gönderimleri burada görünecek.
          </div>
        ) : (
          <div className="space-y-4">
            {inquiries.map((inquiry) => (
              <article
                key={inquiry.id}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="font-semibold text-foreground">{inquiry.name}</h2>
                    <a
                      href={`mailto:${inquiry.email}`}
                      className="text-sm text-accent-light hover:underline"
                    >
                      {inquiry.email}
                    </a>
                  </div>
                  <time className="text-xs text-muted">
                    {new Date(inquiry.createdAt).toLocaleString("tr-TR")}
                  </time>
                </div>

                <div className="mt-4 flex flex-wrap gap-3 text-sm">
                  {inquiry.company && (
                    <span className="rounded-full bg-white/5 px-3 py-1 text-muted">
                      🏢 {inquiry.company}
                    </span>
                  )}
                  {inquiry.phone && (
                    <span className="rounded-full bg-white/5 px-3 py-1 text-muted">
                      📞 {inquiry.phone}
                    </span>
                  )}
                  {inquiry.offerAmount && (
                    <span className="rounded-full bg-gold/10 px-3 py-1 font-medium text-gold">
                      💰 {inquiry.offerAmount}
                    </span>
                  )}
                </div>

                <p className="mt-4 text-sm leading-relaxed text-muted">{inquiry.message}</p>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
