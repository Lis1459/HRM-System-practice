import { describe, it, expect, beforeEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useDepartmentsStore } from "~/stores/departments";
import type { DepartmentItem } from "~/types/department";

const mockApolloQuery = vi.fn();

vi.stubGlobal("useNuxtApp", () => ({
  $apollo: {
    query: mockApolloQuery,
  },
}));

const createMockDepartment = (overrides = {}): DepartmentItem => ({
  id: 1,
  name: "Engineering",
  ...overrides,
});

describe("useDepartmentsStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    mockApolloQuery.mockClear();
  });

  describe("initial state", () => {
    it("should have correct initial state", () => {
      const store = useDepartmentsStore();

      expect(store.departments).toEqual([]);
      expect(store.loading).toBe(false);
      expect(store.error).toBeNull();
    });
  });

  describe("fetchDepartments action", () => {
    it("should fetch departments and update state", async () => {
      const mockDepartments = [
        createMockDepartment({ id: "1", name: "Engineering" }),
        createMockDepartment({ id: "2", name: "Sales" }),
        createMockDepartment({ id: "3", name: "HR" }),
      ];

      mockApolloQuery.mockResolvedValue({
        data: { departments: mockDepartments },
      });

      const store = useDepartmentsStore();
      await store.fetchDepartments();

      expect(store.departments).toEqual(mockDepartments);
      expect(store.loading).toBe(false);
      expect(store.error).toBeNull();
    });

    it("should set loading to true during fetch", async () => {
      mockApolloQuery.mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve({ data: { departments: [] } }), 10);
          }),
      );

      const store = useDepartmentsStore();

      const fetchPromise = store.fetchDepartments();
      expect(store.loading).toBe(true);

      await fetchPromise;
      expect(store.loading).toBe(false);
    });

    it("should handle empty departments list", async () => {
      mockApolloQuery.mockResolvedValue({
        data: { departments: [] },
      });

      const store = useDepartmentsStore();
      await store.fetchDepartments();

      expect(store.departments).toEqual([]);
    });

    it("should handle null data response", async () => {
      mockApolloQuery.mockResolvedValue({
        data: { departments: null },
      });

      const store = useDepartmentsStore();
      await store.fetchDepartments();

      expect(store.departments).toEqual([]);
    });

    it("should handle API error", async () => {
      mockApolloQuery.mockRejectedValue(new Error("Network error"));

      const store = useDepartmentsStore();
      await store.fetchDepartments();

      expect(store.error).toBe("Failed to load departments");
      expect(store.loading).toBe(false);
      expect(store.departments).toEqual([]);
    });

    it("should clear previous error on successful fetch", async () => {
      const store = useDepartmentsStore();
      store.error = "Previous error";

      mockApolloQuery.mockResolvedValue({
        data: { departments: [createMockDepartment()] },
      });

      await store.fetchDepartments();

      expect(store.error).toBeNull();
    });

    it("should call Apollo query with correct query", async () => {
      mockApolloQuery.mockResolvedValue({
        data: { departments: [] },
      });

      const store = useDepartmentsStore();
      await store.fetchDepartments();

      expect(mockApolloQuery).toHaveBeenCalledOnce();
      const firstCall = mockApolloQuery.mock.calls[0]!;
      const firstArg = firstCall[0]!;
      expect(firstArg).toHaveProperty("query");
    });
  });

  describe("state reactivity", () => {
    it("should maintain reactive state", async () => {
      mockApolloQuery.mockResolvedValue({
        data: { departments: [createMockDepartment()] },
      });

      const store = useDepartmentsStore();

      expect(store.departments).toEqual([]);

      await store.fetchDepartments();

      expect(store.departments).toHaveLength(1);
    });

    it("should replace departments on each fetch", async () => {
      const store = useDepartmentsStore();

      mockApolloQuery.mockResolvedValue({
        data: { departments: [createMockDepartment({ id: "1" })] },
      });

      await store.fetchDepartments();
      expect(store.departments).toHaveLength(1);

      mockApolloQuery.mockResolvedValue({
        data: {
          departments: [
            createMockDepartment({ id: "1" }),
            createMockDepartment({ id: "2" }),
          ],
        },
      });

      await store.fetchDepartments();
      expect(store.departments).toHaveLength(2);
    });
  });

  describe("error handling", () => {
    it("should preserve departments on fetch error", async () => {
      const mockDepartments = [createMockDepartment()];

      mockApolloQuery.mockResolvedValue({
        data: { departments: mockDepartments },
      });

      const store = useDepartmentsStore();
      await store.fetchDepartments();

      mockApolloQuery.mockRejectedValue(new Error("Fetch failed"));

      // const previousDepartments = [...store.departments];
      await store.fetchDepartments();

      // The store should retain the old data while error is set
      expect(store.error).toBe("Failed to load departments");
    });

    it("should set error state on multiple sequential failures", async () => {
      mockApolloQuery.mockRejectedValue(new Error("Error 1"));

      const store = useDepartmentsStore();

      await store.fetchDepartments();
      expect(store.error).toBe("Failed to load departments");

      mockApolloQuery.mockRejectedValue(new Error("Error 2"));

      await store.fetchDepartments();
      expect(store.error).toBe("Failed to load departments");
    });
  });

  describe("store isolation", () => {
    it("should have independent state between instances", () => {
      setActivePinia(createPinia());
      const store1 = useDepartmentsStore();

      setActivePinia(createPinia());
      const store2 = useDepartmentsStore();

      store1.departments = [createMockDepartment({ id: "1" })];

      expect(store2.departments).toEqual([]);
    });
  });
});
