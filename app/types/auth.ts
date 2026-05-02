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

export type AuthSession = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
};

export enum UserRole {
  Employee = "Employee",
  Admin = "Admin",
}
