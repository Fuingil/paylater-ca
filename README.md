# paylater.ca — Premium Domain Satış Sitesi

Kanada'nın `.ca` uzantılı **paylater.ca** premium domain'i için tanıtım ve teklif toplama sitesi.

## Teknoloji

- **Next.js 16** — React framework
- **Tailwind CSS 4** — Styling
- **Prisma** — ORM
- **Neon PostgreSQL** — İletişim formu veritabanı
- **Vercel** — Hosting & deployment
- **GitHub** — Kaynak kod yönetimi

## Geliştirme

```bash
npm install
cp .env.example .env.local
# DATABASE_URL değerini Neon panelinden alın
npx prisma db push
npm run dev
```

## Ortam Değişkenleri

| Değişken | Açıklama |
|----------|----------|
| `DATABASE_URL` | Neon PostgreSQL bağlantı dizesi |
| `NEXT_PUBLIC_APP_URL` | Site URL'i (ör. https://paylater.ca) |

## Deployment

1. Neon'da PostgreSQL veritabanı oluşturun
2. Vercel'e projeyi bağlayın
3. `DATABASE_URL` ortam değişkenini ekleyin
4. `npx prisma db push` ile şemayı uygulayın

```bash
vercel --prod
```

## Domain Bağlama

Vercel dashboard → Project → Settings → Domains → `paylater.ca` ekleyin ve DNS kayıtlarını yapılandırın.
