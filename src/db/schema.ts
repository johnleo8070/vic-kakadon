import { pgTable, serial, varchar, text, integer, boolean, timestamp, jsonb, numeric } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Categories table
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description").default(""),
  image: varchar("image", { length: 500 }).default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

// Products table
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description").default(""),
  price: numeric("price").notNull(),
  categoryId: integer("category_id").references(() => categories.id, { onDelete: "set null" }),
  images: jsonb("images").$type<string[]>().default([]),
  sizes: jsonb("sizes").$type<string[]>().default([]),
  colors: jsonb("colors").$type<string[]>().default([]),
  stockQuantity: integer("stock_quantity").default(0),
  availablePieces: integer("available_pieces").default(0),
  isAvailable: boolean("is_available").default(true),
  isFeatured: boolean("is_featured").default(false),
  isNew: boolean("is_new").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const productsRelations = relations(products, ({ one }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
}));

// Orders table
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: varchar("order_number", { length: 50 }).unique(),
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  address: text("address").notNull(),
  city: varchar("city", { length: 255 }).notNull(),
  state: varchar("state", { length: 255 }).default(""),
  notes: text("notes").default(""),
  products: jsonb("products").$type<OrderProduct[]>().default([]),
  totalAmount: numeric("total_amount").notNull(),
  paymentScreenshot: varchar("payment_screenshot", { length: 500 }).default(""),
  paymentStatus: varchar("payment_status", { length: 50 }).default("pending"),
  orderStatus: varchar("order_status", { length: 50 }).default("processing"),
  trackingNumber: varchar("tracking_number", { length: 255 }).default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Admin table
export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).default("admin"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Settings table
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 255 }).notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Types
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type Admin = typeof admins.$inferSelect;
export type NewAdmin = typeof admins.$inferInsert;
export type Setting = typeof settings.$inferSelect;

export interface OrderProduct {
  productId: number;
  productName: string;
  productSlug: string;
  productImage: string;
  quantity: number;
  size: string;
  color: string;
  price: string;
}
