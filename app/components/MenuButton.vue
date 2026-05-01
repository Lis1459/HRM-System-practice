<script setup lang="ts">
import { Menu } from "primevue";
import type { MenuItem } from "primevue/menuitem";

interface Props {
  model: MenuItem[];
  buttonClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  buttonClass: "",
});

const menu = ref<InstanceType<typeof Menu> | null>(null);

const openMenu = (event: MouseEvent) => {
  menu.value?.toggle(event);
};
</script>

<template>
  <div>
    <Button
      type="button"
      class="menu-button"
      :class="props.buttonClass"
      aria-haspopup="true"
      aria-controls="overlay_menu"
      @click="openMenu"
    >
      <slot />
    </Button>
    <Menu id="overlay_menu" ref="menu" :model="props.model" :popup="true" />
  </div>
</template>

<style scoped>
.menu-button {
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  border-radius: 40px;
  background: inherit;
  color: var(--p-text-color);
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    transform 0.15s ease;
}

.menu-button:not(:disabled):hover,
.menu-button:not(:disabled):active {
  background: rgba(118, 118, 118, 0.04);
  border: none;
  color: var(--p-surface-500);
}
</style>
