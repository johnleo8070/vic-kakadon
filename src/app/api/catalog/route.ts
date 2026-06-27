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
    const xmlItems = products?.map((product: any, index: number) => {
      try {
        const imageUrl = product.images?.[0] 
          ? (product.images[0].startsWith('http') ? product.images[0] : `${baseUrl}${product.images[0]}`) 
          : `${baseUrl}/images/logo.png`;
        
        // Simple XML escaping for all fields
        const safeName = escapeXml(product.name || '');
        const safeDescription = escapeXml(product.description || '');
        const safeBrand = escapeXml(brand);
        const safeCategory = escapeXml(product.categories?.name || 'Fashion & Accessories');
        const safeSlug = escapeXml(product.slug || '');
        const safeImageUrl = escapeXml(imageUrl);
        
        // Validate price is a number
        const price = parseFloat(product.price);
        if (isNaN(price)) {
          console.error(`Invalid price for product ${product.id}: ${product.price}`);
          return '';
        }
        
        return `
    <item>
      <g:id>${product.id}</g:id>
      <g:title>${safeName}</g:title>
      <g:description>${safeDescription}</g:description>
      <g:link>${escapeXml(baseUrl + '/products/' + product.slug)}</g:link>
      <g:image_link>${safeImageUrl}</g:image_link>
      <g:availability>${(product.stock_quantity || 0) > 0 ? 'in stock' : 'out of stock'}</g:availability>
      <g:price>${price.toFixed(2)} NGN</g:price>
      <g:brand>${safeBrand}</g:brand>
      <g:condition>new</g:condition>
      <g:product_type>${safeCategory}</g:product_type>
    </item>`;
      } catch (error) {
        console.error(`Error processing product ${product.id} at index ${index}:`, error);
        return '';
      }
    }).join('') || '';

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>${escapeXml('K D K Collections Wear Product Catalog')}</title>
    <link>${escapeXml(baseUrl)}</link>
    <description>${escapeXml('Product catalog for K D K Collections Wear')}</description>${xmlItems}
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

function sanitizeText(str: string): string {
  if (!str) return '';
  
  // Convert to string if not already
  str = String(str);
  
  // Remove ALL control characters
  str = str.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
  
  // Remove Unicode surrogate pairs and non-characters
  str = str.replace(/[\uD800-\uDFFF]/g, '');
  str = str.replace(/[\uFFFE\uFFFF]/g, '');
  
  // Remove any other problematic characters
  str = str.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '');
  
  // Escape CDATA end marker to prevent injection
  str = str.replace(/]]>/g, ']]]]><![CDATA[>');
  
  return str;
}

function cdataEscape(str: string): string {
  if (!str) return '';
  str = String(str);
  // Escape CDATA end marker to prevent injection
  str = str.replace(/]]>/g, ']]]]><![CDATA[>');
  return `<![CDATA[${str}]]>`;
}

function escapeXml(str: string): string {
  if (!str) return '';
  
  // Convert to string if not already
  str = String(str);
  
  // Remove only the characters that are definitively invalid in XML 1.0
  // These are: 0x00-0x08, 0x0B, 0x0C, 0x0E-0x1F, 0x7F, 0xFFFE, 0xFFFF
  str = str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  str = str.replace(/[\uFFFE\uFFFF]/g, '');
  
  // Escape XML special characters (do this LAST)
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
