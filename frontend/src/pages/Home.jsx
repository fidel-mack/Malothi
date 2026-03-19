import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useState, useEffect } from "react";
import ProductAPI from "../api/productAPI";
import OrderAPI from "../api/orderAPI";

export default function Home() {
  const { user, logout } = useAuth();
  const { cart } = useCart();

  const [showNotifications, setShowNotifications] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [userOrders, setUserOrders] = useState([]);
  const [storeOrders, setStoreOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Load all products for customers
      if (user.role === "CUSTOMER") {
        const products = await ProductAPI.getAll();
        setAllProducts(products || []);
      }

      // Load user orders for customers
      if (user.role === "CUSTOMER") {
        const orders = await OrderAPI.getMyOrders();
        setUserOrders(orders || []);
      }

      // Load store orders for store owners
      if (user.role === "STORE_OWNER") {
        const orders = await OrderAPI.getStoreOwnerOrders();
        setStoreOrders(orders || []);
      }
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white overflow-hidden">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 border-b border-gray-700">
        <Link to="/" className="text-4xl hover:scale-110 transition" title="Home">
          🏠
        </Link>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          👗 StyleHub
        </h1>
        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <span className="text-gray-300">Welcome, {user.name}!</span>

              {/* Notification Icon */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg transition"
                  title="Notifications"
                >
                  🔔
                  {/* Notification Badge */}
                  {((user.role === "CUSTOMER" && userOrders.length > 0) ||
                    (user.role === "STORE_OWNER" && storeOrders.length > 0)) && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {user.role === "CUSTOMER" ? userOrders.length : storeOrders.length}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
                    <div className="p-4 border-b border-gray-700">
                      <h4 className="font-bold text-lg">Notifications</h4>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {user.role === "CUSTOMER" ? (
                        <>
                          {/* New Products Notification */}
                          <div className="p-4 border-b border-gray-700 hover:bg-gray-700/50">
                            <div className="flex items-start gap-3">
                              <span className="text-2xl">🆕</span>
                              <div>
                                <p className="font-semibold">New Products Available!</p>
                                <p className="text-sm text-gray-400">
                                  {allProducts.length} products from {new Set(allProducts.map(p => p.store_owner_id)).size} stores
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* User Orders */}
                          {userOrders.length > 0 ? (
                            userOrders.slice(0, 5).map((order) => (
                              <div key={order.id} className="p-4 border-b border-gray-700 hover:bg-gray-700/50">
                                <div className="flex items-start gap-3">
                                  <span className="text-2xl">📦</span>
                                  <div>
                                    <p className="font-semibold">Order #{order.order_number}</p>
                                    <p className="text-sm text-gray-400">
                                      ${order.total_amount} • {order.status} • {new Date(order.created_at).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-4 text-center text-gray-400">
                              No orders yet
                            </div>
                          )}
                        </>
                      ) : user.role === "STORE_OWNER" ? (
                        <>
                          {/* Store Orders */}
                          {storeOrders.length > 0 ? (
                            storeOrders.slice(0, 5).map((order) => (
                              <div key={order.id} className="p-4 border-b border-gray-700 hover:bg-gray-700/50">
                                <div className="flex items-start gap-3">
                                  <span className="text-2xl">🛒</span>
                                  <div>
                                    <p className="font-semibold">New Order #{order.order_number}</p>
                                    <p className="text-sm text-gray-400">
                                      ${order.total_amount} • {order.status} • {new Date(order.created_at).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-4 text-center text-gray-400">
                              No orders yet
                            </div>
                          )}
                        </>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>

              {user.role === "CUSTOMER" && (
                <>
                  <a
                    href="mailto:support@stylehub.com"
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition"
                  >
                    📧 Contact
                  </a>
                  <Link
                    to="/cart"
                    className="relative bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition flex items-center gap-2"
                  >
                    🛒 Cart
                    {cart.length > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {cart.length}
                      </span>
                    )}
                  </Link>
                </>
              )}
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-gray-700 px-6 py-2 rounded-lg hover:bg-gray-600 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      {user && user.role === "STORE_OWNER" ? (
        // Store Owner Hero
        <section className="relative h-96 flex items-center justify-center text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 via-emerald-600/20 to-teal-600/20 blur-3xl"></div>
          <div className="relative z-10">
            <h2 className="text-6xl font-bold mb-4">
              Welcome, <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">{user.name}!</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Manage your store and grow your business
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/store/dashboard"
                className="inline-block bg-gradient-to-r from-green-500 to-emerald-500 px-8 py-3 rounded-lg text-lg font-semibold hover:from-green-600 hover:to-emerald-600 transition"
              >
                📊 Go to Dashboard
              </Link>
              <Link
                to="/store/add-product"
                className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-3 rounded-lg text-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition"
              >
                ➕ Add Product
              </Link>
            </div>
          </div>
        </section>
      ) : (
        // Customer Hero
        <section className="relative h-96 flex items-center justify-center text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 blur-3xl"></div>
          <div className="relative z-10">
            {user ? (
              <>
                <h2 className="text-6xl font-bold mb-4">
                  Welcome Back, <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">{user.name}!</span>
                </h2>
                <p className="text-xl text-gray-300 mb-8">
                  Ready to find your perfect style? Explore our collections
                </p>
              </>
            ) : (
              <>
                <h2 className="text-6xl font-bold mb-4">
                  Discover Your <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Style</span>
                </h2>
                <p className="text-xl text-gray-300 mb-8">
                  Premium fashion collection for every occasion
                </p>
              </>
            )}
            {!user && (
              <Link
                to="/login"
                className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-3 rounded-lg text-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition transform hover:scale-105"
              >
                Get Started
              </Link>
            )}
          </div>
        </section>
      )}

      {/* Customer Collections Section */}
      {(!user || user.role === "CUSTOMER") && (
        <section className="py-16 px-6 max-w-7xl mx-auto">
          <h3 className="text-4xl font-bold mb-12 text-center">Featured Collections</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <Link to="/formal-wear" className="group relative overflow-hidden rounded-lg border border-gray-700 hover:border-purple-500 transition">
              <div className="h-64 bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                <span className="text-6xl">👔</span>
              </div>
              <div className="p-6 bg-gray-900/80 backdrop-blur">
                <h4 className="text-2xl font-bold mb-2">Formal Wear</h4>
                <p className="text-gray-400 mb-4">
                  Elegant suits and formal attire for every occasion
                </p>
                <div className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded transition text-center">
                  Explore →
                </div>
              </div>
            </Link>

            {/* Card 2 */}
            <Link to="/dresses" className="group relative overflow-hidden rounded-lg border border-gray-700 hover:border-purple-500 transition">
              <div className="h-64 bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
                <span className="text-6xl">👗</span>
              </div>
              <div className="p-6 bg-gray-900/80 backdrop-blur">
                <h4 className="text-2xl font-bold mb-2">Dresses</h4>
                <p className="text-gray-400 mb-4">
                  Beautiful dresses for casual and special events
                </p>
                <div className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded transition text-center">
                  Explore →
                </div>
              </div>
            </Link>

            {/* Card 3 */}
            <Link to="/shoes" className="group relative overflow-hidden rounded-lg border border-gray-700 hover:border-purple-500 transition">
              <div className="h-64 bg-gradient-to-br from-pink-600 to-pink-800 flex items-center justify-center">
                <span className="text-6xl">👟</span>
              </div>
              <div className="p-6 bg-gray-900/80 backdrop-blur">
                <h4 className="text-2xl font-bold mb-2">Footwear</h4>
                <p className="text-gray-400 mb-4">
                  Premium shoes and sneakers for every style
                </p>
                <div className="w-full bg-pink-600 hover:bg-pink-700 py-2 rounded transition text-center">
                  Explore →
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-16 px-6 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-4xl font-bold mb-12 text-center">
            {user && user.role === "STORE_OWNER" ? "Why Use StyleHub?" : "Why Choose StyleHub?"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {user && user.role === "STORE_OWNER" ? (
              <>
                <div className="text-center">
                  <div className="text-5xl mb-4">📈</div>
                  <h4 className="text-2xl font-bold mb-2">Grow Your Business</h4>
                  <p className="text-gray-400">
                    Reach thousands of customers and increase your revenue
                  </p>
                </div>

                <div className="text-center">
                  <div className="text-5xl mb-4">🛠️</div>
                  <h4 className="text-2xl font-bold mb-2">Easy Management</h4>
                  <p className="text-gray-400">
                    Simple tools to manage products, inventory, and orders
                  </p>
                </div>

                <div className="text-center">
                  <div className="text-5xl mb-4">💳</div>
                  <h4 className="text-2xl font-bold mb-2">Secure Payments</h4>
                  <p className="text-gray-400">
                    Safe and secure payment processing for all transactions
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="text-center">
                  <div className="text-5xl mb-4">✨</div>
                  <h4 className="text-2xl font-bold mb-2">Premium Quality</h4>
                  <p className="text-gray-400">
                    Hand-picked collections from top designers worldwide
                  </p>
                </div>

                <div className="text-center">
                  <div className="text-5xl mb-4">🚚</div>
                  <h4 className="text-2xl font-bold mb-2">Fast Shipping</h4>
                  <p className="text-gray-400">
                    Free shipping on orders over $50. Quick delivery worldwide.
                  </p>
                </div>

                <div className="text-center">
                  <div className="text-5xl mb-4">💯</div>
                  <h4 className="text-2xl font-bold mb-2">100% Guaranteed</h4>
                  <p className="text-gray-400">
                    Money-back guarantee if you're not completely satisfied
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* All Products Section for Customers */}
      {user && user.role === "CUSTOMER" && (
        <section className="py-16 px-6 max-w-7xl mx-auto">
          <h3 className="text-4xl font-bold mb-12 text-center">Latest Products from Our Stores</h3>

          {loading ? (
            <div className="text-center text-gray-400">Loading products...</div>
          ) : allProducts.length === 0 ? (
            <div className="text-center text-gray-400">No products available yet</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {allProducts.slice(0, 12).map((product) => (
                <div key={product.id} className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden hover:border-green-500 transition">
                  <div className="h-48 bg-gradient-to-br from-green-600/20 to-emerald-600/20 flex items-center justify-center text-6xl">
                    📦
                  </div>
                  <div className="p-4">
                    <h4 className="text-lg font-bold mb-1">{product.name}</h4>
                    <p className="text-gray-400 text-sm mb-2 line-clamp-2">{product.description}</p>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-green-400 font-semibold text-lg">${product.price}</span>
                      <span className="bg-gray-700 px-2 py-1 rounded text-xs capitalize">{product.category}</span>
                    </div>
                    <div className="text-xs text-gray-500 mb-3">
                      Store: <span className="text-blue-400">Store Owner #{product.store_owner_id ? product.store_owner_id.slice(0, 8) : 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-400 mb-3">
                      <span>Stock: {product.stock}</span>
                      <span>⭐ {product.rating || 0}/5</span>
                    </div>
                    <button
                      onClick={() => {
                        alert(`Added ${product.name} to cart!`);
                      }}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 py-2 rounded transition font-semibold"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {allProducts.length > 12 && (
            <div className="text-center mt-8">
              <Link
                to="/formal-wear"
                className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition"
              >
                View All Products →
              </Link>
            </div>
          )}
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 px-6 text-center">
        {user && user.role === "STORE_OWNER" ? (
          <>
            <h3 className="text-4xl font-bold mb-6">Ready to manage your store?</h3>
            <p className="text-xl text-gray-300 mb-8">
              Start adding products and reaching customers today
            </p>
            <Link
              to="/store/add-product"
              className="inline-block bg-gradient-to-r from-green-500 to-emerald-500 px-8 py-3 rounded-lg text-lg font-semibold hover:from-green-600 hover:to-emerald-600 transition transform hover:scale-105"
            >
              Add Your First Product
            </Link>
          </>
        ) : user ? (
          <>
            <h3 className="text-4xl font-bold mb-6">Continue Shopping</h3>
            <p className="text-xl text-gray-300 mb-8">
              Explore new collections and find your perfect style
            </p>
            <Link
              to="/formal-wear"
              className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-3 rounded-lg text-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition transform hover:scale-105"
            >
              Shop Now
            </Link>
          </>
        ) : (
          <>
            <h3 className="text-4xl font-bold mb-6">Ready to explore?</h3>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of fashion enthusiasts discovering their perfect style
            </p>
            <Link
              to="/signup"
              className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-3 rounded-lg text-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition transform hover:scale-105"
            >
              Start Shopping Now
            </Link>
          </>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-700 py-8 px-6 text-center text-gray-500">
        <p>&copy; 2026 StyleHub. All rights reserved. | Elevating Fashion</p>
      </footer>
    </div>
  );
}
