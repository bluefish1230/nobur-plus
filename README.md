# Nobur Plus

Next.js + Vercel + Supabase rewrite of the original PHP site.

## Stack

- Next.js App Router
- Vercel deployment
- Supabase Postgres
- Supabase Storage

## Local setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. Create a public storage bucket named `article-images`.
4. Copy `.env.example` to `.env.local` and fill the values.
5. Install dependencies and start Next.js:

```bash
npm install
npm run dev
```

Default admin after running the schema:

```text
admin / 671230
```

Change the password immediately after deployment.

## Vercel environment variables

```text
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_STORAGE_BUCKET
ADMIN_SESSION_SECRET
```
