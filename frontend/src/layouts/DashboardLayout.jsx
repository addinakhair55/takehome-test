import { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { HiMenuAlt3 } from "react-icons/hi";
import AuthContext from "../context/AuthContext";

export default function DashboardLayout({ children }) {
  const { logout } = useContext(AuthContext);
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { name: "Profile", path: "/profile" },
    { name: "Products", path: "/products" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <div
        className={`hidden md:flex flex-col bg-white shadow-md transition-all duration-300 min-h-screen ${
          collapsed ? "w-16" : "w-64 md:w-56 lg:w-64"
        }`}
      >
        <div className="flex items-center justify-between p-3 md:p-4">
          {!collapsed && (
            <span className="font-bold text-base md:text-lg text-blue-600">
              Dashboard
            </span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-600 hover:text-gray-900"
            aria-label="Toggle sidebar"
          >
            <HiMenuAlt3 size={20} className="md:w-6 md:h-6" />
          </button>
        </div>

        <div className="flex-1 flex flex-col p-2 md:p-3">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-2 py-1.5 md:px-3 md:py-2 rounded-lg font-medium text-xs md:text-sm hover:bg-blue-100 transition ${
                  location.pathname === item.path
                    ? "bg-blue-500 text-white"
                    : "text-gray-700"
                }`}
              >
                {collapsed ? item.name[0] : item.name}
              </Link>
            ))}
          </nav>
          <button
            onClick={logout}
            className="mt-auto px-2 py-1.5 md:px-3 md:py-2 rounded-lg bg-red-500 text-white text-xs md:text-sm hover:bg-red-600 transition text-left"
          >
            {collapsed ? "Out" : "Logout"}
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-40 md:hidden transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div
          className="absolute inset-0 bg-black opacity-50"
          onClick={() => setMobileOpen(false)}
        ></div>
        <div className="relative bg-white w-3/4 max-w-64 min-h-screen shadow-md p-4 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <span className="font-bold text-lg text-blue-600">Dashboard</span>
            <button
              onClick={() => setMobileOpen(false)}
              className="text-gray-600 hover:text-gray-900"
              aria-label="Close sidebar"
            >
              <span className="text-xl font-bold">×</span>
            </button>
          </div>

          <div className="flex-1 flex flex-col">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`px-3 py-2 rounded-lg font-medium text-sm hover:bg-blue-100 transition ${
                    location.pathname === item.path
                      ? "bg-blue-500 text-white"
                      : "text-gray-700"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            <button
              onClick={logout}
              className="mt-auto px-3 py-2 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="md:hidden flex items-center justify-between bg-white shadow-md p-3 w-full fixed top-0 left-0 z-30">
        <span className="font-bold text-base text-blue-600">Dashboard</span>
        <button
          onClick={() => setMobileOpen(true)}
          className="text-gray-600 hover:text-gray-900"
          aria-label="Open sidebar"
        >
          <HiMenuAlt3 size={20} />
        </button>
      </div>

      <div className="flex-1 md:p-6 mt-14 md:mt-0">
        {children}
      </div>
    </div>
  );
}