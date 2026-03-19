import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ProductAPI from "../../api/productAPI";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "formal-wear",
    stock: "",
    image_url: "",
  });

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const product = await ProductAPI.getById(id);
      if (product && product.store_owner_id === user.id) {
        setFormData({
          name: product.name || "",
          description: product.description || "",
          price: product.price || "",
          category: product.category || "formal-wear",
          stock: product.stock || "",
          image_url: product.image_url || "",
        });
      } else {
        alert("You don't have permission to edit this product");
        navigate("/store/products");
      }
    } catch (error) {
      console.error("Failed to load product:", error);
      alert("Failed to load product");
      navigate("/store/products");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image_url: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await ProductAPI.update(id, {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      });
      alert("Product updated successfully!");
      navigate("/store/products");
    } catch (error) {
      console.error("Failed to update product:", error);
      alert("Failed to update product");
    } finally {
      setSubmitting(false);
    }
  };

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
          <Link to="/store/products" className="text-gray-300 hover:text-white">
            ← Back to Products
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
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-2">✏️ Edit Product</h1>
          <p className="text-gray-400">Update your product details</p>
        </div>

        {loading ? (
          <div className="text-center text-gray-400">Loading product...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-semibold mb-2">Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g., Classic Blazer"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="5"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Detailed product description..."
              />
            </div>

            {/* Price and Stock */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Price ($)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  step="0.01"
                  min="0"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="99.99"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Stock Quantity</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="10"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="formal-wear">Formal Wear</option>
                <option value="dresses">Dresses</option>
                <option value="shoes">Shoes</option>
                <option value="socks">Socks</option>
              </select>
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
              
              {formData.image_url && (
                <div className="mb-4">
                  <p className="text-sm text-gray-400 mb-2">Image Preview:</p>
                  <img 
                    src={formData.image_url} 
                    alt="Product preview" 
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition"
              >
                {submitting ? "Updating..." : "Update Product"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/store/products")}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
