import { useAuth } from "../../context/AuthContext";

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-black text-white p-10">
      
      <h1 className="text-3xl font-bold text-red-400">
        🛠️ Admin Dashboard
      </h1>

      <div className="mt-6 p-5 bg-white/10 rounded-xl">
        <p><strong>Admin:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Role:</strong> {user?.role}</p>
      </div>

      <div className="mt-8 space-y-3">
        <button className="bg-blue-500 px-4 py-2 rounded w-full">
          View Users
        </button>

        <button className="bg-green-500 px-4 py-2 rounded w-full">
          System Stats
        </button>

        <button
          onClick={logout}
          className="bg-red-600 px-4 py-2 rounded w-full"
        >
          Logout
        </button>
      </div>
    </div>
  );
}