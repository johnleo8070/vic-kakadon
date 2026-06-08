"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { BarChart3, DollarSign, ShoppingBag, Package, TrendingUp, Clock, Users } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { isAdminAuthenticated } from "@/lib/adminAuth";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      router.push("/admin/login");
      return;
    }

    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        const data = await res.json();
        if (data.success) setStats(data.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const statCards = [
    { title: "Total Revenue", value: formatPrice(stats?.totalRevenue || 0), icon: <DollarSign className="w-6 h-6" />, color: "bg-green-500", change: "+12%" },
    { title: "Total Orders", value: stats?.totalOrders || 0, icon: <ShoppingBag className="w-6 h-6" />, color: "bg-blue-500", change: "+8%" },
    { title: "Products", value: stats?.totalProducts || 0, icon: <Package className="w-6 h-6" />, color: "bg-purple-500", change: "+3" },
    { title: "Pending Orders", value: stats?.pendingOrders || 0, icon: <Clock className="w-6 h-6" />, color: "bg-orange-500", change: "Needs attention" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-dark text-white min-h-screen fixed left-0 top-0">
          <div className="p-6 border-b border-white/10">
            <div className="flex flex-col">
              <Image src="/images/logo.png" alt="Kakadon Logo" width={150} height={50} className="object-contain bg-white/90 p-2 rounded-lg" priority />
              <p className="text-xs text-gray-400 mt-2">Admin Panel</p>
            </div>
          </div>
          <nav className="p-4 space-y-1">
            {[
              { href: "/admin", label: "Dashboard", icon: <BarChart3 className="w-5 h-5" /> },
              { href: "/admin/orders", label: "Orders", icon: <ShoppingBag className="w-5 h-5" /> },
              { href: "/admin/products", label: "Products", icon: <Package className="w-5 h-5" /> },
              { href: "/admin/categories", label: "Categories", icon: <Package className="w-5 h-5" /> },
              { href: "/admin/admins", label: "Admins", icon: <Users className="w-5 h-5" /> },
              { href: "/admin/settings", label: "Settings", icon: <Users className="w-5 h-5" /> },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
              >
                {item.icon}
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="ml-64 flex-1 p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold font-serif text-dark">Dashboard</h1>
              <p className="text-gray-500">Welcome back! Here's what's happening with your store.</p>
            </div>
            <div className="flex gap-3">
              <Link href="/" className="px-4 py-2 bg-white rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-shadow">
                View Store
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((card) => (
              <div key={card.title} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center text-white`}>
                    {card.icon}
                  </div>
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">{card.change}</span>
                </div>
                <h3 className="text-2xl font-bold text-dark">{card.value}</h3>
                <p className="text-sm text-gray-500">{card.title}</p>
              </div>
            ))}
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-lg font-bold font-serif">Recent Orders</h2>
              <Link href="/admin/orders" className="text-sm text-primary hover:underline">View All</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Order ID</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Customer</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Amount</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Payment</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Status</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentOrders?.slice(0, 5).map((order: any) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium">#{order.id}</td>
                      <td className="px-6 py-4 text-sm">{order.customerName}</td>
                      <td className="px-6 py-4 text-sm font-medium">{formatPrice(order.totalAmount)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.paymentStatus === "confirmed" ? "bg-green-100 text-green-700" :
                          order.paymentStatus === "pending" ? "bg-yellow-100 text-yellow-700" :
                          "bg-gray-100 text-gray-700"
                        }`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.orderStatus === "delivered" ? "bg-green-100 text-green-700" :
                          order.orderStatus === "shipped" ? "bg-blue-100 text-blue-700" :
                          "bg-orange-100 text-orange-700"
                        }`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {(!stats?.recentOrders || stats.recentOrders.length === 0) && (
              <div className="text-center py-12 text-gray-500">
                <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No orders yet</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
