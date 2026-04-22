export type UserProfile = {
  id: string;
  full_name: string;
  avatar: string;
};

export type User = {
  id: string;
  email: string;
  profile: UserProfile;
  role: string;
  is_verified: boolean;
};

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

export type AuthSession = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
};
