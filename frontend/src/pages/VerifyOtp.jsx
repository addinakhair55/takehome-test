import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { HiOutlineMail, HiOutlineLockClosed } from "react-icons/hi";
import api from "../api/axios";

export default function VerifyOtp() {
  const [form, setForm] = useState({ email: "", otp_code: "" });
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({ otp_code: "" });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.email) {
      setForm((prev) => ({ ...prev, email: location.state.email }));
    }
  }, [location.state]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { otp_code: "" };
    if (!form.otp_code.trim()) {
      newErrors.otp_code = "Kode OTP wajib diisi";
      isValid = false;
    } else if (!/^\d{6}$/.test(form.otp_code)) {
      newErrors.otp_code = "Kode OTP harus 6 digit angka";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!validateForm()) {
      setMessage("Periksa kesalahan pada form");
      return;
    }

    try {
      const response = await api.post("/verify-otp", form);
      localStorage.setItem("token", response.data.token);
      navigate("/login");
    } catch (err) {
      setMessage(err.response?.data?.message || "Terjadi kesalahan");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl shadow-lg w-full max-w-md p-10 flex flex-col animate-fadeIn"
      >
        <h2 className="text-4xl font-bold text-blue-900 text-center mb-8">
          Verify OTP
        </h2>

        {/* Email read-only */}
        <div className="flex flex-col mb-5 relative">
          <label className="text-gray-500 mb-2 text-sm" htmlFor="email">
            Email Address
          </label>
          <div className="relative">
            <HiOutlineMail className="absolute top-4 left-3 text-blue-400" />
            <input
              id="email"
              type="email"
              value={form.email}
              readOnly
              className="pl-10 w-full border border-blue-200 rounded-xl p-3 bg-gray-100 focus:outline-none"
            />
          </div>
        </div>

        {/* OTP input */}
        <div className="flex flex-col mb-6 relative">
          <label className="text-gray-500 mb-2 text-sm" htmlFor="otp_code">
            OTP Code
          </label>
          <div className="relative">
            <HiOutlineLockClosed className="absolute top-4 left-3 text-blue-400" />
            <input
              id="otp_code"
              type="text"
              placeholder="6-digit OTP"
              className="pl-10 w-full border border-blue-200 rounded-xl p-3 focus:outline-none"
              onChange={(e) => setForm({ ...form, otp_code: e.target.value })}
            />
          </div>
          {errors.otp_code && (
            <p className="text-red-500 text-sm mt-1">{errors.otp_code}</p>
          )}
        </div>

        <button className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600">
          Verify
        </button>

        {message && <p className="text-center text-red-500 text-sm mt-4">{message}</p>}
      </form>
    </div>
  );
}
