import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import bcrypt from "bcryptjs";
import { isAdmin } from "@/lib/auth";

// PUT /api/admin/users/:id - update an admin's password and/or role
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ success: false, error: "Database not configured" }, { status: 500 });
    }

    const { id } = await params;
    const body = await request.json();
    const { password, role } = body;

    const updateData: Record<string, unknown> = {};
    if (password) {
      if (String(password).length < 6) {
        return NextResponse.json({ success: false, error: "Password must be at least 6 characters" }, { status: 400 });
      }
      updateData.password = await bcrypt.hash(password, 10);
    }
    if (role !== undefined) updateData.role = role;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ success: false, error: "Nothing to update" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("admins")
      .update(updateData)
      .eq("id", parseInt(id))
      .select("id, username, role")
      .single();

    if (error || !data) {
      return NextResponse.json({ success: false, error: "Admin not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error updating admin:", error);
    return NextResponse.json({ success: false, error: "Failed to update admin" }, { status: 500 });
  }
}

// DELETE /api/admin/users/:id - delete an admin (cannot delete the last one)
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ success: false, error: "Database not configured" }, { status: 500 });
    }

    const { id } = await params;

    // Prevent deleting the last remaining admin
    const { count } = await supabase.from("admins").select("*", { count: "exact", head: true });
    if ((count ?? 0) <= 1) {
      return NextResponse.json({ success: false, error: "Cannot delete the last admin account" }, { status: 400 });
    }

    const { error } = await supabase.from("admins").delete().eq("id", parseInt(id));

    if (error) {
      return NextResponse.json({ success: false, error: "Admin not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Admin deleted" });
  } catch (error) {
    console.error("Error deleting admin:", error);
    return NextResponse.json({ success: false, error: "Failed to delete admin" }, { status: 500 });
  }
}
