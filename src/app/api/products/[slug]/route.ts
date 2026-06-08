import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ success: false, error: "Database not configured" }, { status: 500 });
    }

    const { slug } = await params;
    const { data, error } = await supabase.from("products").select("*").eq("slug", slug).single();

    if (error || !data) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    const mappedData = data ? {
      ...data,
      categoryId: data.category_id,
      stockQuantity: data.stock_quantity,
      availablePieces: data.available_pieces,
      isAvailable: data.is_available,
      isFeatured: data.is_featured,
      isNew: data.is_new,
      createdAt: data.created_at,
    } : null;

    return NextResponse.json({ success: true, data: mappedData });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ success: false, error: "Database not configured" }, { status: 500 });
    }

    const { slug } = await params;
    const body = await request.json();
    const { name, description, price, categoryId, images, sizes, colors, stockQuantity, availablePieces, isAvailable, isFeatured, isNew } = body;

    const { data, error } = await supabase
      .from("products")
      .update({
        name,
        description,
        price: price?.toString(),
        category_id: categoryId,
        images,
        sizes,
        colors,
        stock_quantity: stockQuantity,
        available_pieces: availablePieces,
        is_available: isAvailable,
        is_featured: isFeatured,
        is_new: isNew,
      })
      .eq("slug", slug)
      .select()
      .single();

    if (error || !data) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    const mappedData = data ? {
      ...data,
      categoryId: data.category_id,
      stockQuantity: data.stock_quantity,
      availablePieces: data.available_pieces,
      isAvailable: data.is_available,
      isFeatured: data.is_featured,
      isNew: data.is_new,
      createdAt: data.created_at,
    } : null;

    return NextResponse.json({ success: true, data: mappedData });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ success: false, error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ success: false, error: "Database not configured" }, { status: 500 });
    }

    const { slug } = await params;
    const { error } = await supabase.from("products").delete().eq("slug", slug);

    if (error) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ success: false, error: "Failed to delete product" }, { status: 500 });
  }
}
