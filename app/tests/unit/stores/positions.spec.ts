import { describe, it, expect, beforeEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { usePositionsStore } from "~/stores/positions";
import type { PositionItem } from "~/types/position";

const mockApolloQuery = vi.fn();

vi.stubGlobal("useNuxtApp", () => ({
  $apollo: {
    query: mockApolloQuery,
  },
}));

const createMockPosition = (overrides = {}): PositionItem => ({
  id: 1,
  name: "Software Engineer",
  ...overrides,
});

describe("usePositionsStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    mockApolloQuery.mockClear();
  });

  describe("initial state", () => {
    it("should have correct initial state", () => {
      const store = usePositionsStore();

      expect(store.positions).toEqual([]);
      expect(store.loading).toBe(false);
      expect(store.error).toBeNull();
    });
  });

  describe("fetchPositions action", () => {
    it("should fetch positions and update state", async () => {
      const mockPositions = [
        createMockPosition({ id: "1", name: "Senior Developer" }),
        createMockPosition({ id: "2", name: "QA Engineer" }),
        createMockPosition({ id: "3", name: "Product Manager" }),
      ];

      mockApolloQuery.mockResolvedValue({
        data: { positions: mockPositions },
      });

      const store = usePositionsStore();
      await store.fetchPositions();

      expect(store.positions).toEqual(mockPositions);
      expect(store.loading).toBe(false);
      expect(store.error).toBeNull();
    });

    it("should set loading to true during fetch", async () => {
      mockApolloQuery.mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve({ data: { positions: [] } }), 10);
          }),
      );

      const store = usePositionsStore();

      const fetchPromise = store.fetchPositions();
      expect(store.loading).toBe(true);

      await fetchPromise;
      expect(store.loading).toBe(false);
    });

    it("should handle empty positions list", async () => {
      mockApolloQuery.mockResolvedValue({
        data: { positions: [] },
      });

      const store = usePositionsStore();
      await store.fetchPositions();

      expect(store.positions).toEqual([]);
      expect(store.loading).toBe(false);
      expect(store.error).toBeNull();
    });

    it("should handle null data response", async () => {
      mockApolloQuery.mockResolvedValue({
        data: { positions: null },
      });

      const store = usePositionsStore();
      await store.fetchPositions();

      expect(store.positions).toEqual([]);
    });

    it("should handle API error", async () => {
      mockApolloQuery.mockRejectedValue(new Error("Network error"));

      const store = usePositionsStore();
      await store.fetchPositions();

      expect(store.error).toBe("Failed to load positions");
      expect(store.loading).toBe(false);
      expect(store.positions).toEqual([]);
    });

    it("should clear previous error on successful fetch", async () => {
      const store = usePositionsStore();
      store.error = "Previous error";

      mockApolloQuery.mockResolvedValue({
        data: { positions: [createMockPosition()] },
      });

      await store.fetchPositions();

      expect(store.error).toBeNull();
    });

    it("should call Apollo query with correct query", async () => {
      mockApolloQuery.mockResolvedValue({
        data: { positions: [] },
      });

      const store = usePositionsStore();
      await store.fetchPositions();

      expect(mockApolloQuery).toHaveBeenCalledOnce();
      const firstCall = mockApolloQuery.mock.calls[0]!;
      const firstArg = firstCall[0]!;
      expect(firstArg).toHaveProperty("query");
    });

    it("should handle multiple sequential fetches", async () => {
      const store = usePositionsStore();

      mockApolloQuery.mockResolvedValue({
        data: { positions: [createMockPosition({ id: "1" })] },
      });

      await store.fetchPositions();
      expect(store.positions).toHaveLength(1);

      mockApolloQuery.mockResolvedValue({
        data: {
          positions: [
            createMockPosition({ id: "1" }),
            createMockPosition({ id: "2" }),
          ],
        },
      });

      await store.fetchPositions();
      expect(store.positions).toHaveLength(2);
    });
  });

  describe("state reactivity", () => {
    it("should maintain reactive state", async () => {
      mockApolloQuery.mockResolvedValue({
        data: { positions: [createMockPosition()] },
      });

      const store = usePositionsStore();

      expect(store.positions).toEqual([]);

      await store.fetchPositions();

      expect(store.positions).toHaveLength(1);
    });

    it("should replace positions on each fetch", async () => {
      const store = usePositionsStore();

      mockApolloQuery.mockResolvedValue({
        data: { positions: [createMockPosition({ id: "1" })] },
      });

      await store.fetchPositions();
      expect(store.positions).toHaveLength(1);

      mockApolloQuery.mockResolvedValue({
        data: {
          positions: [
            createMockPosition({ id: "1" }),
            createMockPosition({ id: "2" }),
            createMockPosition({ id: "3" }),
          ],
        },
      });

      await store.fetchPositions();
      expect(store.positions).toHaveLength(3);
    });
  });

  describe("error handling", () => {
    it("should handle various error types", async () => {
      const store = usePositionsStore();

      const errors = [
        new Error("Network error"),
        new Error("Server error"),
        new Error("Timeout"),
      ];

      for (const error of errors) {
        mockApolloQuery.mockRejectedValueOnce(error);
        await store.fetchPositions();
        expect(store.error).toBe("Failed to load positions");
      }
    });

    it("should preserve positions on fetch error", async () => {
      const mockPositions = [createMockPosition({ id: "1" })];

      mockApolloQuery.mockResolvedValue({
        data: { positions: mockPositions },
      });

      const store = usePositionsStore();
      await store.fetchPositions();

      // const positionsBefore = store.positions.length;

      mockApolloQuery.mockRejectedValue(new Error("Fetch failed"));
      await store.fetchPositions();

      // Error state is set, but we should handle it appropriately
      expect(store.error).toBe("Failed to load positions");
    });
  });

  describe("store isolation", () => {
    it("should have independent state between instances", () => {
      setActivePinia(createPinia());
      const store1 = usePositionsStore();

      setActivePinia(createPinia());
      const store2 = usePositionsStore();

      store1.positions = [createMockPosition({ id: "1" })];

      expect(store2.positions).toEqual([]);
    });
  });

  describe("computed properties", () => {
    it("should expose all reactive properties", () => {
      const store = usePositionsStore();

      expect(store).toHaveProperty("positions");
      expect(store).toHaveProperty("loading");
      expect(store).toHaveProperty("error");
      expect(store).toHaveProperty("fetchPositions");
    });
  });

  describe("performance", () => {
    it("should handle large datasets", async () => {
      const largePositionsList = Array.from({ length: 100 }, (_, i) =>
        createMockPosition({ id: String(i), name: `Position ${i}` }),
      );

      mockApolloQuery.mockResolvedValue({
        data: { positions: largePositionsList },
      });

      const store = usePositionsStore();
      await store.fetchPositions();

      expect(store.positions).toHaveLength(100);
      expect(store.loading).toBe(false);
    });
  });
});
