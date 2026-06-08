"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { Search, Eye, CheckCircle, Truck, Package, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { isAdminAuthenticated } from "@/lib/adminAuth";

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [page, setPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    if (!isAdminAuthenticated()) { router.push("/admin/login"); return; }
    fetchOrders();
  }, [router]);

  const fetchOrders = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filterStatus !== "all") params.set("paymentStatus", filterStatus);
    if (searchQuery) params.set("search", searchQuery);
    try {
      const res = await fetch(`/api/orders?${params}`);
      const data = await res.json();
      if (data.success) setOrders(data.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, [filterStatus, searchQuery]);

  const updateOrderStatus = async (id: number, field: string, value: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      const data = await res.json();
      if (data.success) fetchOrders();
    } catch (e) { console.error(e); }
  };

  const exportCSV = () => {
    const headers = ["ID", "Customer", "Email", "Phone", "City", "Total", "Payment Status", "Order Status", "Date"];
    const rows = orders.map((o) => [
      o.id, o.customerName, o.email, o.phone, o.city, o.totalAmount, o.paymentStatus, o.orderStatus, new Date(o.createdAt).toLocaleDateString()
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orders.csv";
    a.click();
  };

  const paginatedOrders = orders.slice((page - 1) * perPage, page * perPage);

  const paymentStatuses = ["pending", "confirmed"];
  const orderStatuses = ["processing", "shipped", "delivered"];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <aside className="w-64 bg-dark text-white min-h-screen fixed left-0 top-0">
          <div className="p-6 border-b border-white/10">
            <div className="flex flex-col">
              <Image src="/images/logo.png" alt="Kakadon Logo" width={150} height={50} className="object-contain bg-white/90 p-2 rounded-lg" priority />
              <p className="text-xs text-gray-400 mt-2">Admin Panel</p>
            </div>
          </div>
          <nav className="p-4 space-y-1">
            {[
              { href: "/admin", label: "Dashboard", icon: "📊" },
              { href: "/admin/orders", label: "Orders", icon: "📦" },
              { href: "/admin/products", label: "Products", icon: "🏷️" },
              { href: "/admin/categories", label: "Categories", icon: "📂" },
              { href: "/admin/admins", label: "Admins", icon: "👤" },
              { href: "/admin/settings", label: "Settings", icon: "⚙️" },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
                <span>{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        <main className="ml-64 flex-1 p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold font-serif text-dark">Orders Management</h1>
              <p className="text-gray-500">{orders.length} total orders</p>
            </div>
            <div className="flex gap-3">
              <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg text-sm font-medium shadow-sm hover:shadow-md">
                <Download className="w-4 h-4" /> Export CSV
              </button>
              <Link href="/admin" className="px-4 py-2 bg-white rounded-lg text-sm font-medium shadow-sm hover:shadow-md">
                ← Back to Dashboard
              </Link>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10"
                placeholder="Search by customer name..."
              />
            </div>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2 border rounded-lg text-sm">
              <option value="all">All Payment Status</option>
              {paymentStatuses.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">ID</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Customer</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Items</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Total</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Payment</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Order Status</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Date</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={8} className="text-center py-12"><div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto" /></td></tr>
                  ) : paginatedOrders.length === 0 ? (
                    <tr><td colSpan={8} className="text-center py-12 text-gray-500">No orders found</td></tr>
                  ) : (
                    paginatedOrders.map((order) => (
                      <tr key={order.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium font-mono text-primary">{order.orderNumber || `#${order.id}`}</td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium">{order.customerName}</div>
                          <div className="text-xs text-gray-500">{order.email}</div>
                        </td>
                        <td className="px-6 py-4 text-sm">{order.products?.length || 0} items</td>
                        <td className="px-6 py-4 text-sm font-medium">{formatPrice(order.totalAmount)}</td>
                        <td className="px-6 py-4">
                          <select
                            value={order.paymentStatus}
                            onChange={(e) => updateOrderStatus(order.id, "paymentStatus", e.target.value)}
                            className={`px-2 py-1 rounded-full text-xs font-medium border-0 ${
                              order.paymentStatus === "confirmed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {paymentStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={order.orderStatus}
                            onChange={(e) => updateOrderStatus(order.id, "orderStatus", e.target.value)}
                            className="px-2 py-1 rounded-full text-xs font-medium border-0 bg-blue-100 text-blue-700"
                          >
                            {orderStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <button onClick={() => setSelectedOrder(order)} className="p-1 hover:bg-gray-100 rounded">
                            <Eye className="w-4 h-4 text-gray-500" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {orders.length > perPage && (
              <div className="flex items-center justify-between px-6 py-4 border-t">
                <span className="text-sm text-gray-500">
                  Showing {(page - 1) * perPage + 1} to {Math.min(page * perPage, orders.length)} of {orders.length}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 border rounded disabled:opacity-50">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button onClick={() => setPage((p) => p + 1)} disabled={page * perPage >= orders.length} className="px-3 py-1 border rounded disabled:opacity-50">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold font-serif">Order <span className="font-mono text-primary">{selectedOrder.orderNumber || `#${selectedOrder.id}`}</span></h2>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-full">✕</button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-dark mb-2">Customer Details</h3>
                  <p className="text-sm text-gray-600"><strong>Name:</strong> {selectedOrder.customerName}</p>
                  <p className="text-sm text-gray-600"><strong>Email:</strong> {selectedOrder.email}</p>
                  <p className="text-sm text-gray-600"><strong>Phone:</strong> {selectedOrder.phone}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-dark mb-2">Shipping Address</h3>
                  <p className="text-sm text-gray-600">{selectedOrder.address}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.city}{selectedOrder.state ? `, ${selectedOrder.state}` : ""}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-dark mb-2">Order Items</h3>
                <div className="space-y-2">
                  {selectedOrder.products?.map((item: any, i: number) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">{item.productName}</span>
                      <span className="text-xs text-gray-500">Qty: {item.quantity} | {item.size} / {item.color}</span>
                      <span className="ml-auto text-sm font-medium">{formatPrice(item.price)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between text-lg font-bold pt-4 border-t">
                <span>Total</span>
                <span className="text-primary">{formatPrice(selectedOrder.totalAmount)}</span>
              </div>
              {selectedOrder.notes && (
                <div>
                  <h3 className="font-semibold text-dark mb-1">Notes</h3>
                  <p className="text-sm text-gray-600">{selectedOrder.notes}</p>
                </div>
              )}
              {selectedOrder.paymentScreenshot && (
                <div>
                  <h3 className="font-semibold text-dark mb-2">Payment Screenshot</h3>
                  <img src={selectedOrder.paymentScreenshot} alt="Payment proof" className="max-h-48 rounded-lg" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
