import { lazy } from "react";
import useAuth from "@/hooks/useAuth";

const ProtectedRoutes = lazy(() => import("./ProtectedRoutes"));
const PublicRoutes = lazy(() => import("./PublicRoutes"));

const AppRoutes: React.FC = () => {
  const auth = useAuth();

  return auth.user ? <ProtectedRoutes /> : <PublicRoutes />;
};

export default AppRoutes;
