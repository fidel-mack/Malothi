import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, getTotalPrice } = useCart();
  const { user } = useAuth();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4">🛒 Your Cart is Empty</h1>
          <p className="text-gray-300 text-lg mb-8">Start shopping to add items!</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      {/* Header */}
      <nav className="flex justify-between items-center p-6 border-b border-gray-700">
        <Link to="/" className="text-4xl hover:scale-110 transition" title="Home">
          🏠
        </Link>
        <Link to="/" className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          👗 StyleHub
        </Link>
        <div className="flex gap-4 items-center">
          <span className="text-4xl">🛒</span>
          {user ? (
            <Link
              to={user.role === "ADMIN" ? "/dashboard/admin" : "/dashboard/user"}
              className="bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Dashboard
            </Link>
          ) : (
            <Link to="/login" className="bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-700">
              Login
            </Link>
          )}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-5xl font-bold mb-12">🛒 Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-6 p-4 bg-gray-800/50 border border-gray-700 rounded-lg"
                >
                  <div className="text-6xl">{item.image}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">{item.name}</h3>
                    <p className="text-blue-400 font-semibold">{item.price}</p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded transition"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded transition"
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right min-w-[100px]">
                    <p className="text-sm text-gray-400">Subtotal</p>
                    <p className="text-xl font-bold">
                      ${(
                        parseFloat(item.price.replace("$", "")) * item.quantity
                      ).toFixed(2)}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 sticky top-6">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6 pb-6 border-b border-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${(getTotalPrice() * 0.1).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-bold mb-8">
                <span>Total</span>
                <span>${(getTotalPrice() * 1.1).toFixed(2)}</span>
              </div>

              <Link
                to="/checkout"
                className="w-full block text-center bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 px-6 py-3 rounded-lg font-semibold transition"
              >
                Proceed to Checkout
              </Link>

              <Link
                to="/formal-wear"
                className="w-full block text-center mt-3 bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg transition"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
