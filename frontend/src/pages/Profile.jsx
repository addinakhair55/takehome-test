import { useState, useContext } from "react";
import { HiPencilAlt } from "react-icons/hi";
import AuthContext from "../context/AuthContext";
import EditProfile from "./EditProfile";
import ChangePassword from "./ChangePassword";

export default function Profile() {
  const { user } = useContext(AuthContext);
  const [mode, setMode] = useState("view");

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8 font-sans">
      <div className="w-full flex flex-col gap-6">
        <div className="rounded-xl shadow-lg bg-white p-4 sm:p-6 lg:p-8 transition-all">
          {/* Header */}
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
              {mode === "view" && "Profile"}
              {mode === "edit" && "Edit Profile"}
              {mode === "password" && "Change Password"}
            </h2>
            {mode === "view" && (
              <button
                onClick={() => setMode("edit")}
                className="text-gray-600 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
                aria-label="Edit Profile"
              >
                <HiPencilAlt size={24} />
              </button>
            )}
          </div>

          {/* View Mode */}
          {mode === "view" && (
            <div className="space-y-4 sm:space-y-6 text-gray-700 text-sm sm:text-base">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                <span className="font-medium">Name:</span>
                <span>{user?.name || "Not provided"}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                <span className="font-medium">Email:</span>
                <span>{user?.email || "Not provided"}</span>
              </div>
              <button
                onClick={() => setMode("password")}
                className="w-full sm:w-auto mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Change Password
              </button>
            </div>
          )}

          {/* Edit Profile */}
          {mode === "edit" && <EditProfile onClose={() => setMode("view")} />}

          {/* Change Password */}
          {mode === "password" && <ChangePassword onClose={() => setMode("view")} />}
        </div>
      </div>
    </div>
  );
}