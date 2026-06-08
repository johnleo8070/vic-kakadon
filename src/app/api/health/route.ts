import { NextResponse } from "next/server";
import { pool } from "@/db";
import { isSupabaseStorageConfigured } from "@/lib/supabase";

export async function GET() {
  let dbOk = false;
  try {
    await pool.query("SELECT 1");
    dbOk = true;
  } catch (e) {
    console.error("Health DB check failed:", e);
  }

  return NextResponse.json({
    status: dbOk ? "ok" : "degraded",
    message: "Kakadon Store API is running",
    database: dbOk ? "connected" : "error",
    storage: isSupabaseStorageConfigured() ? "supabase" : "local",
    timestamp: new Date().toISOString(),
  });
}
