import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import bcrypt from "bcryptjs";
import { isAdmin } from "@/lib/auth";
import { mapAdminFromDb } from "@/lib/utils";

async function listAdminsViaDrizzle() {
  const { db } = await import("@/db");
  const { admins } = await import("@/db/schema");
  const { desc } = await import("drizzle-orm");

  const rows = await db
    .select({
      id: admins.id,
      username: admins.username,
      role: admins.role,
      createdAt: admins.createdAt,
    })
    .from(admins)
    .orderBy(desc(admins.createdAt));

  return rows;
}

async function createAdminViaDrizzle(username: string, password: string, role: string) {
  const { db } = await import("@/db");
  const { admins } = await import("@/db/schema");
  const { eq } = await import("drizzle-orm");

  const existing = await db.select({ id: admins.id }).from(admins).where(eq(admins.username, username)).limit(1);
  if (existing.length > 0) {
    return { error: "An admin with that username already exists", status: 409 as const };
  }

  const hashed = await bcrypt.hash(password, 10);
  const [created] = await db
    .insert(admins)
    .values({ username, password: hashed, role: role || "admin" })
    .returning({
      id: admins.id,
      username: admins.username,
      role: admins.role,
      createdAt: admins.createdAt,
    });

  return { data: created };
}

// GET /api/admin/users - list all admin accounts (auth required)
export async function GET(request: Request) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const supabase = getSupabaseAdmin();

    if (!supabase) {
      const data = await listAdminsViaDrizzle();
      return NextResponse.json({ success: true, data });
    }

    const { data, error } = await supabase
      .from("admins")
      .select("id, username, role, created_at")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: (data ?? []).map((admin) => mapAdminFromDb(admin as Record<string, unknown>)),
    });
  } catch (error) {
    console.error("Error fetching admins:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch admins" }, { status: 500 });
  }
}

// POST /api/admin/users - create a new admin (auth required)
export async function POST(request: Request) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { username, password, role } = body;

    if (!username || !password) {
      return NextResponse.json({ success: false, error: "Username and password are required" }, { status: 400 });
    }
    if (String(password).length < 6) {
      return NextResponse.json({ success: false, error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    if (!supabase) {
      const result = await createAdminViaDrizzle(username, password, role || "admin");
      if ("error" in result) {
        return NextResponse.json({ success: false, error: result.error }, { status: result.status });
      }
      return NextResponse.json({ success: true, data: result.data });
    }

    const { data: existing } = await supabase.from("admins").select("id").eq("username", username).single();
    if (existing) {
      return NextResponse.json({ success: false, error: "An admin with that username already exists" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const { data, error } = await supabase
      .from("admins")
      .insert({ username, password: hashed, role: role || "admin" })
      .select("id, username, role, created_at")
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: mapAdminFromDb(data as Record<string, unknown>),
    });
  } catch (error) {
    console.error("Error creating admin:", error);
    return NextResponse.json({ success: false, error: "Failed to create admin" }, { status: 500 });
  }
}
