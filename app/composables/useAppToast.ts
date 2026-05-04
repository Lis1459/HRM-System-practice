import { useToast } from "primevue";

export const useAppToast = () => {
  const toast = useToast();

  return {
    successToast: (message: string) =>
      toast.add({
        severity: "success",
        summary: "Success",
        detail: message,
        life: 3000,
      }),

    errorToast: (message: string) =>
      toast.add({
        severity: "error",
        summary: "Error",
        detail: message,
        life: 3000,
      }),
  };
};
