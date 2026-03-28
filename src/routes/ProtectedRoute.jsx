import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ allowedRoles }) => {
  const { userInfo } = useSelector((state) => state.user) || {};
  const token = localStorage.getItem("token");
  const storedRole = localStorage.getItem("role");
  const role = storedRole || userInfo?.role;

  // Not logged in
  if (!token || !role) {
    return <Navigate to="/sign-in" replace />;
  }

  // Case-insensitive role check
  const isAllowed = allowedRoles.some(
    (r) => r.toLowerCase() === role.toLowerCase()
  );

  if (!isAllowed) {
    return <Navigate to="/unauthorized" replace />;
  }

  // ✅ Render protected routes
  return <Outlet />;
};

export default ProtectedRoute;
