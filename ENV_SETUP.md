# Sarkari Yojana - Environment & Deployment Guide

## Environment Variables
To deploy this platform to production (e.g., Vercel, Cloudflare Pages), you must configure the following environment variables:

- `DATABASE_URL` (Required): The connection string to your Neon Serverless PostgreSQL database. Must support pooled connections (e.g., `postgresql://user:pass@ep-host.neon.tech/neondb?sslmode=require`).
- `NODE_ENV` (Optional): Set to `production` in live environments to ensure admin cookies are marked as `Secure` (HTTPS only).

## Database Migrations
Before the CMS can be used on a fresh database, ensure you have run the drizzle migrations:
```bash
npx drizzle-kit generate
npx drizzle-kit push
```
Then, seed the admin user:
```bash
npx tsx seed_admin.ts
```

## Security Posture
- All `/admin/*` routes are protected by server-side session checks.
- All `/admin/api/*` endpoints strictly validate session cookies before performing any operations.
- Next.js edge-compatible Crypto (WebCrypto API) is used for password hashing and UUID generation.
- Unverified `DRAFT` or `FACT_CHECK` schemes are rigorously blocked from public routing via `app/yojna/[slug]/page.tsx` and `isIndexableScheme()` filters.
- Image uploads are restricted strictly to `image/*` MIME types.
