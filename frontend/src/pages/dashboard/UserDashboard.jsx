import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductAPI from "../../api/productAPI";
import OrderAPI from "../../api/orderAPI";

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Load all products from store owners
      const allProducts = await ProductAPI.getAll();
      setProducts(allProducts || []);
      
      // Load user's orders
      const userOrders = await OrderAPI.getMyOrders();
      setOrders(userOrders || []);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 border-b border-gray-700">
        <Link to="/" className="flex items-center gap-2 text-xl font-semibold hover:scale-105 transition" title="Home">
          <span className="text-2xl">🏡</span>
          <span>Home</span>
        </Link>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          👗 StyleHub
        </h1>
        <div className="flex gap-4 items-center">
          <span className="text-gray-300">Welcome, {user?.name}!</span>
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
        {/* User Info */}
        <div className="mb-12 p-6 bg-gray-800/50 border border-gray-700 rounded-lg">
          <h2 className="text-3xl font-bold mb-4">👤 My Dashboard</h2>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-gray-400 text-sm">Name</p>
              <p className="text-xl font-semibold">{user?.name}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Email</p>
              <p className="text-xl font-semibold">{user?.email}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Orders</p>
              <p className="text-xl font-semibold">{orders.length}</p>
            </div>
          </div>
        </div>

        {/* My Orders Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">📦 My Orders</h2>
          {orders.length === 0 ? (
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-12 text-center">
              <p className="text-gray-400 text-lg mb-4">No orders yet</p>
              <Link
                to="/"
                className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition"
              >
                Start Shopping →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">Order Number</p>
                      <p className="text-lg font-bold text-green-400">{order.order_number}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Amount</p>
                      <p className="text-lg font-bold text-blue-400">${order.total_amount}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Status</p>
                      <p className="text-lg font-bold capitalize text-yellow-400">{order.status}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Date</p>
                      <p className="text-lg font-bold">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Available Products Section */}
        <section>
          <h2 className="text-3xl font-bold mb-6">🛍️ Available Products from Store Owners</h2>
          {loading ? (
            <div className="text-center text-gray-400">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-12 text-center">
              <p className="text-gray-400 text-lg">No products available yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden hover:border-green-500 transition">
                  <div className="h-48 bg-gradient-to-br from-green-600/20 to-emerald-600/20 flex items-center justify-center text-6xl">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      "📦"
                    )}
                  </div>
                  <div className="p-4">
                    <h4 className="text-lg font-bold mb-1">{product.name}</h4>
                    <p className="text-gray-400 text-sm mb-2 line-clamp-2">{product.description}</p>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-green-400 font-semibold text-lg">${product.price}</span>
                      <span className="bg-gray-700 px-2 py-1 rounded text-xs capitalize">{product.category}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-400 mb-3">
                      <span>Stock: {product.stock}</span>
                      <span>⭐ {product.rating || 0}/5</span>
                    </div>
                    <button
                      onClick={() => alert(`Added ${product.name} to cart!`)}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 py-2 rounded transition font-semibold"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}