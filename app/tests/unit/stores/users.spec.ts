import { describe, it, expect, beforeEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useUsersStore } from "~/stores/users";
import type { UserListItem } from "~/types/user";
import type {
  CreateUserInput,
  UpdateUserInput,
  UpdateProfileInput,
} from "~/graphql/users/types";
import { UserRole } from "~/types/auth";

const mockApolloQuery = vi.fn();
const mockApolloMutate = vi.fn();

vi.stubGlobal("useNuxtApp", () => ({
  $apollo: {
    query: mockApolloQuery,
    mutate: mockApolloMutate,
  },
}));

const createMockUser = (overrides = {}): UserListItem => ({
  id: "1",
  email: "john@example.com",
  role: UserRole.Employee,
  profile: {
    id: "1",
    first_name: "John",
    last_name: "Doe",
    full_name: "John Doe",
    avatar: "avatar.jpg",
  },
  department: {
    id: 1,
    name: "Node JS",
  },
  position: {
    id: 1,
    name: "Manager",
  },
  ...overrides,
});

describe("useUsersStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    mockApolloQuery.mockClear();
    mockApolloMutate.mockClear();
  });

  describe("initial state", () => {
    it("should have correct initial state", () => {
      const store = useUsersStore();

      expect(store.users).toEqual([]);
      expect(store.loading).toBe(false);
      expect(store.error).toBeNull();
    });
  });

  describe("fetchUsers action", () => {
    it("should set loading to true during fetch", async () => {
      mockApolloQuery.mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve({ data: { users: [] } }), 10);
          }),
      );

      const store = useUsersStore();

      const fetchPromise = store.fetchUsers();
      expect(store.loading).toBe(true);

      await fetchPromise;
    });

    it("should fetch users and update state", async () => {
      const mockUsers = [
        createMockUser({ id: "1" }),
        createMockUser({ id: "2", firstName: "Jane" }),
      ];

      mockApolloQuery.mockResolvedValue({
        data: { users: mockUsers },
      });

      const store = useUsersStore();
      await store.fetchUsers();

      expect(store.users).toEqual(mockUsers);
      expect(store.loading).toBe(false);
      expect(store.error).toBeNull();
    });

    it("should handle empty users list", async () => {
      mockApolloQuery.mockResolvedValue({
        data: { users: [] },
      });

      const store = useUsersStore();
      await store.fetchUsers();

      expect(store.users).toEqual([]);
      expect(store.loading).toBe(false);
    });

    it("should handle null data response", async () => {
      mockApolloQuery.mockResolvedValue({
        data: { users: null },
      });

      const store = useUsersStore();
      await store.fetchUsers();

      expect(store.users).toEqual([]);
    });

    it("should handle API error", async () => {
      const error = new Error("Failed to fetch users");
      mockApolloQuery.mockRejectedValue(error);

      const store = useUsersStore();
      await store.fetchUsers();

      expect(store.error).toBe("Failed to load users");
      expect(store.loading).toBe(false);
      expect(store.users).toEqual([]);
    });

    it("should clear error on successful fetch", async () => {
      const store = useUsersStore();
      store.error = "Previous error";

      mockApolloQuery.mockResolvedValue({
        data: { users: [] },
      });

      await store.fetchUsers();

      expect(store.error).toBeNull();
    });

    it("should call Apollo query with correct query", async () => {
      mockApolloQuery.mockResolvedValue({
        data: { users: [] },
      });

      const store = useUsersStore();
      await store.fetchUsers();

      expect(mockApolloQuery).toHaveBeenCalled();
      const firstCall = mockApolloQuery.mock.calls[0]!;
      const firstArg = firstCall[0]!;
      expect(firstArg).toHaveProperty("query");
    });
  });

  describe("createUser action", () => {
    it("should create a new user and add to list", async () => {
      const existingUsers = [createMockUser({ id: "1" })];
      const newUser = createMockUser({ id: "2", firstName: "Jane" });

      const store = useUsersStore();
      store.users = existingUsers;

      mockApolloMutate.mockResolvedValue({
        data: { createUser: newUser },
      });

      const userInput: CreateUserInput = {
        auth: {
          email: "jane@example.com",
          password: "password123",
        },
        profile: {
          first_name: "Jane",
          last_name: "Doe",
        },
        cvsIds: [""],
        departmentId: 1,
        positionId: 1,
        role: UserRole.Employee,
      };

      await store.createUser(userInput);

      expect(store.users).toHaveLength(2);
      expect(store.users[1]).toEqual(newUser);
      expect(store.loading).toBe(false);
      expect(store.error).toBeNull();
    });

    it("should set loading state during creation", async () => {
      mockApolloMutate.mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(
              () => resolve({ data: { createUser: createMockUser() } }),
              10,
            );
          }),
      );

      const store = useUsersStore();

      const createPromise = store.createUser({} as CreateUserInput);
      expect(store.loading).toBe(true);

      await createPromise;
      expect(store.loading).toBe(false);
    });

    it("should handle null response from API", async () => {
      mockApolloMutate.mockResolvedValue({
        data: null,
      });

      const store = useUsersStore();
      const initialUsers = [createMockUser()];
      store.users = initialUsers;

      await store.createUser({} as CreateUserInput);

      expect(store.users).toEqual(initialUsers);
    });

    it("should handle API error and not add user", async () => {
      const error = new Error("Network error");
      mockApolloMutate.mockRejectedValue(error);

      const store = useUsersStore();
      const initialUsers = [createMockUser()];
      store.users = initialUsers;

      await expect(store.createUser({} as CreateUserInput)).rejects.toThrow();

      expect(store.error).toBe("Failed to create user");
      expect(store.users).toEqual(initialUsers);
      expect(store.loading).toBe(false);
    });

    it("should pass correct variables to Apollo mutation", async () => {
      mockApolloMutate.mockResolvedValue({
        data: { createUser: createMockUser() },
      });

      const store = useUsersStore();
      const userInput: CreateUserInput = {
        auth: {
          email: "jane@example.com",
          password: "password123",
        },
        profile: {
          first_name: "Jane",
          last_name: "Doe",
        },
        cvsIds: [""],
        departmentId: 1,
        positionId: 1,
        role: UserRole.Employee,
      };

      await store.createUser(userInput);

      expect(mockApolloMutate).toHaveBeenCalled();
      const firstCall = mockApolloMutate.mock.calls[0]!;
      const firstArg = firstCall[0]!;
      expect(firstArg.variables).toEqual({
        user: userInput,
      });
    });
  });

  describe("updateUser action", () => {
    it("should update existing user with merged data", async () => {
      const existingUser = createMockUser({
        id: "1",
        email: "user@gmail.com",
        profile: {
          id: "1",
          first_name: "John",
          last_name: "Doe",
          full_name: "John Doe",
        },
        department: {
          id: 1,
          name: "Node JS",
        },
        position: {
          id: 1,
          name: "Developer",
        },
        role: UserRole.Employee,
      });

      const updatedUserData = {
        id: "1",
        departmentId: 1,
        positionId: 1,
        role: UserRole.Employee,
      };
      const profileData = {
        id: "1",
        first_name: "Jane",
        last_name: "Doe",
        full_name: "Jane Doe",
      };

      const store = useUsersStore();
      store.users = [existingUser];

      mockApolloMutate
        .mockResolvedValueOnce({ data: { updateUser: updatedUserData } })
        .mockResolvedValueOnce({ data: { updateProfile: profileData } });

      const userInput = {
        userId: "1",
        departmentId: 1,
        positionId: 1,
        role: UserRole.Employee,
      } as UpdateUserInput;
      const profileInput = {
        userId: "1",
        first_name: "Jane",
        last_name: "Doe",
      } as UpdateProfileInput;

      const result = await store.updateUser(userInput, profileInput);

      if (!result) return;

      expect(result).toBeDefined();
      expect(result.profile.full_name).toBe("Jane Doe");
    });

    it("should handle user not found in state", async () => {
      const store = useUsersStore();
      store.users = [];

      mockApolloMutate
        .mockResolvedValueOnce({ data: { updateUser: { id: "unknown" } } })
        .mockResolvedValueOnce({ data: { updateProfile: {} } });

      const result = await store.updateUser(
        {} as UpdateUserInput,
        {} as UpdateProfileInput,
      );

      expect(result).toBeUndefined();
    });

    it("should handle API errors", async () => {
      const store = useUsersStore();
      store.users = [createMockUser()];

      mockApolloMutate.mockRejectedValue(new Error("Update failed"));

      await expect(
        store.updateUser({} as UpdateUserInput, {} as UpdateProfileInput),
      ).rejects.toThrow();

      expect(store.error).toBe("Failed to update user");
    });

    it("should make two mutations sequentially", async () => {
      const store = useUsersStore();
      store.users = [createMockUser({ id: "1" })];

      mockApolloMutate
        .mockResolvedValueOnce({ data: { updateUser: { id: "1" } } })
        .mockResolvedValueOnce({ data: { updateProfile: { id: "1" } } });

      await store.updateUser({} as UpdateUserInput, {} as UpdateProfileInput);

      expect(mockApolloMutate).toHaveBeenCalledTimes(2);
    });
  });

  describe("deleteUser action", () => {
    it("should remove user from list", async () => {
      const user1 = createMockUser({ id: "1" });
      const user2 = createMockUser({ id: "2" });

      mockApolloMutate.mockResolvedValue({
        data: { deleteUser: { id: "1" } },
      });

      const store = useUsersStore();
      store.users = [user1, user2];

      await store.deleteUser("1");

      expect(store.users).toHaveLength(1);
      const firstCall = store.users[0]!;
      expect(firstCall.id).toBe("2");
    });

    it("should handle deletion error", async () => {
      mockApolloMutate.mockRejectedValue(new Error("Delete failed"));

      const store = useUsersStore();
      store.users = [createMockUser({ id: "1" })];

      await expect(store.deleteUser("1")).rejects.toThrow();

      expect(store.error).toBe("Failed to delete user");
      expect(store.users).toHaveLength(1);
    });

    it("should set loading state during deletion", async () => {
      mockApolloMutate.mockResolvedValue({
        data: { deleteUser: { id: "1" } },
      });

      const store = useUsersStore();
      store.users = [createMockUser({ id: "1" })];

      const deletePromise = store.deleteUser("1");
      expect(store.loading).toBe(true);

      await deletePromise;
      expect(store.loading).toBe(false);
    });
  });

  describe("state management", () => {
    it("should maintain state isolation between store instances", () => {
      setActivePinia(createPinia());
      const store1 = useUsersStore();

      setActivePinia(createPinia());
      const store2 = useUsersStore();

      store1.users = [createMockUser({ id: "1" })];

      expect(store2.users).toEqual([]);
    });
  });
});
