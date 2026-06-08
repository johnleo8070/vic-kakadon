import { db } from "@/db";
import { categories, products, admins, settings } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function seedDatabase() {
  try {
    // Check if already seeded
    const existingCategories = await db.select().from(categories);
    if (existingCategories.length > 0) {
      return { message: "Database already seeded" };
    }

    // Create default admin
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await db.insert(admins).values({
      username: "admin@kakadon.com",
      password: hashedPassword,
      role: "admin",
    });

    // Create categories
    const categorySlugs = ["watches", "caps", "shirts", "trousers", "shoes", "accessories"];
    const categoryNames = ["Watches", "Caps", "Shirts", "Trousers", "Shoes", "Accessories"];
    const categoryDescriptions = [
      "Premium timepieces for every occasion",
      "Stylish caps and hats for all seasons",
      "Fashion-forward shirts for men and women",
      "Comfortable and trendy trousers",
      "Quality footwear for every style",
      "Fashion accessories to complete your look",
    ];

    const insertedCategories = await db
      .insert(categories)
      .values(
        categoryNames.map((name, i) => ({
          name,
          slug: categorySlugs[i],
          description: categoryDescriptions[i],
          image: `/images/categories/${categorySlugs[i]}.jpg`,
        }))
      )
      .returning();

    // Create sample products
    const sampleProducts = [
      // Watches
      { name: "Royal Gold Watch", slug: "royal-gold-watch", description: "Elegant gold-plated wrist watch with leather strap. Perfect for formal occasions.", price: "149.99", categoryId: insertedCategories[0].id, images: ["/images/products/watch1.jpg"], sizes: [], colors: ["Gold", "Silver"], stockQuantity: 25, availablePieces: 25, isAvailable: true, isFeatured: true, isNew: true },
      { name: "Classic Silver Watch", slug: "classic-silver-watch", description: "Timeless silver chronograph with stainless steel band.", price: "199.99", categoryId: insertedCategories[0].id, images: ["/images/products/watch2.jpg"], sizes: [], colors: ["Silver", "Black"], stockQuantity: 30, availablePieces: 30, isAvailable: true, isFeatured: true, isNew: false },
      { name: "Sport Digital Watch", slug: "sport-digital-watch", description: "Water-resistant digital watch with multiple sport modes.", price: "89.99", categoryId: insertedCategories[0].id, images: ["/images/products/watch3.jpg"], sizes: [], colors: ["Black", "Blue"], stockQuantity: 50, availablePieces: 50, isAvailable: true, isFeatured: false, isNew: true },
      { name: "Leather Band Watch", slug: "leather-band-watch", description: "Vintage style watch with genuine leather strap.", price: "129.99", categoryId: insertedCategories[0].id, images: ["/images/products/watch4.jpg"], sizes: [], colors: ["Brown", "Black"], stockQuantity: 20, availablePieces: 20, isAvailable: true, isFeatured: false, isNew: false },

      // Caps
      { name: "Classic Baseball Cap", slug: "classic-baseball-cap", description: "Adjustable cotton baseball cap with embroidered logo.", price: "29.99", categoryId: insertedCategories[1].id, images: ["/images/products/cap1.jpg"], sizes: ["S/M", "L/XL"], colors: ["Black", "Navy", "White"], stockQuantity: 100, availablePieces: 100, isAvailable: true, isFeatured: true, isNew: true },
      { name: "Snapback Premium", slug: "snapback-premium", description: "Flat brim snapback with premium stitching.", price: "39.99", categoryId: insertedCategories[1].id, images: ["/images/products/cap2.jpg"], sizes: ["One Size"], colors: ["Black", "Red", "Green"], stockQuantity: 75, availablePieces: 75, isAvailable: true, isFeatured: true, isNew: false },
      { name: "Beanie Winter Cap", slug: "beanie-winter-cap", description: "Warm knitted beanie for cold weather.", price: "24.99", categoryId: insertedCategories[1].id, images: ["/images/products/cap3.jpg"], sizes: ["One Size"], colors: ["Gray", "Black", "Navy"], stockQuantity: 60, availablePieces: 60, isAvailable: true, isFeatured: false, isNew: true },
      { name: "Bucket Hat", slug: "bucket-hat", description: "Trendy bucket hat for summer style.", price: "34.99", categoryId: insertedCategories[1].id, images: ["/images/products/cap4.jpg"], sizes: ["S/M", "L/XL"], colors: ["Khaki", "Black"], stockQuantity: 40, availablePieces: 40, isAvailable: true, isFeatured: false, isNew: false },

      // Shirts
      { name: "Slim Fit Oxford", slug: "slim-fit-oxford", description: "Classic Oxford shirt in slim fit. Perfect for office and casual wear.", price: "59.99", categoryId: insertedCategories[2].id, images: ["/images/products/shirt1.jpg"], sizes: ["S", "M", "L", "XL", "XXL"], colors: ["White", "Blue", "Pink"], stockQuantity: 80, availablePieces: 80, isAvailable: true, isFeatured: true, isNew: true },
      { name: "Casual Linen Shirt", slug: "casual-linen-shirt", description: "Breathable linen shirt for summer comfort.", price: "49.99", categoryId: insertedCategories[2].id, images: ["/images/products/shirt2.jpg"], sizes: ["S", "M", "L", "XL"], colors: ["White", "Beige", "Light Blue"], stockQuantity: 60, availablePieces: 60, isAvailable: true, isFeatured: true, isNew: false },
      { name: "Printed Hawaiian Shirt", slug: "printed-hawaiian-shirt", description: "Vibrant tropical print shirt for vacation vibes.", price: "44.99", categoryId: insertedCategories[2].id, images: ["/images/products/shirt3.jpg"], sizes: ["M", "L", "XL"], colors: ["Tropical", "Ocean"], stockQuantity: 45, availablePieces: 45, isAvailable: true, isFeatured: false, isNew: true },
      { name: "Denim Western Shirt", slug: "denim-western-shirt", description: "Classic denim shirt with western details.", price: "69.99", categoryId: insertedCategories[2].id, images: ["/images/products/shirt4.jpg"], sizes: ["S", "M", "L", "XL", "XXL"], colors: ["Light Denim", "Dark Denim"], stockQuantity: 55, availablePieces: 55, isAvailable: true, isFeatured: false, isNew: false },

      // Trousers
      { name: "Slim Fit Chinos", slug: "slim-fit-chinos", description: "Modern slim fit chinos in premium cotton.", price: "64.99", categoryId: insertedCategories[3].id, images: ["/images/products/trouser1.jpg"], sizes: ["30", "32", "34", "36", "38"], colors: ["Khaki", "Navy", "Black"], stockQuantity: 70, availablePieces: 70, isAvailable: true, isFeatured: true, isNew: true },
      { name: "Formal Dress Pants", slug: "formal-dress-pants", description: "Elegant dress pants for formal occasions.", price: "79.99", categoryId: insertedCategories[3].id, images: ["/images/products/trouser2.jpg"], sizes: ["30", "32", "34", "36"], colors: ["Black", "Navy", "Charcoal"], stockQuantity: 50, availablePieces: 50, isAvailable: true, isFeatured: true, isNew: false },
      { name: "Cargo Joggers", slug: "cargo-joggers", description: "Comfortable cargo joggers with multiple pockets.", price: "54.99", categoryId: insertedCategories[3].id, images: ["/images/products/trouser3.jpg"], sizes: ["S", "M", "L", "XL"], colors: ["Olive", "Black", "Gray"], stockQuantity: 65, availablePieces: 65, isAvailable: true, isFeatured: false, isNew: true },
      { name: "Denim Jeans Classic", slug: "denim-jeans-classic", description: "Classic straight fit denim jeans.", price: "89.99", categoryId: insertedCategories[3].id, images: ["/images/products/trouser4.jpg"], sizes: ["30", "32", "34", "36", "38"], colors: ["Dark Blue", "Light Blue", "Black"], stockQuantity: 90, availablePieces: 90, isAvailable: true, isFeatured: false, isNew: false },

      // Shoes
      { name: "Leather Oxford Shoes", slug: "leather-oxford-shoes", description: "Premium leather Oxford shoes for formal events.", price: "129.99", categoryId: insertedCategories[4].id, images: ["/images/products/shoe1.jpg"], sizes: ["7", "8", "9", "10", "11", "12"], colors: ["Black", "Brown"], stockQuantity: 40, availablePieces: 40, isAvailable: true, isFeatured: true, isNew: true },
      { name: "Canvas Sneakers", slug: "canvas-sneakers", description: "Classic canvas sneakers for everyday wear.", price: "59.99", categoryId: insertedCategories[4].id, images: ["/images/products/shoe2.jpg"], sizes: ["7", "8", "9", "10", "11"], colors: ["White", "Black", "Navy"], stockQuantity: 80, availablePieces: 80, isAvailable: true, isFeatured: true, isNew: false },
      { name: "Running Sports Shoes", slug: "running-sports-shoes", description: "Lightweight running shoes with cushioned sole.", price: "99.99", categoryId: insertedCategories[4].id, images: ["/images/products/shoe3.jpg"], sizes: ["7", "8", "9", "10", "11", "12"], colors: ["Black/Red", "White/Blue"], stockQuantity: 60, availablePieces: 60, isAvailable: true, isFeatured: false, isNew: true },
      { name: "Casual Loafers", slug: "casual-loafers", description: "Comfortable slip-on loafers for casual outings.", price: "84.99", categoryId: insertedCategories[4].id, images: ["/images/products/shoe4.jpg"], sizes: ["8", "9", "10", "11"], colors: ["Brown", "Black", "Navy"], stockQuantity: 35, availablePieces: 35, isAvailable: true, isFeatured: false, isNew: false },

      // Accessories
      { name: "Leather Belt Premium", slug: "leather-belt-premium", description: "Genuine leather belt with metal buckle.", price: "39.99", categoryId: insertedCategories[5].id, images: ["/images/products/accessory1.jpg"], sizes: ["32", "34", "36", "38"], colors: ["Black", "Brown"], stockQuantity: 100, availablePieces: 100, isAvailable: true, isFeatured: true, isNew: true },
      { name: "Sunglasses Aviator", slug: "sunglasses-aviator", description: "Classic aviator sunglasses with UV protection.", price: "49.99", categoryId: insertedCategories[5].id, images: ["/images/products/accessory2.jpg"], sizes: [], colors: ["Gold", "Silver", "Black"], stockQuantity: 70, availablePieces: 70, isAvailable: true, isFeatured: true, isNew: false },
      { name: "Wallet Bifold", slug: "wallet-bifold", description: "Slim bifold wallet with RFID protection.", price: "34.99", categoryId: insertedCategories[5].id, images: ["/images/products/accessory3.jpg"], sizes: [], colors: ["Black", "Brown", "Navy"], stockQuantity: 90, availablePieces: 90, isAvailable: true, isFeatured: false, isNew: true },
    ];

    // Convert the sample USD prices into Naira (rounded to the nearest ₦100)
    const USD_TO_NGN = 1600;
    const nairaProducts = sampleProducts.map((p) => ({
      ...p,
      price: (Math.round((parseFloat(p.price) * USD_TO_NGN) / 100) * 100).toFixed(2),
    }));

    await db.insert(products).values(nairaProducts);

    // Create default settings
    await db.insert(settings).values([
      { key: "bank_name", value: "Guaranty Trust Bank (GTBank)" },
      { key: "account_name", value: "K D K collections wears" },
      { key: "account_number", value: "0123456789" },
      { key: "routing_number", value: "058152036" },
      { key: "swift_code", value: "GTBINGLA" },
      { key: "bank_address", value: "Plot 635 Akin Adesola Street, Victoria Island, Lagos" },
      { key: "delivery_message", value: "Delivery fee is not included in product price. Our team will contact you via email/WhatsApp/phone to communicate delivery cost based on your location." },
      { key: "store_name", value: "K D K collections wears" },
      { key: "store_email", value: "kakadonkakadon@yahoo.com" },
      { key: "store_phone", value: "0810 661 7255" },
      { key: "store_address", value: "19/21, Breadfruit By Sulubolaji, Mandilas Lagos Island, Shop Number 2F 09, Lagos, Nigeria, 101223" },
      { key: "store_services", value: "Online classes, Online booking, In-store pickup, In-person classes, Delivery, In-store shopping" },
      { key: "store_areas_served", value: "Lagos State, Onicha, Nigeria, Aba, Nigeria" },
    ]);

    return { message: "Database seeded successfully" };
  } catch (error) {
    console.error("Seed error:", error);
    throw error;
  }
}
