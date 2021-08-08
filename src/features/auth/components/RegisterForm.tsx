import { Link } from "react-router-dom";

type RegisterValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type LoginFormProps = {
  onSuccess: () => void;
};

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => (
  <>
    <Link to="../login">Login</Link>
  </>
);

export default LoginForm;
