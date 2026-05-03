import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useAuthStore } from "~/stores/auth";
import { UserRole, type User } from "~/types/auth";
import type { AuthResponse } from "~/graphql/auth/types";

// Mock utilities
vi.mock("~/utils/auth", () => ({
  createAuthVariables: (email: string, password: string) => ({
    auth: { email, password },
  }),
  createAuthSession: (data: AuthResponse) => ({
    user: data.user,
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
  }),
  persistAuthTokens: vi.fn(),
  clearPersistedAuthTokens: vi.fn(),
}));

vi.mock("~/utils/parseJwt", () => ({
  parseJwt: (token: string) => ({
    sub: "1",
    email: "test@example.com",
  }),
}));

const mockApolloQuery = vi.fn();
const mockApolloMutate = vi.fn();

vi.stubGlobal("useNuxtApp", () => ({
  $apollo: {
    query: mockApolloQuery,
    mutate: mockApolloMutate,
  },
}));

const createMockUser = (overrides = {}): User => ({
  id: "1",
  email: "test@example.com",
  profile: {
    id: "1",
    full_name: "Test User",
    avatar: "avatar.jpg",
  },
  role: UserRole.Employee,
  is_verified: true,
  ...overrides,
});

describe("useAuthStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    mockApolloQuery.mockClear();
    mockApolloMutate.mockClear();
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe("initial state", () => {
    it("should have correct initial state", () => {
      const store = useAuthStore();

      expect(store.user).toBeNull();
      expect(store.accessToken).toBeNull();
      expect(store.refreshToken).toBeNull();
      expect(store.isAuthenticated).toBe(false);
    });

    it("should compute isAuthenticated based on tokens", () => {
      const store = useAuthStore();

      expect(store.isAuthenticated).toBe(false);

      store.setTokens("access123", "refresh123");

      expect(store.isAuthenticated).toBe(true);
    });
  });

  describe("setTokens", () => {
    it("should set both tokens correctly", () => {
      const store = useAuthStore();
      const accessToken = "access_token_xyz";
      const refreshToken = "refresh_token_xyz";

      store.setTokens(accessToken, refreshToken);

      expect(store.accessToken).toBe(accessToken);
      expect(store.refreshToken).toBe(refreshToken);
    });

    it("should persist tokens to localStorage", () => {
      const store = useAuthStore();

      store.setTokens("access123", "refresh123");

      expect(localStorage.getItem("access_token")).toBe("access123");
      expect(localStorage.getItem("refresh_token")).toBe("refresh123");
    });

    it("should update isAuthenticated when tokens are set", () => {
      const store = useAuthStore();

      expect(store.isAuthenticated).toBe(false);

      store.setTokens("access123", "refresh123");

      expect(store.isAuthenticated).toBe(true);
    });
  });

  describe("Login action", () => {
    it("should call Apollo query with correct variables", async () => {
      const mockUser = createMockUser();
      mockApolloQuery.mockResolvedValue({
        data: {
          login: {
            user: mockUser,
            access_token: "access123",
            refresh_token: "refresh123",
          },
        },
      });

      const store = useAuthStore();
      await store.Login("test@example.com", "password123");

      expect(mockApolloQuery).toHaveBeenCalled();
      const firstCall = mockApolloQuery.mock.calls[0]!;
      const firstArg = firstCall[0]!;

      expect(firstArg.variables).toEqual({
        auth: {
          email: "test@example.com",
          password: "password123",
        },
      });
    });

    it("should update store state on successful login", async () => {
      const mockUser = createMockUser();
      mockApolloQuery.mockResolvedValue({
        data: {
          login: {
            user: mockUser,
            access_token: "access123",
            refresh_token: "refresh123",
          },
        },
      });

      const store = useAuthStore();
      await store.Login("test@example.com", "password123");

      expect(store.user).toEqual(mockUser);
      expect(store.accessToken).toBe("access123");
      expect(store.refreshToken).toBe("refresh123");
      expect(store.isAuthenticated).toBe(true);
    });

    it("should throw error if API returns no data", async () => {
      mockApolloQuery.mockResolvedValue({ data: null });

      const store = useAuthStore();

      await expect(
        store.Login("test@example.com", "password123"),
      ).rejects.toThrow("Something went wrong");
    });

    it("should throw error if API call fails", async () => {
      mockApolloQuery.mockRejectedValue(new Error("Network error"));

      const store = useAuthStore();

      await expect(
        store.Login("test@example.com", "password123"),
      ).rejects.toThrow("Network error");
    });
  });

  describe("SignUp action", () => {
    it("should call Apollo mutate with correct variables", async () => {
      const mockUser = createMockUser();
      mockApolloMutate.mockResolvedValue({
        data: {
          signup: {
            user: mockUser,
            access_token: "access123",
            refresh_token: "refresh123",
          },
        },
      });

      const store = useAuthStore();
      await store.SignUp("newuser@example.com", "password123");

      expect(mockApolloMutate).toHaveBeenCalled();

      const firstCall = mockApolloMutate.mock.calls[0]!;
      const firstArg = firstCall[0]!;
      expect(firstArg.variables).toEqual({
        auth: {
          email: "newuser@example.com",
          password: "password123",
        },
      });
    });

    it("should update store state on successful signup", async () => {
      const mockUser = createMockUser();
      mockApolloMutate.mockResolvedValue({
        data: {
          signup: {
            user: mockUser,
            access_token: "access123",
            refresh_token: "refresh123",
          },
        },
      });

      const store = useAuthStore();
      await store.SignUp("newuser@example.com", "password123");

      expect(store.user).toEqual(mockUser);
      expect(store.accessToken).toBe("access123");
      expect(store.refreshToken).toBe("refresh123");
      expect(store.isAuthenticated).toBe(true);
    });

    it("should throw error if API returns no data", async () => {
      mockApolloMutate.mockResolvedValue({ data: null });

      const store = useAuthStore();

      await expect(
        store.SignUp("newuser@example.com", "password123"),
      ).rejects.toThrow("Something went wrong");
    });
  });

  describe("Logout action", () => {
    it("should clear all auth state", () => {
      const store = useAuthStore();
      const mockUser = createMockUser();

      // Set up initial state
      store.user = mockUser;
      store.accessToken = "access123";
      store.refreshToken = "refresh123";

      store.Logout();

      expect(store.user).toBeNull();
      expect(store.accessToken).toBeNull();
      expect(store.refreshToken).toBeNull();
      expect(store.isAuthenticated).toBe(false);
    });
  });

  describe("initAuth action", () => {
    it("should retrieve tokens from localStorage and set them", () => {
      localStorage.setItem("access_token", "access123");
      localStorage.setItem("refresh_token", "refresh123");

      const store = useAuthStore();

      store.initAuth();

      expect(store.accessToken).toBe("access123");
      expect(store.refreshToken).toBe("refresh123");
    });
  });

  describe("isAuthenticated computed property", () => {
    it("should be false initially", () => {
      const store = useAuthStore();
      expect(store.isAuthenticated).toBe(false);
    });

    it("should be true when accessToken is set", () => {
      const store = useAuthStore();
      store.accessToken = "token123";

      expect(store.isAuthenticated).toBe(true);
    });

    it("should be true when refreshToken is set", () => {
      const store = useAuthStore();
      store.refreshToken = "token456";

      expect(store.isAuthenticated).toBe(true);
    });

    it("should update reactively", () => {
      const store = useAuthStore();

      expect(store.isAuthenticated).toBe(false);

      store.setTokens("access123", "refresh123");
      expect(store.isAuthenticated).toBe(true);

      store.Logout();
      expect(store.isAuthenticated).toBe(false);
    });
  });
});
