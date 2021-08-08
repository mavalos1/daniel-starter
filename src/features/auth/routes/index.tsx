import { Route, Routes } from "react-router-dom";

import Login from "./Login";
import Register from "./Register";

export const AuthRoutes: React.FC = () => (
  <Routes>
    <Route path="register" element={<Register />} />
    <Route path="login" element={<Login />} />
  </Routes>
);

export default AuthRoutes;
