import type { User } from "~/types/auth";

export type AuthResponse = {
  user: User;
  access_token: string;
  refresh_token: string;
};

export type AuthQuery = {
  login: AuthResponse;
};

export type AuthMutation = {
  signup: AuthResponse;
};

export type AuthInput = {
  email: string;
  password: string;
};

export type AuthVariables = {
  auth: AuthInput;
};

export type ResetPasswordInput = {
  newPassword: string;
};

export type ForgotPassportInput = {
  email: string;
};
