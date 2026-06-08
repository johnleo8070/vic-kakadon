# Switching Kakadon Store to Supabase

Kakadon Store now runs on **Supabase** for both the database (PostgreSQL) and
file storage (Supabase Storage). Drizzle ORM is used for type-safe queries —
this is Supabase's officially recommended pattern.

In development/sandbox (no Supabase keys), the app automatically falls back to a
local PostgreSQL database and local filesystem uploads, so nothing breaks while
you set things up.

---

## 1. Create a Supabase project

1. Go to <https://supabase.com> → **New project**.
2. Note your project **Reference ID** and **database password**.

## 2. Point the database at Supabase

In **Project Settings → Database → Connection string**, copy the
**Connection pooling (Transaction)** URI and set it as `DATABASE_URL`:

```
DATABASE_URL=postgresql://postgres.<ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres
```

SSL is enabled automatically for non-localhost hosts.

## 3. Create the tables

Apply the Drizzle schema directly to Supabase:

```bash
npx drizzle-kit push
```

(Update `drizzle.config.json`'s `dbCredentials.url` to your Supabase URL, or set
the `DATABASE_URL` env var which drizzle-kit also reads.)

Alternatively run the SQL in **`supabase/schema.sql`** from the Supabase SQL
editor.

## 4. Configure Supabase Storage

1. In the dashboard go to **Storage → Create bucket**.
2. Name it **`uploads`** and mark it **Public** (so product images and payment
   screenshots are viewable).
3. (Optional) Add policies if you prefer signed URLs.

## 5. Add the environment variables

From **Project Settings → API**:

```
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon public key>
SUPABASE_SERVICE_ROLE_KEY=<service role secret key>
SUPABASE_STORAGE_BUCKET=uploads
```

The **service role key** is secret and only used server-side (in
`/api/upload`). Never expose it to the browser.

## 6. Seed the database

Hit the seed endpoint (or use Admin → Settings → "Seed Database"):

```bash
curl -X POST https://your-app/api/admin/seed
```

Default admin: **admin@kakadon.com / admin123**

---

## How storage works

- `POST /api/upload` uploads to the Supabase Storage `uploads` bucket when
  credentials are present, returning the public URL
  (`https://<ref>.supabase.co/storage/v1/object/public/uploads/...`).
- Without credentials it saves to the local `uploads/` folder and serves files
  through `/api/files/...`.
- `next.config.ts` whitelists `*.supabase.co` so `next/image` can render the
  hosted images.

## Health check

`GET /api/health` reports:

```json
{ "status": "ok", "database": "connected", "storage": "supabase" }
```
