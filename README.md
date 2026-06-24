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

## Canlı Adresler

| Platform | URL |
|----------|-----|
| Vercel (geçici) | https://paylater-ca.vercel.app |
| Domain (DNS ayarı sonrası) | https://paylater.ca |
| GitHub | https://github.com/Fuingil/paylater-ca |
| Vercel Dashboard | https://vercel.com/fuingil-s-projects/paylater-ca |

## DNS Ayarları

Domain şu an Sedo parking üzerinde. Vercel'e yönlendirmek için:

**Seçenek A (önerilen):** DNS kayıtları:
- `A` → `paylater.ca` → `76.76.21.21`
- `A` → `www.paylater.ca` → `76.76.21.21`

**Seçenek B:** Nameserver'ları değiştirin:
- `ns1.vercel-dns.com`
- `ns2.vercel-dns.com`

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
