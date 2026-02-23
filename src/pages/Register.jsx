import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

import { FiUser } from "react-icons/fi";
import { FaRegCircleUser } from "react-icons/fa6";
import { MdOutlineMailOutline } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import { Sparkles } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    full_name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post("/user/register", form);

      alert("Register berhasil! Silakan login.");
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || "Register gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600">
      <form
        onSubmit={submit}
        autoComplete="off"
        className="bg-white p-8 rounded-3xl w-full max-w-md space-y-2 shadow-xl"
      >
        <div className="text-center mb-6">
          <Sparkles className="mx-auto mb-3" />
          <h1 className="text-3xl font-bold">Create Account</h1>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            Username
          </label>
          <div className="flex items-center gap-3 border rounded-xl px-4 py-3">
            <FiUser />
            <input
              name="username"
              placeholder="Username"
              className="w-full outline-none"
              onChange={handleChange}
              value={form.username}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            Full Name
          </label>
          <div className="flex items-center gap-3 border rounded-xl px-4 py-3">
            <FaRegCircleUser />
            <input
              name="full_name"
              placeholder="Full Name"
              className="w-full outline-none"
              onChange={handleChange}
              value={form.full_name}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Email</label>
          <div className="flex items-center gap-3 border rounded-xl px-4 py-3">
            <MdOutlineMailOutline />
            <input
              name="email"
              type="email"
              placeholder="Email"
              className="w-full outline-none"
              onChange={handleChange}
              value={form.email}
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
              name="password"
              type="password"
              placeholder="Password"
              autoComplete="new-password"
              className="w-full outline-none"
              onChange={handleChange}
              value={form.password}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black hover:bg-gray-800 text-white active:scale-95 shadow-lg shadow-blue-200"
          }`}
        >
          {loading ? "Creating Account..." : "Register"}
        </button>

        <p className="text-sm text-center">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </form>
    </div>
  );
}
