import { defineStore } from "pinia";
import { ref } from "vue";
import { DEPARTMENTS } from "~/graphql/departments";
import type { DeparmentsQuery } from "~/graphql/departments/types";
import type { DepartmentItem } from "~/types/department";

export const useDepartmentsStore = defineStore("departments", () => {
  const departments = ref<DepartmentItem[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const { $apollo } = useNuxtApp();

  const fetchDepartments = async () => {
    loading.value = true;
    error.value = null;

    try {
      const { data } = await $apollo.query<DeparmentsQuery>({
        query: DEPARTMENTS,
      });

      departments.value = data?.departments ?? [];
    } catch (err) {
      error.value = "Failed to load departments";
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  return {
    departments,
    loading,
    error,
    fetchDepartments,
  };
});
