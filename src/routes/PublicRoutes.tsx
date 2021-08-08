import { Routes, Route, Navigate } from "react-router-dom";
import { AuthRoutes } from "@/features/auth";

export const PublicRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/auth/*" element={<AuthRoutes />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default PublicRoutes;
