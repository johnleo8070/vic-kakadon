import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createToken } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "Username and password are required" },
        { status: 400 }
      );
    }

    // Use Supabase JS client (service-role) — bypasses direct pg connection entirely.
    const supabase = getSupabaseAdmin();

    if (!supabase) {
      // Fallback: direct pg / Drizzle path
      const { db } = await import("@/db");
      const { admins } = await import("@/db/schema");
      const { eq } = await import("drizzle-orm");

      const adminResult = await db
        .select()
        .from(admins)
        .where(eq(admins.username, username))
        .limit(1);

      if (adminResult.length === 0) {
        return NextResponse.json(
          { success: false, error: "Invalid credentials" },
          { status: 401 }
        );
      }

      const admin = adminResult[0];
      const isValid = await bcrypt.compare(password, admin.password);
      if (!isValid) {
        return NextResponse.json(
          { success: false, error: "Invalid credentials" },
          { status: 401 }
        );
      }

      const token = await createToken({
        id: admin.id,
        username: admin.username,
        role: admin.role || "admin",
      });
      const response = NextResponse.json({
        success: true,
        data: { id: admin.id, username: admin.username, role: admin.role },
        token,
      });
      response.cookies.set("admin_token", token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
        path: "/",
      });
      return response;
    }

    // Primary path: query via Supabase REST API (no direct pg connection needed)
    const { data, error } = await supabase
      .from("admins")
      .select("id, username, password, role")
      .eq("username", username)
      .limit(1)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, data.password);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = await createToken({
      id: data.id,
      username: data.username,
      role: data.role || "admin",
    });

    const response = NextResponse.json({
      success: true,
      data: { id: data.id, username: data.username, role: data.role },
      token,
    });
    response.cookies.set("admin_token", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error logging in:", error);
    return NextResponse.json(
      { success: false, error: "Login failed" },
      { status: 500 }
    );
  }
}
