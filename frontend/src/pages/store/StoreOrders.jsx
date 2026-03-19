import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import OrderAPI from "../../api/orderAPI";

export default function StoreOrders() {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const storeOrders = await OrderAPI.getStoreOwnerOrders();
      setOrders(storeOrders || []);
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await OrderAPI.updateStatus(orderId, newStatus);
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  const filteredOrders = filterStatus === "all" 
    ? orders 
    : orders.filter(o => o.status === filterStatus);

  const statusColors = {
    pending: "bg-yellow-500/20 text-yellow-400",
    confirmed: "bg-blue-500/20 text-blue-400",
    processing: "bg-purple-500/20 text-purple-400",
    shipped: "bg-indigo-500/20 text-indigo-400",
    delivered: "bg-green-500/20 text-green-400",
    cancelled: "bg-red-500/20 text-red-400",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 border-b border-gray-700">
        <Link to="/" className="flex items-center gap-2 text-xl font-semibold hover:scale-105 transition" title="Home">
          <span className="text-2xl">🏡</span>
          <span>Home</span>
        </Link>
        <Link to="/" className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
          🏪 StyleHub Store
        </Link>
        <div className="flex gap-4 items-center">
          <Link to="/store/dashboard" className="text-gray-300 hover:text-white">
            ← Back to Dashboard
          </Link>
          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-2">📋 Orders</h1>
          <p className="text-gray-400">Monitor and manage incoming orders</p>
        </div>

        {/* Filter */}
        <div className="mb-8">
          <label className="block text-sm font-semibold mb-3">Filter by Status</label>
          <div className="flex gap-2 flex-wrap">
            {["all", "pending", "confirmed", "processing", "shipped", "delivered", "cancelled"].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-semibold transition capitalize ${
                  filterStatus === status
                    ? "bg-green-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-400">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-12 text-center">
            <p className="text-gray-400 text-lg">No orders found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 pb-6 border-b border-gray-600">
                  <div>
                    <p className="text-gray-400 text-sm">Order Number</p>
                    <p className="text-xl font-bold text-green-400">{order.order_number}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Total Amount</p>
                    <p className="text-xl font-bold text-blue-400">${order.total_amount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Customer Phone</p>
                    <p className="text-lg text-gray-300">{order.phone}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Date</p>
                    <p className="text-lg text-gray-300">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Items */}
                <div className="mb-6">
                  <p className="text-sm font-semibold text-gray-400 mb-3">Items</p>
                  <div className="bg-gray-900/50 rounded p-4 space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span>{item.name} x {item.quantity}</span>
                        <span className="text-gray-400">{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status and Actions */}
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Current Status</p>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold capitalize ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </div>

                  {/* Status Update Buttons */}
                  <div className="flex gap-2">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="bg-gray-700 text-white px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
