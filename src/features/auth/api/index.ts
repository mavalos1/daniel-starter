import axios from "@/lib/axios";
import storage from "@/utils/storage";
import {
  LoginCredentials,
  UserResponse,
  RegisterCredentials,
  AuthUser,
  ResetEmailCredentials,
} from "../types";

export const loginWithEmailAndPassword = (
  data: LoginCredentials
): Promise<UserResponse> => {
  return axios.post("/auth/login", data);
};

export const registerWithEmailAndPassword = (
  data: RegisterCredentials
): Promise<UserResponse> => {
  return axios.post("/auth/register", data);
};

export const getUserProfile = (): Promise<AuthUser> => {
  return axios.get("/auth/me");
};

export const logUserOut = (): void => {
  storage.clearToken();
  window.location.assign(window.location.origin as unknown as string);
};

export const sendPasswordResetEmail = (
  data: ResetEmailCredentials
): Promise<void> => {
  return axios.post("/auth/forgot-password", data);
};

export const handleUserResponse = (data: UserResponse): AuthUser => {
  const { jwt, user } = data;
  storage.setToken(jwt);

  return user;
};
