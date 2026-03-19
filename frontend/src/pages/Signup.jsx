import { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { signup } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    type: "man",
    role: "CUSTOMER",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const user = await signup(form);
      
      // Redirect based on role
      if (user.role === "STORE_OWNER") {
        window.location.href = "/store/dashboard";
      } else if (user.role === "ADMIN") {
        window.location.href = "/dashboard/admin";
      } else {
        window.location.href = "/";
      }
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create Account">
      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full p-3 rounded-lg bg-white/20 text-white outline-none"
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full p-3 rounded-lg bg-white/20 text-white outline-none"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full p-3 rounded-lg bg-white/20 text-white outline-none"
          required
        />

        <label className="block text-sm font-semibold mt-4 mb-2">Account Type</label>
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="w-full p-3 rounded-lg bg-white/20 text-white outline-none mb-4"
        >
          <option value="CUSTOMER">👤 Customer - Shop & Browse</option>
          <option value="STORE_OWNER">🏪 Store Owner - Sell Products</option>
        </select>

        <label className="block text-sm font-semibold mb-2">I am a</label>
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="w-full p-3 rounded-lg bg-white/20 text-white outline-none"
        >
          <option value="child">👶 Child</option>
          <option value="man">👨 Man</option>
          <option value="woman">👩 Woman</option>
        </select>

        {error && (
          <p className="text-red-400 text-sm">
            {error}
          </p>
        )}

        <button 
          disabled={loading}
          className={`w-full p-3 rounded-lg text-white transition ${
            loading
              ? "bg-gray-500"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>
    </AuthLayout>
  );
}