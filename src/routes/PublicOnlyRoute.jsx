import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PageLoader from "../components/common/PageLoader";
import { DASHBOARD_PATH } from "../utils/constants";

export default function PublicOnlyRoute() {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  if (isAuthenticated) {
    return <Navigate to={DASHBOARD_PATH[role] || "/"} replace />;
  }

  return <Outlet />;
}
