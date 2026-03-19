import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

export default function Checkout() {
  const { cart, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4">⚠️ Cart is Empty</h1>
          <p className="text-gray-300 text-lg mb-8">No items to checkout!</p>
          <Link
            to="/formal-wear"
            className="inline-block bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!phone || phone.length < 10) {
      setError("Please enter a valid phone number");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      
      // Normalize prices for backend (ensure they're numbers)
      const normalizedItems = cart.map(item => ({
        ...item,
        price: typeof item.price === 'string' ? parseFloat(item.price.replace('$', '')) : item.price
      }));
      
      const response = await axios.post(
        "http://localhost:5000/api/orders",
        {
          phone,
          items: normalizedItems,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setOrderId(response.data.data.order_number);
        setOrderPlaced(true);
        setLoading(false);

        // Clear cart after successful order
        setTimeout(() => {
          clearCart();
          navigate("/");
        }, 3000);
      }
    } catch (err) {
      console.error("Order error:", err);
      setError(err.response?.data?.message || "Failed to place order. Please try again.");
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex flex-col items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-7xl mb-6">✅</div>
          <h1 className="text-5xl font-bold mb-4">Order Confirmed!</h1>
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 mb-6">
            <p className="text-gray-400 mb-2">Order ID</p>
            <p className="text-2xl font-bold text-green-400 mb-6">{orderId}</p>
            <p className="text-gray-300 mb-4">
              <strong>Phone:</strong> {phone}
            </p>
            <p className="text-gray-300 mb-4">
              <strong>Total Paid:</strong> ${(getTotalPrice() * 1.1).toFixed(2)}
            </p>
          </div>
          <p className="text-gray-300 mb-8">
            Redirecting you to home page in 3 seconds...
          </p>
          <Link
            to="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      {/* Header */}
      <nav className="flex justify-between items-center p-6 border-b border-gray-700">
        <Link to="/" className="flex items-center gap-2 text-xl font-semibold hover:scale-105 transition" title="Home">
          <span className="text-2xl">🏡</span>
          <span>Home</span>
        </Link>
        <Link to="/" className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          👗 StyleHub
        </Link>
        <div className="flex gap-4 items-center">
          <Link to="/cart" className="text-4xl hover:scale-110 transition" title="Cart">
            🛒
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-5xl font-bold mb-12">💳 Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-gray-800/50 border border-gray-700 rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Delivery Information</h2>

              {/* User Info */}
              {user && (
                <div className="mb-6 pb-6 border-b border-gray-600">
                  <p className="text-gray-400 text-sm mb-2">Signed in as</p>
                  <p className="text-xl font-semibold">{user.name} ({user.email})</p>
                </div>
              )}

              {/* Phone Number */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g., +1234567890"
                  className="w-full p-3 rounded-lg bg-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="text-gray-400 text-sm mt-1">
                  We'll use this to contact you about your delivery
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-600/20 border border-red-600 rounded-lg text-red-400">
                  {error}
                </div>
              )}

              <button
                disabled={loading}
                className={`w-full py-3 rounded-lg font-semibold transition ${
                  loading
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                }`}
              >
                {loading ? "Processing..." : "Complete Purchase"}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 sticky top-6">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.name} x{item.quantity}
                    </span>
                    <span>
                      ${(
                        parseFloat(item.price.replace("$", "")) * item.quantity
                      ).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pb-6 border-b border-gray-600 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (10%)</span>
                  <span>${(getTotalPrice() * 0.1).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-bold mt-6">
                <span>Total</span>
                <span className="text-green-400">
                  ${(getTotalPrice() * 1.1).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
