import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import api from "../services/api";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error(err);
    } finally {
      logout();
      navigate("/login");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col p-6 shadow-xl">
        <div className="mb-10 text-center border-b border-slate-700 pb-4">
          <h2 className="text-2xl font-bold tracking-tight text-blue-400">
            My Dashboard
          </h2>
        </div>

        <nav className="flex-1">
          <ul className="space-y-2">
            <li>
              <Link
                to="/dashboard"
                className="block py-3 px-4 rounded-lg hover:bg-slate-800 transition-colors"
              >
                🏠 Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/profile"
                className="block py-3 px-4 rounded-lg hover:bg-slate-800 transition-colors"
              >
                👤 Profile
              </Link>
            </li>
          </ul>
        </nav>

        <button
          onClick={handleLogout}
          className="mt-auto bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-semibold transition-all"
        >
          Logout
        </button>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8">
          <h1 className="text-lg font-medium text-gray-700 underline decoration-blue-500 decoration-2 underline-offset-4">
            Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <div className="text-right flex flex-row">
              <p className="text-sm text-gray-500">Welcome back, </p>
              {/* Menampilkan nama user secara dinamis */}
              <p className="text-sm font-bold text-gray-800">
                {user?.full_name || user?.username || "Guest"}
              </p>
            </div>

            {/* Avatar Dinamis */}
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shadow-md">
              {user?.username?.charAt(0).toUpperCase() || "U"}
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
