import {
  BarChart3,
  ShoppingBag,
  Package,
  FolderOpen,
  Users,
  Settings,
  type LucideIcon,
} from "lucide-react";

export const ADMIN_NAV = [
  { href: "/admin", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderOpen },
  { href: "/admin/admins", label: "Admins", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
] as const satisfies ReadonlyArray<{ href: string; label: string; icon: LucideIcon }>;
