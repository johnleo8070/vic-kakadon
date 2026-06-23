import type { Metadata } from "next";
import { getSupabaseAdmin } from "@/lib/supabase";

interface ProductLayoutProps {
  children: React.ReactNode;
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ProductLayoutProps): Promise<Metadata> {
  const slug = params.slug;
  const supabase = getSupabaseAdmin();
  
  let product = null;
  if (supabase) {
    try {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single();
      product = data;
    } catch (error) {
      console.error('Error fetching product for metadata:', error);
    }
  }

  if (!product) {
    return {
      title: "Product Not Found | K D K Collections Wear",
      description: "The product you are looking for is not available.",
    };
  }

  const imageUrl = product.images?.[0] || "/images/logo.png";
  const baseUrl = "https://vic-kakadon.com.ng";

  return {
    title: `${product.name} | K D K Collections Wear`,
    description: product.description || `Shop ${product.name} at K D K Collections Wear. Premium quality fashion and accessories.`,
    keywords: `${product.name}, ${product.category_name || "fashion"}, ${product.category_name || "accessories"}, Nigeria, online shopping, K D K Collections`,
    openGraph: {
      title: `${product.name} | K D K Collections Wear`,
      description: product.description || `Shop ${product.name} at K D K Collections Wear.`,
      url: `${baseUrl}/products/${product.slug}`,
      siteName: "K D K Collections Wear",
      images: [
        {
          url: imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl}`,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
      locale: "en_NG",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | K D K Collections Wear`,
      description: product.description || `Shop ${product.name} at K D K Collections Wear.`,
      images: [imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl}`],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function ProductLayout({ children }: ProductLayoutProps) {
  return <>{children}</>;
}
