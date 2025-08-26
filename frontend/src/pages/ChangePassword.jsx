import { useState } from "react";
import api from "../api/axios";

export default function ChangePassword({ onClose }) {
  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const res = await api.put("/change-password", form);
      setMessage(res.data.message);
      setForm({ current_password: "", new_password: "", new_password_confirmation: "" });
      setTimeout(() => onClose(), 1500); // Auto-close after success
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="w-full mt-2 p-2 sm:p-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
        <div>
          <label
            htmlFor="current_password"
            className="block text-gray-700 text-sm sm:text-base font-medium mb-1"
          >
            Current Password
          </label>
          <input
            id="current_password"
            type="password"
            value={form.current_password}
            onChange={(e) => setForm({ ...form, current_password: e.target.value })}
            className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition text-sm sm:text-base"
            placeholder="Enter current password"
            required
          />
        </div>

        <div>
          <label
            htmlFor="new_password"
            className="block text-gray-700 text-sm sm:text-base font-medium mb-1"
          >
            New Password
          </label>
          <input
            id="new_password"
            type="password"
            value={form.new_password}
            onChange={(e) => setForm({ ...form, new_password: e.target.value })}
            className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition text-sm sm:text-base"
            placeholder="Enter new password"
            required
          />
        </div>

        <div>
          <label
            htmlFor="new_password_confirmation"
            className="block text-gray-700 text-sm sm:text-base font-medium mb-1"
          >
            Confirm New Password
          </label>
          <input
            id="new_password_confirmation"
            type="password"
            value={form.new_password_confirmation}
            onChange={(e) => setForm({ ...form, new_password_confirmation: e.target.value })}
            className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition text-sm sm:text-base"
            placeholder="Confirm new password"
            required
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-4">
          <button
            type="submit"
            className="flex-1 bg-green-600 text-white py-2 sm:py-3 rounded-lg hover:bg-green-700 transition focus:outline-none focus:ring-2 focus:ring-green-400 text-sm sm:text-base"
          >
            Change Password
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