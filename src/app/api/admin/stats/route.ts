import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ success: false, error: "Database not configured" }, { status: 500 });
    }

    const [
      { count: totalOrders },
      { count: totalProducts },
      { count: totalCategories },
      { count: pendingOrders },
      { data: revenueData },
      { data: recentOrders },
    ] = await Promise.all([
      supabase.from("orders").select("*", { count: "exact", head: true }),
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase.from("categories").select("*", { count: "exact", head: true }),
      supabase.from("orders").select("*", { count: "exact", head: true }).eq("payment_status", "pending"),
      supabase.from("orders").select("total_amount").eq("payment_status", "confirmed"),
      supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(10),
    ]);

    const totalRevenue = (revenueData || []).reduce(
      (sum: number, row: { total_amount: string | null }) => sum + parseFloat(row.total_amount || "0"),
      0
    );

    return NextResponse.json({
      success: true,
      data: {
        totalOrders: totalOrders ?? 0,
        totalProducts: totalProducts ?? 0,
        totalCategories: totalCategories ?? 0,
        totalRevenue,
        pendingOrders: pendingOrders ?? 0,
        recentOrders: recentOrders ?? [],
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch stats" }, { status: 500 });
  }
}
