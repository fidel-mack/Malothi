import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";

const products = [
  { id: 1, name: "Wool Socks", price: "$12.99", image: "🧦" },
  { id: 2, name: "Cotton Socks", price: "$9.99", image: "🧦" },
  { id: 3, name: "Athletic Socks", price: "$14.99", image: "🧦" },
  { id: 4, name: "Dress Socks", price: "$10.99", image: "🧦" },
  { id: 5, name: "Thermal Socks", price: "$15.99", image: "🧦" },
  { id: 6, name: "Casual Socks", price: "$8.99", image: "🧦" },
  { id: 7, name: "Compression Socks", price: "$19.99", image: "🧦" },
  { id: 8, name: "Bamboo Socks", price: "$13.99", image: "🧦" },
  { id: 9, name: "Fuzzy Socks", price: "$11.99", image: "🧦" },
];

export default function Socks() {
  const { user } = useAuth();
  const { addToCart, cart } = useCart();

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
          <Link to="/cart" className="relative bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2">
            🛒 Cart
            {cart.length > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </Link>
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

      {/* Category Navigation */}
      <div className="flex gap-4 p-6 max-w-7xl mx-auto border-b border-gray-700">
        <Link to="/formal-wear" className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg">Formal Wear</Link>
        <Link to="/dresses" className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg">Dresses</Link>
        <Link to="/shoes" className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg">Shoes</Link>
        <Link to="/socks" className="px-4 py-2 bg-green-600 rounded-lg">Socks</Link>
      </div>

      {/* Title Section */}
      <section className="py-12 px-6 max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold mb-2">🧦 Socks</h1>
        <p className="text-gray-300 text-lg">Comfortable socks for all activities and seasons</p>
      </section>

      {/* Products Grid */}
      <section className="px-6 pb-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative overflow-hidden rounded-lg border border-gray-700 hover:border-green-500 transition bg-gray-800/50 hover:bg-gray-800 cursor-pointer"
            >
              <div className="h-48 flex items-center justify-center text-6xl bg-gradient-to-br from-green-600/20 to-teal-600/20">
                {product.image}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2">{product.name}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-green-400 font-semibold">{product.price}</span>
                  <button 
                    onClick={() => addToCart(product)}
                    className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded transition text-sm"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
