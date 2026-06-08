import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import bcrypt from "bcryptjs";
import { isAdmin } from "@/lib/auth";

// GET /api/admin/users - list all admin accounts (auth required)
export async function GET(request: Request) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ success: false, error: "Database not configured" }, { status: 500 });
    }

    const { data, error } = await supabase
      .from("admins")
      .select("id, username, role, created_at")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data: data ?? [] });
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
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ success: false, error: "Database not configured" }, { status: 500 });
    }

    const body = await request.json();
    const { username, password, role } = body;

    if (!username || !password) {
      return NextResponse.json({ success: false, error: "Username and password are required" }, { status: 400 });
    }
    if (String(password).length < 6) {
      return NextResponse.json({ success: false, error: "Password must be at least 6 characters" }, { status: 400 });
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

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error creating admin:", error);
    return NextResponse.json({ success: false, error: "Failed to create admin" }, { status: 500 });
  }
}
