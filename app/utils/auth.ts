import type { AuthSession } from "~/types/auth";
import type { AuthInput, AuthResponse } from "~/graphql/auth/types";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export function createAuthVariables(
  email: string,
  password: string,
): {
  auth: AuthInput;
} {
  return {
    auth: {
      email,
      password,
    },
  };
}

export function createAuthSession(data: AuthResponse): AuthSession {
  return {
    user: data.user,
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
  };
}

export function persistAuthTokens(session: AuthSession): void {
  if (!session.accessToken || !session.refreshToken || import.meta.server) {
    return;
  }

  localStorage.setItem(ACCESS_TOKEN_KEY, session.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, session.refreshToken);
}

export function clearPersistedAuthTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}
