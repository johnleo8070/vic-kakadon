import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

// Public order-tracking endpoint. Looks up an order by its human-friendly
// order number and returns customer-safe status details.
export async function GET(request: Request, { params }: { params: Promise<{ orderNumber: string }> }) {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ success: false, error: "Database not configured" }, { status: 500 });
    }

    const { orderNumber } = await params;
    const normalized = decodeURIComponent(orderNumber).trim().toUpperCase();

    if (!normalized) {
      return NextResponse.json({ success: false, error: "Order number is required" }, { status: 400 });
    }

    const { data: order, error } = await supabase
      .from("orders")
      .select("*")
      .eq("order_number", normalized)
      .single();

    if (error || !order) {
      return NextResponse.json(
        { success: false, error: "Order not found. Please check your order ID and try again." },
        { status: 404 }
      );
    }

    // Mask the customer name for privacy (e.g. "John Doe" -> "J*** D***")
    const maskedName = (order.customer_name || "")
      .split(" ")
      .map((part: string) => (part ? part[0] + "***" : ""))
      .join(" ")
      .trim();

    return NextResponse.json({
      success: true,
      data: {
        orderNumber: order.order_number,
        customerName: maskedName,
        city: order.city,
        state: order.state,
        products: order.products,
        totalAmount: order.total_amount,
        paymentStatus: order.payment_status,
        orderStatus: order.order_status,
        createdAt: order.created_at,
      },
    });
  } catch (error) {
    console.error("Error tracking order:", error);
    return NextResponse.json({ success: false, error: "Failed to track order" }, { status: 500 });
  }
}
