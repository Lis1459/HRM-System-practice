import { useToast } from "primevue";

export const useAppToast = () => {
  const toast = useToast();

  return {
    successToast: (message: string) =>
      toast.add({ severity: "success", summary: "Success", detail: message }),

    errorToast: (message: string) =>
      toast.add({ severity: "error", summary: "Error", detail: message }),
  };
};
