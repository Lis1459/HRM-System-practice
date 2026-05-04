import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  createAuthVariables,
  createAuthSession,
  persistAuthTokens,
  clearPersistedAuthTokens,
} from "~/utils/auth";
import { UserRole, type AuthSession } from "~/types/auth";
import type { AuthResponse } from "~/graphql/auth/types";

describe("auth utils", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe("createAuthVariables", () => {
    it("should create auth variables with correct structure", () => {
      const email = "test@example.com";
      const password = "password123";

      const result = createAuthVariables(email, password);

      expect(result).toEqual({
        auth: {
          email,
          password,
        },
      });
    });

    it("should handle special characters in email and password", () => {
      const email = "test+special@example.com";
      const password = "p@ssw0rd!#$";

      const result = createAuthVariables(email, password);

      expect(result.auth.email).toBe(email);
      expect(result.auth.password).toBe(password);
    });
  });

  describe("createAuthSession", () => {
    it("should create auth session from API response", () => {
      const mockAuthResponse: AuthResponse = {
        user: {
          id: "1",
          email: "test@example.com",
          profile: {
            id: "1",
            full_name: "Test User",
            avatar: "avatar.jpg",
          },
          role: UserRole.Employee,
          is_verified: true,
        },
        access_token: "access123",
        refresh_token: "refresh123",
      };

      const session = createAuthSession(mockAuthResponse);

      expect(session).toEqual({
        user: mockAuthResponse.user,
        accessToken: "access123",
        refreshToken: "refresh123",
      });
    });

    it("should correctly map token fields from response", () => {
      const mockResponse: AuthResponse = {
        user: {
          id: "1",
          email: "email@gmail.com",
          profile: {
            id: "1",
            full_name: "John Doe",
            avatar: "fffff",
          },
          role: UserRole.Employee,
          is_verified: false,
        },
        access_token: "token_abc",
        refresh_token: "token_xyz",
      };

      const session = createAuthSession(mockResponse);

      expect(session.accessToken).toBe("token_abc");
      expect(session.refreshToken).toBe("token_xyz");
    });
  });

  describe("persistAuthTokens", () => {
    it("should save tokens to localStorage when session is valid", () => {
      const session: AuthSession = {
        user: null,
        accessToken: "access_token_123",
        refreshToken: "refresh_token_456",
      };

      persistAuthTokens(session);

      expect(localStorage.getItem("access_token")).toBe("access_token_123");
      expect(localStorage.getItem("refresh_token")).toBe("refresh_token_456");
    });

    it("should not save tokens if accessToken is null", () => {
      const session: AuthSession = {
        user: null,
        accessToken: null,
        refreshToken: "refresh_token_456",
      };

      persistAuthTokens(session);

      expect(localStorage.getItem("access_token")).toBeNull();
    });

    it("should not save tokens if refreshToken is null", () => {
      const session: AuthSession = {
        user: null,
        accessToken: "access_token_123",
        refreshToken: null,
      };

      persistAuthTokens(session);

      expect(localStorage.getItem("refresh_token")).toBeNull();
    });

    it("should handle both tokens being null gracefully", () => {
      const session: AuthSession = {
        user: null,
        accessToken: null,
        refreshToken: null,
      };

      expect(() => persistAuthTokens(session)).not.toThrow();
      expect(localStorage.length).toBe(0);
    });
  });

  describe("clearPersistedAuthTokens", () => {
    it("should remove both tokens from localStorage", () => {
      localStorage.setItem("access_token", "token123");
      localStorage.setItem("refresh_token", "refresh123");

      clearPersistedAuthTokens();

      expect(localStorage.getItem("access_token")).toBeNull();
      expect(localStorage.getItem("refresh_token")).toBeNull();
    });

    it("should not throw error if tokens do not exist", () => {
      expect(() => clearPersistedAuthTokens()).not.toThrow();
    });

    it("should clear localStorage completely", () => {
      localStorage.setItem("access_token", "token123");
      localStorage.setItem("refresh_token", "refresh123");
      localStorage.setItem("other_key", "other_value");

      clearPersistedAuthTokens();

      expect(localStorage.getItem("access_token")).toBeNull();
      expect(localStorage.getItem("refresh_token")).toBeNull();
      expect(localStorage.getItem("other_key")).toBe("other_value");
    });
  });
});
