import { describe, it, expect, vi, beforeEach } from "vitest";
import { useAppToast } from "~/composables/useAppToast";

const mockAdd = vi.fn();
vi.mock("primevue", () => ({
  useToast: () => ({
    add: mockAdd,
  }),
}));

describe("useAppToast", () => {
  beforeEach(() => {
    mockAdd.mockClear();
  });

  describe("successToast", () => {
    it("should call toast.add with success severity", () => {
      const { successToast } = useAppToast();
      const message = "User created successfully";

      successToast(message);

      expect(mockAdd).toHaveBeenCalledOnce();
      expect(mockAdd).toHaveBeenCalledWith({
        severity: "success",
        summary: "Success",
        detail: message,
        life: 3000,
      });
    });

    it("should display different messages", () => {
      const { successToast } = useAppToast();

      successToast("Profile updated");
      expect(mockAdd).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: "Profile updated",
        }),
      );

      mockAdd.mockClear();

      successToast("User deleted");
      expect(mockAdd).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: "User deleted",
        }),
      );
    });

    it("should always use 3 second duration", () => {
      const { successToast } = useAppToast();

      successToast("Test");

      expect(mockAdd).toHaveBeenCalledWith(
        expect.objectContaining({
          life: 3000,
        }),
      );
    });

    it("should handle empty strings", () => {
      const { successToast } = useAppToast();

      successToast("");

      expect(mockAdd).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: "",
        }),
      );
    });

    it("should handle long messages", () => {
      const { successToast } = useAppToast();
      const longMessage = "A".repeat(1000);

      successToast(longMessage);

      expect(mockAdd).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: longMessage,
        }),
      );
    });
  });

  describe("errorToast", () => {
    it("should call toast.add with error severity", () => {
      const { errorToast } = useAppToast();
      const message = "Failed to create user";

      errorToast(message);

      expect(mockAdd).toHaveBeenCalledOnce();
      expect(mockAdd).toHaveBeenCalledWith({
        severity: "error",
        summary: "Error",
        detail: message,
        life: 3000,
      });
    });

    it("should display different error messages", () => {
      const { errorToast } = useAppToast();

      errorToast("Network error");
      expect(mockAdd).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: "Network error",
        }),
      );

      mockAdd.mockClear();

      errorToast("Invalid credentials");
      expect(mockAdd).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: "Invalid credentials",
        }),
      );
    });

    it("should have error severity", () => {
      const { errorToast } = useAppToast();

      errorToast("Something went wrong");

      expect(mockAdd).toHaveBeenCalledWith(
        expect.objectContaining({
          severity: "error",
          summary: "Error",
        }),
      );
    });
  });

  describe("Toast lifecycle", () => {
    it("should return both toast functions", () => {
      const toast = useAppToast();

      expect(toast).toHaveProperty("successToast");
      expect(toast).toHaveProperty("errorToast");
      expect(typeof toast.successToast).toBe("function");
      expect(typeof toast.errorToast).toBe("function");
    });

    it("should allow multiple sequential toasts", () => {
      const { successToast, errorToast } = useAppToast();

      successToast("Operation 1 success");
      errorToast("Operation 2 failed");
      successToast("Operation 3 success");

      expect(mockAdd).toHaveBeenCalledTimes(3);
    });
  });
});
