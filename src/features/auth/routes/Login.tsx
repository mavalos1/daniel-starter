import { useNavigate } from "react-router-dom";

import Layout from "../components/Layout";
import LoginForm from "../components/LoginForm";

const Login: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout title="Login">
      <LoginForm onSuccess={() => navigate("/app")} />
    </Layout>
  );
};

export default Login;
