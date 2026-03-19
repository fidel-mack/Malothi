import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ProductAPI from "../../api/productAPI";

export default function StoreDashboard() {
  const { user, logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    ordersThisMonth: 0,
    avgRating: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Get store owner's products
      const ownerProducts = await ProductAPI.getByStoreOwner(user.id);
      setProducts(ownerProducts || []);

      // Calculate stats
      const totalSales = ownerProducts.reduce((sum, p) => sum + parseFloat(p.price), 0);
      setStats({
        totalProducts: ownerProducts.length,
        totalSales: totalSales.toFixed(2),
        ordersThisMonth: Math.floor(Math.random() * 30) + 5, // Mock data
        avgRating: (Math.random() * 2 + 3).toFixed(1), // Mock rating 3-5
      });
    } catch (error) {
      console.error("Failed to load dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const dashboardStats = [
    { label: "Total Products", value: stats.totalProducts, icon: "📦", color: "from-blue-500 to-blue-600" },
    { label: "Total Sales", value: `$${stats.totalSales}`, icon: "💰", color: "from-green-500 to-green-600" },
    { label: "Orders This Month", value: stats.ordersThisMonth, icon: "📋", color: "from-purple-500 to-purple-600" },
    { label: "Avg Rating", value: `${stats.avgRating}/5`, icon: "⭐", color: "from-yellow-500 to-yellow-600" },
  ];

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
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-2">📊 Store Dashboard</h1>
          <p className="text-gray-400">Manage your store and monitor your business performance</p>
        </div>

        {loading ? (
          <div className="text-center text-gray-400">Loading dashboard...</div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {dashboardStats.map((stat, idx) => (
                <div key={idx} className={`bg-gradient-to-br ${stat.color} rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition`}>
                  <div className="text-4xl mb-3">{stat.icon}</div>
                  <p className="text-gray-200 text-sm font-semibold mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link
                  to="/store/add-product"
                  className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-500 hover:border-green-400 rounded-lg p-8 transition cursor-pointer hover:shadow-lg"
                >
                  <div className="text-5xl mb-4">➕</div>
                  <h3 className="text-2xl font-bold mb-2">Add Product</h3>
                  <p className="text-gray-300">Add a new product to your store</p>
                </Link>

                <Link
                  to="/store/products"
                  className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500 hover:border-blue-400 rounded-lg p-8 transition cursor-pointer hover:shadow-lg"
                >
                  <div className="text-5xl mb-4">📦</div>
                  <h3 className="text-2xl font-bold mb-2">Manage Products</h3>
                  <p className="text-gray-300">Edit or remove products</p>
                </Link>

                <Link
                  to="/store/orders"
                  className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500 hover:border-purple-400 rounded-lg p-8 transition cursor-pointer hover:shadow-lg"
                >
                  <div className="text-5xl mb-4">📋</div>
                  <h3 className="text-2xl font-bold mb-2">View Orders</h3>
                  <p className="text-gray-300">Check incoming orders</p>
                </Link>
              </div>
            </section>

            {/* Your Products */}
            <section>
              <h2 className="text-3xl font-bold mb-6">Your Products</h2>
              {products.length === 0 ? (
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-12 text-center">
                  <p className="text-gray-400 text-lg mb-4">No products yet</p>
                  <Link
                    to="/store/add-product"
                    className="inline-block bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 px-8 py-3 rounded-lg font-semibold transition"
                  >
                    ➕ Add Your First Product
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div key={product.id} className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden hover:border-green-500 transition">
                      <div className="h-40 bg-gradient-to-br from-green-600/20 to-emerald-600/20 flex items-center justify-center text-5xl">
                        📦
                      </div>
                      <div className="p-4">
                        <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                        <p className="text-gray-400 text-sm mb-3">{product.description}</p>
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-green-400 font-semibold text-lg">${product.price}</span>
                          <span className="bg-gray-700 px-3 py-1 rounded text-sm">{product.category}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-400 mb-4">
                          <span>Stock: {product.stock}</span>
                          <span>Rating: {product.rating || 0}/5</span>
                        </div>
                        <div className="flex gap-2">
                          <Link
                            to={`/store/edit-product/${product.id}`}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded text-center transition"
                          >
                            Edit
                          </Link>
                          <button className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded transition">
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
