<script setup lang="ts">
// defineOptions({
//   inheritAttrs: false,
// });

withDefaults(
  defineProps<{
    label: string;
    inputId: string;
    variant?: "in" | "on" | "over";
  }>(),
  {
    variant: "on",
  },
);

// const attrs = useAttrs();
</script>

<template>
  <FloatLabel :variant="variant" class="app-float-label">
    <slot :input-id="inputId" />
    <label :for="inputId" class="app-float-label__label">{{ label }}</label>
  </FloatLabel>
</template>

<style scoped>
.app-float-label {
  width: 100%;
}

.app-float-label :deep(.p-inputtext) {
  border-radius: 0px;
  padding: 12px 0px 12px 12px;
}

.app-float-label :deep(.p-password),
.app-float-label :deep(.p-password-input) {
  width: 100%;
}

.app-float-label :deep(.p-password-toggle-mask-icon) {
  width: 22px;
  height: 15px;
}
</style>
