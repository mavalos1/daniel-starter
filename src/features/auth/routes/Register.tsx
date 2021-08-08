import { useNavigate } from "react-router-dom";

import Layout from "../components/Layout";
import RegisterForm from "../components/RegisterForm";

const Register: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout title="Register">
      <RegisterForm onSuccess={() => navigate("/app")} />
    </Layout>
  );
};

export default Register;
