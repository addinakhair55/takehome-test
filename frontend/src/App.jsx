import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";

import Register from "./pages/Register";
import Login from "./pages/Login";
import VerifyOtp from "./pages/VerifyOtp";
import EditProfile from "./pages/EditProfile";
import ChangePassword from "./pages/ChangePassword";
import Profile from "./pages/Profile";
import Products from "./pages/Products";

import DashboardLayout from "./layouts/DashboardLayout";

export default function App() {
  const protectedRoutes = [
    { path: "/profile", element: <Profile /> },
    { path: "/edit-profile", element: <EditProfile /> },
    { path: "/change-password", element: <ChangePassword /> },
    { path: "/products", element: <Products /> },
  ];

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />

          {protectedRoutes.map(({ path, element }) => (
            <Route
              key={path}
              path={path}
              element={
                <ProtectedRoute>
                  <DashboardLayout>{element}</DashboardLayout>
                </ProtectedRoute>
              }
            />
          ))}

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
