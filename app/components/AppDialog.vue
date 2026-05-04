<script setup lang="ts">
interface Props {
  title: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  confirmLabel: "Confirm",
  cancelLabel: "Cancel",
  loading: false,
});

const visible = defineModel<boolean>();

const emit = defineEmits<{
  confirm: [];
  cancel: [];
}>();

const handleConfirm = () => {
  emit("confirm");
};

const handleCancel = () => {
  emit("cancel");
  visible.value = false;
};

const handleHide = () => {
  visible.value = false;
};
</script>

<template>
  <Dialog
    v-model:visible="visible"
    :modal="true"
    :closable="true"
    :close-on-escape="true"
    :dismissable-mask="true"
    :header="props.title"
    :style="{ width: '50rem' }"
    @hide="handleHide"
  >
    <slot />

    <template #footer>
      <AppButton
        data-testid="cancel-button"
        class="dialog-button"
        severity="secondary"
        :label="cancelLabel"
        variant="outlined"
        @click="handleCancel"
      />
      <AppButton
        data-testid="confirm-button"
        class="dialog-button"
        :label="confirmLabel"
        :loading="loading"
        @click="handleConfirm"
      />
    </template>
  </Dialog>
</template>

<style scoped>
.dialog-button {
  width: 220px;
}

@media (max-width: 500px) {
  .dialog-button {
    width: 100%;
  }
}
</style>
