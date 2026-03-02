import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email] = useState(location.state?.email || "");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      return setError("OTP must be 6 digits");
    }

    if (password.length < 8) {
      return setError("Password must be at least 8 characters");
    }

    if (password !== confirmPassword) {
      return setError("Password confirmation does not match");
    }

    try {
      await api.post("/auth/reset-password", {
        email,
        otp_code: otpCode,
        new_password: password,
      });

      setMessage("Password updated successfully");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.error?.message || "Failed to update password",
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600">
      <form
        onSubmit={submit}
        className="bg-white p-8 rounded-3xl w-full max-w-md space-y-6 shadow-xl"
      >
        <h1 className="text-2xl font-bold text-center">Verify OTP</h1>

        {/* OTP BOXES */}
        <div className="flex justify-center gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleOtpChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-12 text-center text-lg border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>

        <input
          type="password"
          placeholder="New Password"
          className="w-full border rounded-xl px-4 py-3 outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirm New Password"
          className="w-full border rounded-xl px-4 py-3 outline-none"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        {message && (
          <p className="text-green-500 text-sm text-center">{message}</p>
        )}

        <button className="w-full py-3 bg-black text-white rounded-xl">
          Change Password
        </button>
      </form>
    </div>
  );
}
