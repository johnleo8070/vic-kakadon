import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ success: false, error: "Database not configured" }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const categorySlug = searchParams.get("category");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const featured = searchParams.get("featured");
    const isNew = searchParams.get("new");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const sortBy = searchParams.get("sortBy") || "newest";

    let query = supabase.from("products").select("*");

    if (search) query = query.ilike("name", `%${search}%`);
    if (featured === "true") query = query.eq("is_featured", true);
    if (isNew === "true") query = query.eq("is_new", true);
    if (minPrice) query = query.gte("price", minPrice);
    if (maxPrice) query = query.lte("price", maxPrice);

    if (categorySlug) {
      const { data: cat } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", categorySlug)
        .single();
      if (cat) query = query.eq("category_id", cat.id);
    }

    if (sortBy === "price-asc") query = query.order("price", { ascending: true });
    else if (sortBy === "price-desc") query = query.order("price", { ascending: false });
    else if (sortBy === "name-asc") query = query.order("name", { ascending: true });
    else query = query.order("created_at", { ascending: false });

    const { data: allData, error } = await query;
    if (error) throw error;

    const totalCount = (allData || []).length;
    const paginated = (allData || []).slice((page - 1) * limit, page * limit);

    const mappedData = paginated.map((p: any) => ({
      ...p,
      categoryId: p.category_id,
      stockQuantity: p.stock_quantity,
      availablePieces: p.available_pieces,
      isAvailable: p.is_available,
      isFeatured: p.is_featured,
      isNew: p.is_new,
      createdAt: p.created_at,
    }));

    return NextResponse.json({
      success: true,
      data: mappedData,
      pagination: { page, limit, total: totalCount, totalPages: Math.ceil(totalCount / limit) },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ success: false, error: "Database not configured" }, { status: 500 });
    }

    const body = await request.json();
    const { name, slug, description, price, categoryId, images, sizes, colors, stockQuantity, availablePieces, isAvailable, isFeatured, isNew } = body;

    if (!name || !slug || !price) {
      return NextResponse.json({ success: false, error: "Name, slug, and price are required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("products")
      .insert({
        name,
        slug,
        description: description || "",
        price: price.toString(),
        category_id: categoryId || null,
        images: images || [],
        sizes: sizes || [],
        colors: colors || [],
        stock_quantity: stockQuantity || 0,
        available_pieces: availablePieces || 0,
        is_available: isAvailable !== undefined ? isAvailable : true,
        is_featured: isFeatured || false,
        is_new: isNew || false,
      })
      .select()
      .single();

    if (error) throw error;

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
    console.error("Error creating product:", error);
    return NextResponse.json({ success: false, error: "Failed to create product" }, { status: 500 });
  }
}
