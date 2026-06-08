import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Supabase configuration.
// Set these in your environment (.env):
//   NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
//   NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>            (browser-safe)
//   SUPABASE_SERVICE_ROLE_KEY=<service role key>        (server-only, secret)
//
// The service-role client is used on the server for privileged operations such
// as uploading files to Supabase Storage. The anon client can be used in the
// browser for read-only/public operations.

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// Name of the Storage bucket used for product images & payment screenshots.
// Be tolerant of a misconfigured value: if a full public URL was provided
// (e.g. ".../storage/v1/object/public/uploads"), extract the bucket name.
function resolveBucketName(raw: string | undefined): string {
  if (!raw) return "uploads";
  const trimmed = raw.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    const match = trimmed.match(/\/storage\/v1\/object\/(?:public\/)?([^/?#]+)/i);
    if (match && match[1]) return match[1];
    // Fallback: last non-empty path segment
    const parts = trimmed.replace(/[?#].*$/, "").split("/").filter(Boolean);
    return parts[parts.length - 1] || "uploads";
  }
  return trimmed;
}

export const STORAGE_BUCKET = resolveBucketName(process.env.SUPABASE_STORAGE_BUCKET);

/** Returns true when Supabase Storage credentials are available on the server. */
export function isSupabaseStorageConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);
}

/** Returns true when public Supabase credentials are available. */
export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

let adminClient: SupabaseClient | null = null;

/**
 * Server-side Supabase client using the service-role key.
 * Bypasses Row Level Security — never expose this to the browser.
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (!isSupabaseStorageConfigured()) return null;
  if (!adminClient) {
    adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return adminClient;
}

let publicClient: SupabaseClient | null = null;

/** Public (anon) Supabase client — safe for read-only/public usage. */
export function getSupabasePublic(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (!publicClient) {
    publicClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false },
    });
  }
  return publicClient;
}
