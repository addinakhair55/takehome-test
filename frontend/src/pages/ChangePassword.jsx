import { useState } from "react";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import api from "../api/axios";

export default function ChangePassword({ onClose }) {
  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });
  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({}); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setFieldErrors({});

    const errors = {};
    if (!form.current_password) errors.current_password = "Current password is required";
    if (!form.new_password) errors.new_password = "New password is required";
    if (!form.new_password_confirmation)
      errors.new_password_confirmation = "Confirm password is required";

    if (form.new_password && form.new_password_confirmation && form.new_password !== form.new_password_confirmation) {
      errors.new_password_confirmation = "New password and confirmation do not match";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      const res = await api.put("/change-password", form);
      setMessage(res.data.message);
      setForm({ current_password: "", new_password: "", new_password_confirmation: "" });
      setTimeout(() => onClose(), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    }
  };

  const renderPasswordInput = (id, label, value, onChange, visible, toggle, errorMsg) => (
    <div className="mb-1">
      <label
        htmlFor={id}
        className="block text-gray-700 text-sm sm:text-base font-medium mb-1"
      >
        {label}
      </label>
      <div
        className={`flex items-center rounded-lg transition 
          text-sm sm:text-base border 
          ${errorMsg 
            ? "border-red-500 focus-within:ring-red-400 focus-within:border-red-400" 
            : "border-gray-300 focus-within:ring-blue-400 focus-within:border-blue-400"
          }`}
      >
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          className="flex-1 p-2 sm:p-3 focus:outline-none rounded-l-lg"
          placeholder={`Enter ${label.toLowerCase()}`}
        />
        <button
          type="button"
          onClick={toggle}
          className="px-3 text-gray-500 hover:text-gray-700 flex items-center justify-center"
          tabIndex={-1}
        >
          {visible ? <HiOutlineEyeOff size={20} /> : <HiOutlineEye size={20} />}
        </button>
      </div>
      {errorMsg && (
        <p className="text-red-500 text-xs mt-1">{errorMsg}</p>
      )}
    </div>
  );

  return (
    <div className="w-full mt-2 p-2 sm:p-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
        {renderPasswordInput(
          "current_password",
          "Current Password",
          form.current_password,
          (e) => setForm({ ...form, current_password: e.target.value }),
          show.current,
          () => setShow({ ...show, current: !show.current }),
          fieldErrors.current_password
        )}

        {renderPasswordInput(
          "new_password",
          "New Password",
          form.new_password,
          (e) => setForm({ ...form, new_password: e.target.value }),
          show.new,
          () => setShow({ ...show, new: !show.new }),
          fieldErrors.new_password
        )}

        {renderPasswordInput(
          "new_password_confirmation",
          "Confirm New Password",
          form.new_password_confirmation,
          (e) => setForm({ ...form, new_password_confirmation: e.target.value }),
          show.confirm,
          () => setShow({ ...show, confirm: !show.confirm }),
          fieldErrors.new_password_confirmation
        )}

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
