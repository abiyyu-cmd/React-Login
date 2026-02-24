import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuthStore } from "../store/authStore";
import { setToken } from "../utils/token";

import { MdOutlineMailOutline } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import { Sparkles } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    setError("");

    if (!form.email.includes("@")) {
      return setError("Invalid email");
    }

    if (form.password.length < 8) {
      return setError("Password must be at least 8 characters");
    }
    try {
      setLoading(true);

      const res = await api.post("/user/login", {
        email: form.email,
        password: form.password,
      });

      const data = res.data.data;

      const user = {
        username: data.username,
        email: data.email,
      };

      const accessToken = data.access_token;
      const refreshToken = data.refresh_token;

      // simpan ke zustand
      setAuth({ user, accessToken, refreshToken });

      // simpan ke localStorage
      setToken(accessToken, refreshToken);

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error || "Login gagal. Cek email atau password.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600">
      <form
        onSubmit={submit}
        autoComplete="on"
        className="bg-white p-8 rounded-3xl w-full max-w-md space-y-5 shadow-xl"
      >
        <div className="text-center mb-6">
          <Sparkles className="mx-auto mb-3" />
          <h1 className="text-3xl font-bold">Welcome Back</h1>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Email</label>
          <div className="flex items-center gap-3 border rounded-xl px-4 py-3">
            <MdOutlineMailOutline />
            <input
              type="email"
              placeholder="Email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full outline-none"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            Password
          </label>
          <div className="flex items-center gap-3 border rounded-xl px-4 py-3">
            <TbLockPassword />
            <input
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full outline-none"
              required
            />
          </div>
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black hover:bg-gray-800 text-white active:scale-95 shadow-lg shadow-blue-200"
          }`}
        >
          {loading ? (
            <>
              {/* Animasi Spinner */}
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Authenticating...</span>
            </>
          ) : (
            "Login"
          )}
        </button>

        <p className="text-sm text-center">
          Don’t have an account? <Link to="/register">Sign Up</Link>
        </p>
      </form>
    </div>
  );
}
