import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
} from "react-icons/hi";
import api from "../api/axios";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({ name: "", email: "", password: "", global: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: "", email: "", password: "", global: "" };

    if (!form.name.trim()) {
      newErrors.name = "Full name is required!";
      isValid = false;
    }
    if (!form.email.trim()) {
      newErrors.email = "Email is required!";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Invalid email format!";
      isValid = false;
    }
    if (!form.password) {
      newErrors.password = "Password is required!";
      isValid = false;
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ name: "", email: "", password: "", global: "" });

    if (!validateForm()) {
      return;
    }

    try {
      await api.post("/register", form);
      navigate("/verify-otp", { state: { email: form.email } });
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        global: err.response?.data?.message || "An error occurred.",
      }));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl shadow-lg w-full max-w-md p-10 flex flex-col animate-fadeIn"
      >
        {errors.global && (
          <p className="text-center text-red-500 text-sm mb-4">{errors.global}</p>
        )}

        <h2 className="text-4xl font-bold text-blue-900 text-center mb-8">
          Sign Up
        </h2>

        {/* Full Name */}
        <div className="flex flex-col mb-5 relative">
          <label className="text-gray-500 mb-2 text-sm" htmlFor="name">
            Full Name
          </label>
          <div className="relative">
            <HiOutlineUser className="absolute top-4 left-3 text-blue-400" />
            <input
              id="name"
              type="text"
              placeholder="Your Name"
              className={`pl-10 w-full border rounded-xl p-3 focus:outline-none ${
                errors.name
                  ? "border-red-400 focus:ring-red-400"
                  : "border-blue-200 focus:ring-blue-400 focus:border-blue-400"
              }`}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Email */}
        <div className="flex flex-col mb-5 relative">
          <label className="text-gray-500 mb-2 text-sm" htmlFor="email">
            Email Address
          </label>
          <div className="relative">
            <HiOutlineMail className="absolute top-4 left-3 text-blue-400" />
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className={`pl-10 w-full border rounded-xl p-3 focus:outline-none ${
                errors.email
                  ? "border-red-400 focus:ring-red-400"
                  : "border-blue-200 focus:ring-blue-400 focus:border-blue-400"
              }`}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Password */}
        <div className="flex flex-col mb-6 relative">
          <label className="text-gray-500 mb-2 text-sm" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <HiOutlineLockClosed className="absolute top-4 left-3 text-blue-400" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className={`pl-10 pr-10 w-full border rounded-xl p-3 focus:outline-none ${
                errors.password
                  ? "border-red-400 focus:ring-red-400"
                  : "border-blue-200 focus:ring-blue-400 focus:border-blue-400"
              }`}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button
              type="button"
              className="absolute top-4 right-3 text-blue-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        <button className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600">
          Register
        </button>

        <p className="text-center text-gray-500 text-sm mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
}
