import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import { FiMail } from "react-icons/fi";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      setLoading(true);
      await api.post("/auth/forgot-password", { email });
      setMessage("OTP sent to your email");

      setTimeout(() => {
        navigate("/reset-password", { state: { email } });
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.error?.message || "Failed to send OTP. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600">
      <form
        onSubmit={submit}
        className="bg-white p-8 rounded-3xl w-full max-w-md space-y-5 shadow-xl"
      >
        <h1 className="text-2xl font-bold text-center">Forgot Password</h1>
        <p className="text-sm text-gray-500 text-center">
          Enter your email and we will send you a verification code
        </p>

        <div className="relative">
          <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />

          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border rounded-xl px-4 py-3 pl-12 outline-none focus:ring-2 focus:ring-black/20 transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {message && (
          <p className="text-green-500 text-sm text-center">{message}</p>
        )}

        <button
          disabled={loading}
          className="w-full py-3 bg-black text-white rounded-xl hover:opacity-90 transition 
  disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Sending..." : "Send OTP"}
        </button>

        <p className="text-sm text-center text-gray-500">
          Remember your password?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-black font-medium cursor-pointer hover:underline"
          >
            Back to Login
          </span>
        </p>
      </form>
    </div>
  );
}
