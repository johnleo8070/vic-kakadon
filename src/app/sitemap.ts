import { MetadataRoute } from 'next';
import { getSupabaseAdmin } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://vic-kakadon.com.ng';
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  // Dynamic product pages
  const supabase = getSupabaseAdmin();
  const productPages: MetadataRoute.Sitemap = [];

  if (supabase) {
    try {
      const { data: products } = await supabase
        .from('products')
        .select('slug, updated_at')
        .eq('is_available', true);

      if (products) {
        for (const product of products) {
          productPages.push({
            url: `${baseUrl}/products/${product.slug}`,
            lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching products for sitemap:', error);
    }
  }

  return [...staticPages, ...productPages];
}
