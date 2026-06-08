import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

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

    const mappedData = data ? {
      ...data,
      orderNumber: data.order_number,
      customerName: data.customer_name,
      totalAmount: data.total_amount,
      paymentScreenshot: data.payment_screenshot,
      paymentStatus: data.payment_status,
      orderStatus: data.order_status,
      createdAt: data.created_at,
    } : null;

    return NextResponse.json({ success: true, data: mappedData });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json({ success: false, error: "Failed to update order" }, { status: 500 });
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

    const mappedData = data ? {
      ...data,
      orderNumber: data.order_number,
      customerName: data.customer_name,
      totalAmount: data.total_amount,
      paymentScreenshot: data.payment_screenshot,
      paymentStatus: data.payment_status,
      orderStatus: data.order_status,
      createdAt: data.created_at,
    } : null;

    return NextResponse.json({ success: true, data: mappedData });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch order" }, { status: 500 });
  }
}
