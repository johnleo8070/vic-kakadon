import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ success: false, error: "Database not configured" }, { status: 500 });
    }

    const { slug } = await params;
    const { data: category, error } = await supabase
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !category) {
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 });
    }

    const { data: categoryProducts } = await supabase
      .from("products")
      .select("*")
      .eq("category_id", category.id)
      .order("created_at", { ascending: true });

    const mappedCategory = category ? {
      ...category,
      createdAt: category.created_at,
    } : null;

    return NextResponse.json({ success: true, data: { ...mappedCategory, products: categoryProducts ?? [] } });
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch category" }, { status: 500 });
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
    const { name, description, image } = body;

    const { data, error } = await supabase
      .from("categories")
      .update({ name, description, image })
      .eq("slug", slug)
      .select()
      .single();

    if (error || !data) {
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 });
    }

    const mappedData = data ? {
      ...data,
      createdAt: data.created_at,
    } : null;

    return NextResponse.json({ success: true, data: mappedData });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json({ success: false, error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ success: false, error: "Database not configured" }, { status: 500 });
    }

    const { slug } = await params;
    const { error } = await supabase.from("categories").delete().eq("slug", slug);

    if (error) {
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Category deleted" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json({ success: false, error: "Failed to delete category" }, { status: 500 });
  }
}
