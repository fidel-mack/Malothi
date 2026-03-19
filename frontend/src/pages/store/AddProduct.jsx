import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ProductAPI from "../../api/productAPI";

export default function AddProduct() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "formal-wear",
    description: "",
    stock: "",
    image_url: "",
  });
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setForm({ ...form, image_url: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      await ProductAPI.create({
        name: form.name,
        price: parseFloat(form.price),
        category: form.category,
        description: form.description,
        stock: parseInt(form.stock),
        image_url: form.image_url,
      });
      
      setSuccess(true);
      setForm({ name: "", price: "", category: "formal-wear", description: "", stock: "", image_url: "" });
      setImagePreview("");
      
      setTimeout(() => {
        navigate("/store/dashboard");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 border-b border-gray-700">
        <Link to="/" className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
          🏪 StyleHub Store
        </Link>
        <div className="flex gap-4">
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
      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-5xl font-bold mb-8">➕ Add New Product</h1>

        {success && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-400">
            ✅ Product added successfully! Redirecting...
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-gray-800/50 border border-gray-700 rounded-lg p-8 space-y-6">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-semibold mb-2">Product Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g., Classic Blazer"
              className="w-full p-3 rounded-lg bg-gray-700 text-white outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-semibold mb-2">Price ($) *</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="99.99"
              className="w-full p-3 rounded-lg bg-gray-700 text-white outline-none focus:ring-2 focus:ring-green-500"
              step="0.01"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold mb-2">Category *</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full p-3 rounded-lg bg-gray-700 text-white outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="formal-wear">👔 Formal Wear</option>
              <option value="dresses">👗 Dresses</option>
              <option value="shoes">👟 Shoes</option>
              <option value="socks">🧦 Socks</option>
            </select>
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm font-semibold mb-2">Stock Quantity *</label>
            <input
              type="number"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              placeholder="50"
              className="w-full p-3 rounded-lg bg-gray-700 text-white outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe your product..."
              className="w-full p-3 rounded-lg bg-gray-700 text-white outline-none focus:ring-2 focus:ring-green-500 resize-none h-32"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold mb-2">Product Image</label>
            <div className="mb-4 p-4 border-2 border-dashed border-gray-600 rounded-lg">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-gray-300"
              />
            </div>
            
            {imagePreview && (
              <div className="mb-4">
                <p className="text-sm text-gray-400 mb-2">Image Preview:</p>
                <img 
                  src={imagePreview} 
                  alt="Product preview" 
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold transition ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            }`}
          >
            {loading ? "Adding Product..." : "➕ Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
}
