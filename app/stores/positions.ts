import { defineStore } from "pinia";
import { ref } from "vue";
import { POSITIONS } from "~/graphql/positions";
import type { PositionItem } from "~/types/position";
import type { PositionsQuery } from "~/graphql/positions/types";

export const usePositionsStore = defineStore("positions", () => {
  const positions = ref<PositionItem[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const { $apollo } = useNuxtApp();

  const fetchPositions = async () => {
    loading.value = true;
    error.value = null;

    try {
      const { data } = await $apollo.query<PositionsQuery>({
        query: POSITIONS,
      });

      positions.value = data?.positions ?? [];
    } catch (err) {
      error.value = "Failed to load positions";
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  return {
    positions,
    loading,
    error,
    fetchPositions,
  };
});
