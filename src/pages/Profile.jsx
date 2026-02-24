import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  /* =============================
     FETCH PROFILE
  ============================= */
  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      try {
        const res = await api.get("/auth/profile");

        if (isMounted) {
          setUser(res.data.data);
          setUsername(res.data.data.username);
        }
      } catch (err) {
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

  // update profil

  const handleUpdate = async () => {
    try {
      setLoadingUpdate(true);

      const res = await api.put("/auth/profile", {
        username,
        password,
      });

      setUser(res.data.data);
      setIsEditing(false);
      setPassword("");
    } catch (err) {
      console.error("Update gagal:", err);
    } finally {
      setLoadingUpdate(false);
    }
  };

  /* =============================
     LOGOUT
  ============================= */
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
      {/* HEADER */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border flex items-center gap-6">
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-4xl font-bold">
          {user.username.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{user.full_name}</h1>
          <p className="text-gray-500 italic">@{user.username}</p>
        </div>
      </div>

      {/* PERSONAL INFO */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-gray-800 text-lg font-semibold">
            Personal Information
          </h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-sm text-blue-600 hover:underline font-medium"
          >
            {isEditing ? "Cancel" : "Edit Info"}
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Username */}
          <div>
            <p className="text-sm text-gray-400 uppercase">Username</p>

            {isEditing ? (
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 w-full border rounded-lg px-3 py-2"
              />
            ) : (
              <p className="text-gray-800 font-semibold text-lg">
                {user.username}
              </p>
            )}
          </div>

          {/* Fullname */}
          <div>
            <p className="text-sm text-gray-400 uppercase">Fullname</p>
            <p className="text-gray-800 font-semibold text-lg">
              {user.full_name}
            </p>
          </div>

          {/* Email */}
          <div>
            <p className="text-sm text-gray-400 uppercase">Email</p>
            <p className="text-gray-800 font-semibold text-lg">{user.email}</p>
          </div>

          {/* Password (edit only) */}
          {isEditing && (
            <div>
              <p className="text-sm text-gray-400 uppercase">New Password</p>
              <input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full border rounded-lg px-3 py-2"
              />
            </div>
          )}
        </div>

        {isEditing && (
          <div className="p-6 bg-gray-50 border-t flex justify-end gap-3">
            <button
              onClick={handleUpdate}
              disabled={loadingUpdate}
              className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
            >
              {loadingUpdate ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}

        <div className="p-6 border-t flex justify-end">
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
