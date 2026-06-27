import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const supabase = getSupabaseAdmin();
  
  if (!supabase) {
    return new NextResponse('Database connection error', { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format') || 'xml';

  try {
    // Fetch all available products with category info
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        slug,
        description,
        price,
        images,
        stock_quantity,
        is_available,
        categories (
          name
        )
      `)
      .eq('is_available', true);

    if (error) {
      console.error('Error fetching products for catalog:', error);
      return new NextResponse('Error fetching products', { status: 500 });
    }

    const baseUrl = 'https://vic-kakadon.com.ng';
    const brand = 'K D K Collections Wear';

    if (format === 'json') {
      // JSON format
      const catalog = {
        catalog: products?.map((product: any) => ({
          id: product.id.toString(),
          title: product.name,
          description: product.description || '',
          image_link: product.images?.[0] ? (product.images[0].startsWith('http') ? product.images[0] : `${baseUrl}${product.images[0]}`) : `${baseUrl}/images/logo.png`,
          link: `${baseUrl}/products/${product.slug}`,
          availability: (product.stock_quantity || 0) > 0 ? 'in stock' : 'out of stock',
          price: {
            amount: parseFloat(product.price),
            currency: 'NGN',
          },
          brand: brand,
          condition: 'new',
        })) || [],
      };

      return NextResponse.json(catalog, {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        },
      });
    }

    // XML format (default)
    const xmlItems = products?.map((product: any) => {
      const imageUrl = product.images?.[0] 
        ? (product.images[0].startsWith('http') ? product.images[0] : `${baseUrl}${product.images[0]}`) 
        : `${baseUrl}/images/logo.png`;
      
      return `
    <item>
      <g:id>${product.id}</g:id>
      <g:title>${escapeXml(product.name)}</g:title>
      <g:description>${escapeXml(product.description || '')}</g:description>
      <g:link>${baseUrl}/products/${product.slug}</g:link>
      <g:image_link>${escapeXml(imageUrl)}</g:image_link>
      <g:availability>${(product.stock_quantity || 0) > 0 ? 'in stock' : 'out of stock'}</g:availability>
      <g:price>${parseFloat(product.price).toFixed(2)} NGN</g:price>
      <g:brand>${escapeXml(brand)}</g:brand>
      <g:condition>new</g:condition>
      <g:product_type>${escapeXml(product.categories?.name || 'Fashion & Accessories')}</g:product_type>
    </item>`;
    }).join('') || '';

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>K D K Collections Wear Product Catalog</title>
    <link>${baseUrl}</link>
    <description>Product catalog for K D K Collections Wear</description>${xmlItems}
  </channel>
</rss>`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });

  } catch (error) {
    console.error('Error generating catalog feed:', error);
    return new NextResponse('Error generating catalog', { status: 500 });
  }
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
