import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { isAdmin } from "@/lib/auth";
import { mapOrderFromDb } from "@/lib/utils";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ success: false, error: "Database not configured" }, { status: 500 });
    }

    const { id } = await params;
    const body = await request.json();
    const { paymentStatus, orderStatus, notes } = body;

    const updateData: Record<string, unknown> = {};
    if (paymentStatus !== undefined) updateData.payment_status = paymentStatus;
    if (orderStatus !== undefined) updateData.order_status = orderStatus;
    if (notes !== undefined) updateData.notes = notes;

    const { data, error } = await supabase
      .from("orders")
      .update(updateData)
      .eq("id", parseInt(id))
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    const mappedData = data ? mapOrderFromDb(data as Record<string, unknown>) : null;

    return NextResponse.json({ success: true, data: mappedData });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json({ success: false, error: "Failed to update order" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const orderId = parseInt(id);
    if (Number.isNaN(orderId)) {
      return NextResponse.json({ success: false, error: "Invalid order ID" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    if (!supabase) {
      const { db } = await import("@/db");
      const { orders } = await import("@/db/schema");
      const { eq } = await import("drizzle-orm");

      const [deleted] = await db.delete(orders).where(eq(orders.id, orderId)).returning({ id: orders.id });
      if (!deleted) {
        return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
      }

      return NextResponse.json({ success: true, message: "Order deleted" });
    }

    const { error } = await supabase.from("orders").delete().eq("id", orderId);

    if (error) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Order deleted" });
  } catch (error) {
    console.error("Error deleting order:", error);
    return NextResponse.json({ success: false, error: "Failed to delete order" }, { status: 500 });
  }
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ success: false, error: "Database not configured" }, { status: 500 });
    }

    const { id } = await params;

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", parseInt(id))
      .single();

    if (error || !data) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    const mappedData = data ? mapOrderFromDb(data as Record<string, unknown>) : null;

    return NextResponse.json({ success: true, data: mappedData });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch order" }, { status: 500 });
  }
}
