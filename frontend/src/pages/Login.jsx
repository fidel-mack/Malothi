import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(form.email, form.password);

      // Get user from localStorage to check role
      const user = JSON.parse(localStorage.getItem("user"));
      if (user.role === "STORE_OWNER") {
        window.location.href = "/store/dashboard";
      } else if (user.role === "ADMIN") {
        window.location.href = "/dashboard/admin";
      } else {
        window.location.href = "/";
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Login failed. Check backend connection."
      );
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome Back">
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* EMAIL */}
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-white/20 text-white outline-none"
        />

        {/* PASSWORD */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-white/20 text-white outline-none"
        />

        {/* ERROR MESSAGE */}
        {error && (
          <p className="text-red-400 text-sm">
            {error}
          </p>
        )}

        {/* BUTTON */}
        <button
          disabled={loading}
          className={`w-full p-3 rounded-lg text-white transition ${
            loading
              ? "bg-gray-500"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* SIGNUP LINK */}
        <p className="text-center text-white text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-400 hover:underline">
            Sign Up
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}