import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await api.get("/auth/profile");
        // console.log(res.data);

        if (isMounted) {
          setUser(res.data.data);
        }
      } catch (err) {
        console.log("Profile error:", err.response?.status);

        if (err.response?.status === 401) {
          logout();
          navigate("/login");
        }
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, []);

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

  if (!user) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Profile */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6">
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-4xl font-bold shadow-lg shadow-blue-200">
          {user?.username?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{user.full_name}</h1>
          <p className="text-gray-500 italic">@{user.username}</p>
          <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Verified Account
          </div>
        </div>
      </div>

      {/* Details Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">
            Personal Information
          </h2>
          <button className="text-sm text-blue-600 hover:underline font-medium">
            Edit Info
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">
              Full Name
            </p>
            <p className="text-gray-700 font-semibold text-lg">
              {user.full_name}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">
              Username
            </p>
            <p className="text-gray-700 font-semibold text-lg">
              {user.username}
            </p>
          </div>

          <div className="space-y-1 md:col-span-2">
            <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">
              Email Address
            </p>
            <p className="text-gray-700 font-semibold text-lg">{user.email}</p>
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-50 flex justify-end gap-3">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-2.5 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-xl font-bold transition-all duration-200 border border-red-100 shadow-sm"
          >
            Logout From Session
          </button>
        </div>
      </div>

      {/* Info tambahan (opsional) */}
      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
        <div className="text-blue-500 mt-0.5">ℹ️</div>
        <p className="text-sm text-blue-700">
          This is a private profile page. Your information is secure and only
          visible to you.
        </p>
      </div>
    </div>
  );
}
