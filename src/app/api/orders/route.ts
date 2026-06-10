import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { generateOrderNumber } from "@/lib/utils";
import { sendOrderConfirmationEmail, OrderEmailData } from "@/lib/email";

export async function GET(request: Request) {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ success: false, error: "Database not configured" }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const paymentStatus = searchParams.get("paymentStatus");
    const orderStatus = searchParams.get("orderStatus");
    const search = searchParams.get("search");

    let query = supabase.from("orders").select("*").order("created_at", { ascending: false });

    if (paymentStatus) query = query.eq("payment_status", paymentStatus);
    if (orderStatus) query = query.eq("order_status", orderStatus);
    if (search) query = query.ilike("customer_name", `%${search}%`);

    const { data, error } = await query;
    if (error) throw error;

    const mappedData = (data ?? []).map((order: any) => ({
      ...order,
      orderNumber: order.order_number,
      customerName: order.customer_name,
      totalAmount: order.total_amount,
      paymentScreenshot: order.payment_screenshot,
      paymentStatus: order.payment_status,
      orderStatus: order.order_status,
      createdAt: order.created_at,
    }));

    return NextResponse.json({ success: true, data: mappedData });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ success: false, error: "Database not configured" }, { status: 500 });
    }

    const body = await request.json();
    const { customerName, email, phone, address, city, state, products: orderProducts, totalAmount, paymentScreenshot, notes } = body;

    if (!customerName || !email || !phone || !address || !city || !orderProducts || !totalAmount) {
      return NextResponse.json({ success: false, error: "All required fields must be provided" }, { status: 400 });
    }

    // Generate unique order number
    let orderNumber = generateOrderNumber();
    for (let attempt = 0; attempt < 5; attempt++) {
      const { data: existing } = await supabase
        .from("orders")
        .select("id")
        .eq("order_number", orderNumber)
        .limit(1);
      if (!existing || existing.length === 0) break;
      orderNumber = generateOrderNumber();
    }

    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_name: customerName,
        email,
        phone,
        address,
        city,
        state: state || "",
        products: orderProducts,
        total_amount: totalAmount.toString(),
        payment_screenshot: paymentScreenshot || "",
        payment_status: "pending",
        order_status: "processing",
        notes: notes || "",
      })
      .select()
      .single();

    if (error) throw error;

    // Send automatic order confirmation email
    try {
      const emailData: OrderEmailData = {
        orderNumber: order.order_number,
        customerName: order.customer_name,
        customerEmail: order.email,
        totalAmount: order.total_amount,
        products: order.products || [],
        address: order.address,
        city: order.city,
        state: order.state,
        phone: order.phone,
        trackingNumber: order.tracking_number || "",
        paymentStatus: order.payment_status,
        orderStatus: order.order_status,
      };
      await sendOrderConfirmationEmail(emailData);
    } catch (emailError) {
      console.error("Error sending order confirmation email:", emailError);
      // Don't fail the order creation if email fails
    }

    // Decrement stock for each ordered product
    for (const item of orderProducts) {
      if (item.productId) {
        const { data: prod } = await supabase
          .from("products")
          .select("stock_quantity, available_pieces")
          .eq("id", item.productId)
          .single();
        if (prod) {
          await supabase
            .from("products")
            .update({
              stock_quantity: Math.max(0, (prod.stock_quantity || 0) - item.quantity),
              available_pieces: Math.max(0, (prod.available_pieces || 0) - item.quantity),
            })
            .eq("id", item.productId);
        }
      }
    }

    const mappedOrder = order ? {
      ...order,
      orderNumber: order.order_number,
      customerName: order.customer_name,
      totalAmount: order.total_amount,
      paymentScreenshot: order.payment_screenshot,
      paymentStatus: order.payment_status,
      orderStatus: order.order_status,
      createdAt: order.created_at,
    } : null;

    return NextResponse.json({ success: true, data: mappedOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 500 });
  }
}
