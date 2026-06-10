CREATE TABLE "admins" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"role" varchar(50) DEFAULT 'admin',
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "admins_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text DEFAULT '',
	"image" varchar(500) DEFAULT '',
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_number" varchar(50),
	"customer_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(50) NOT NULL,
	"address" text NOT NULL,
	"city" varchar(255) NOT NULL,
	"state" varchar(255) DEFAULT '',
	"notes" text DEFAULT '',
	"products" jsonb DEFAULT '[]'::jsonb,
	"total_amount" numeric NOT NULL,
	"payment_screenshot" varchar(500) DEFAULT '',
	"payment_status" varchar(50) DEFAULT 'pending',
	"order_status" varchar(50) DEFAULT 'processing',
	"tracking_number" varchar(255) DEFAULT '',
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "orders_order_number_unique" UNIQUE("order_number")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text DEFAULT '',
	"price" numeric NOT NULL,
	"category_id" integer,
	"images" jsonb DEFAULT '[]'::jsonb,
	"sizes" jsonb DEFAULT '[]'::jsonb,
	"colors" jsonb DEFAULT '[]'::jsonb,
	"stock_quantity" integer DEFAULT 0,
	"available_pieces" integer DEFAULT 0,
	"is_available" boolean DEFAULT true,
	"is_featured" boolean DEFAULT false,
	"is_new" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "products_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar(255) NOT NULL,
	"value" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "settings_key_unique" UNIQUE("key")
);
--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;