import { Link } from "react-router-dom";

type LoginValues = {
  email: string;
  password: string;
};

export type LoginFormProps = {
  onSuccess: () => void;
};

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => (
  <>
    <Link to="../register">Register</Link>
  </>
);

export default LoginForm;
