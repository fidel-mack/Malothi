import { useAuth } from "../context/AuthContext";

export default function RoleRoute({ role, children }) {
  const { user } = useAuth();

  if (!user || user.role !== role) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400">Access Denied</h1>
          <p className="mt-2">You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return children;
}