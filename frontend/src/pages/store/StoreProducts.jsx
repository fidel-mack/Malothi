import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ProductAPI from "../../api/productAPI";

export default function StoreProducts() {
  const { user, logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const ownerProducts = await ProductAPI.getByStoreOwner(user.id);
      setProducts(ownerProducts || []);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await ProductAPI.delete(productId);
        setProducts(products.filter(p => p.id !== productId));
      } catch (error) {
        console.error("Failed to delete product:", error);
      }
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", ...new Set(products.map(p => p.category))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 border-b border-gray-700">
        <Link to="/" className="text-4xl hover:scale-110 transition" title="Home">
          🏠
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
          <h1 className="text-5xl font-bold mb-2">📦 Manage Products</h1>
          <p className="text-gray-400">View and manage all your products</p>
        </div>

        {/* Add Product Button */}
        <div className="mb-8">
          <Link
            to="/store/add-product"
            className="inline-block bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 px-6 py-3 rounded-lg font-semibold transition"
          >
            ➕ Add New Product
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Search Products</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name..."
                className="w-full p-3 rounded-lg bg-gray-700 text-white outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Filter by Category</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-700 text-white outline-none focus:ring-2 focus:ring-green-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === "all" ? "All Categories" : cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-400">Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-12 text-center">
            <p className="text-gray-400 text-lg mb-4">No products found</p>
            <Link
              to="/store/add-product"
              className="inline-block bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 px-8 py-3 rounded-lg font-semibold transition"
            >
              ➕ Add Your First Product
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden hover:border-green-500 transition">
                <div className="h-48 bg-gradient-to-br from-green-600/20 to-emerald-600/20 flex items-center justify-center text-6xl">
                  📦
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{product.description}</p>
                  
                  <div className="space-y-3 mb-4 pb-4 border-b border-gray-600">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Price:</span>
                      <span className="text-green-400 font-semibold">${product.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Category:</span>
                      <span className="text-gray-300">{product.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Stock:</span>
                      <span className={product.stock > 0 ? "text-green-400" : "text-red-400"}>
                        {product.stock} items
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Rating:</span>
                      <span className="text-yellow-400">⭐ {product.rating || 0}/5</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      to={`/store/edit-product/${product.id}`}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded text-center transition font-semibold"
                    >
                      ✏️ Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded transition font-semibold"
                    >
                      🗑️ Delete
                    </button>
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
