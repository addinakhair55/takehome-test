import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import api from "../api/axios";

export default function EditProfile({ onClose }) {
  const { user, setUser } = useContext(AuthContext);
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const res = await api.put("/profile", form);
      setUser(res.data.user);
      setMessage(res.data.message);
      setTimeout(() => onClose(), 1500); 
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="w-full mt-2 p-2 sm:p-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
        <div>
          <label htmlFor="name" className="block text-gray-700 text-sm sm:text-base font-medium mb-1">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition text-sm sm:text-base"
            placeholder="Enter your name"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-gray-700 text-sm sm:text-base font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition text-sm sm:text-base"
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
          >
            Update Profile
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-300 text-gray-800 py-2 sm:py-3 rounded-lg hover:bg-gray-400 transition focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm sm:text-base"
          >
            Cancel
          </button>
        </div>
      </form>

      {message && (
        <p className="mt-4 text-center text-green-600 text-sm sm:text-base">{message}</p>
      )}
      {error && (
        <p className="mt-4 text-center text-red-600 text-sm sm:text-base">{error}</p>
      )}
    </div>
  );
}