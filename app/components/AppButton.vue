<script setup lang="ts">
import { computed } from "vue";
type AppButtonVariant = "undefined" | "text" | "outlined";

const props = withDefaults(
  defineProps<{
    buttonType?: "button" | "submit" | "reset";
    variant?: AppButtonVariant;
  }>(),
  {
    buttonType: "button",
    variant: "undefined",
  },
);

const primeVariant = computed(() => {
  if (props.variant === "text") {
    return "text";
  }

  if (props.variant === "outlined") {
    return "outlined";
  }

  return undefined;
});
</script>

<template>
  <Button
    v-ripple
    :type="buttonType"
    :variant="primeVariant"
    class="app-button"
    :class="`app-button--${variant}`"
  >
    <slot />
  </Button>
</template>

<style scoped>
.app-button {
  justify-content: center;
  min-height: 48px;
  padding: 16px 24px;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease,
    box-shadow 0.2s ease,
    filter 0.2s ease;
  font-size: 14px;
}

.app-button--undefined {
  border-width: 0px;
}

.app-button--undefined:not(:disabled):hover {
  border-width: 0px;
  background: var(--p-button-primary-hover-background);
}

.app-button--undefined:not(:disabled):active {
  border-width: 0px;
  box-shadow:
    rgba(0, 0, 0, 0.2) 0px 5px 5px -3px,
    rgba(0, 0, 0, 0.14) 0px 8px 10px 1px,
    rgba(0, 0, 0, 0.12) 0px 3px 14px 2px;
  background: var(--p-button-primary-hover-background);
  filter: brightness(1.08);
}

.app-button--text {
  padding: 12px 24px;
  /* color: var(--p-text-muted-color); */
}

.app-button--text:not(:disabled):hover {
  /* color: var(--p-text-muted-color); */
  background: color-mix(in srgb, var(--p-text-muted-color), transparent 96%);
}

.app-button--text:not(:disabled):active {
  /* color: var(--p-text-muted-color); */
  background: color-mix(in srgb, var(--p-text-muted-color), transparent 96%);
}

.app-button--outlined {
  color: var(--p-text-muted-color);
  border-color: color-mix(in srgb, var(--p-text-muted-color), transparent 50%);
  background: transparent;
}

.app-button--outlined:not(:disabled):hover {
  color: var(--p-text-muted-color);
  border-color: var(--p-text-muted-color);
  background: color-mix(in srgb, var(--p-text-muted-color), transparent 96%);
}

.app-button--outlined:not(:disabled):active {
  color: var(--p-text-muted-color);
  border-color: var(--p-text-muted-color);
  background: color-mix(in srgb, var(--p-text-muted-color), transparent 96%);
}
</style>
