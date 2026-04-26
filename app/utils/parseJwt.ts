import type { UserRole } from "cv-graphql";

export type JwtPayload = {
  sub: number;
  email: string;
  exp: number;
  role: UserRole;
};
export const parseJwt = (token: string): JwtPayload | null => {
  const baseUrl = token.split(".")[1];

  if (!baseUrl) return null;
  const base64 = baseUrl.replace(/-/g, "+".replace(/_/g, "/"));
  const payload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map((char) => "%" + ("00" + char.charCodeAt(0).toString(16)).slice(-2))
      .join(""),
  );
  return JSON.parse(payload);
};
