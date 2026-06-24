export function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <span className="font-display text-lg font-bold">
              paylater<span className="text-accent">.ca</span>
            </span>
            <span className="text-sm text-muted">— Premium Domain Satılık</span>
          </div>
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} paylater.ca. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}
