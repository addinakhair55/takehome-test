import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import AuthContext from "../context/AuthContext";
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "", global: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = { email: "", password: "", global: "" };
    let hasError = false;

    if (!form.email) {
      newErrors.email = "Emain is required!";
      hasError = true;
    }
    if (!form.password) {
      newErrors.password = "Password is required!";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    try {
      const userData = await login(form.email, form.password); 
      setErrors({ email: "", password: "", global: "" }); 

      if (userData.role === "admin") {
        navigate("/products"); 
      } else {
        navigate("/products"); 
      }
    } catch (err) {
      setErrors({
        ...newErrors,
        global: err.response?.data?.message || "An error occurred"
      });
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
          Sign In
        </h2>

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
              className={`pl-10 w-full border rounded-xl p-3 focus:outline-none focus:ring-2 transition shadow-sm hover:shadow-md ${
                errors.email
                  ? "border-red-400 focus:ring-red-400"
                  : "border-blue-200 focus:ring-blue-400 focus:border-blue-400"
              }`}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

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
              className={`pl-10 pr-10 w-full border rounded-xl p-3 focus:outline-none focus:ring-2 transition shadow-sm hover:shadow-md ${
                errors.password
                  ? "border-red-400 focus:ring-red-400"
                  : "border-blue-200 focus:ring-blue-400 focus:border-blue-400"
              }`}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button
              type="button"
              className="absolute top-4 right-3 text-blue-400 focus:outline-none"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        <button className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition-all transform hover:scale-105 shadow-md">
          Login
        </button>

        <p className="text-center text-gray-500 text-sm mt-4">
          Don't have an account yet?{" "}
          <Link to="/register" className="text-blue-500 font-semibold hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
