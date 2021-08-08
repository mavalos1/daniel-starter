import React, { useState, createContext } from "react";
import {
  AuthUser,
  LoginCredentials,
  RegisterCredentials,
  ResetEmailCredentials,
} from "../types";
import {
  handleUserResponse,
  loginWithEmailAndPassword,
  registerWithEmailAndPassword,
  logUserOut,
} from "../api";

// user states: logged-in, logged-out, unknown
export type UserState = AuthUser | false | null;

export type UseAuthProps = {
  user: UserState;
  login: (data: LoginCredentials) => Promise<void>;
  register: (data: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  sendPasswordResetEmail: (data: ResetEmailCredentials) => Promise<void>;
};

const useAuth = (): UseAuthProps => {
  const [user, setUser] = useState<UserState>(null);

  async function login(data: LoginCredentials): Promise<void> {
    const response = await loginWithEmailAndPassword(data);
    const user = await handleUserResponse(response);

    setUser(user);
  }

  async function register(data: RegisterCredentials): Promise<void> {
    const response = await registerWithEmailAndPassword(data);
    const user = await handleUserResponse(response);

    setUser(user);
  }

  async function logout(): Promise<void> {
    await logUserOut();
    setUser(false);
  }

  async function sendPasswordResetEmail(
    data: ResetEmailCredentials
  ): Promise<void> {
    await sendPasswordResetEmail(data);
  }

  return {
    user,
    login,
    register,
    logout,
    sendPasswordResetEmail,
  };
};

export const AuthContext = createContext<UseAuthProps | undefined>(undefined);

export const AuthProvider: React.FC = ({ children }) => {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export default useAuth;
