<script setup lang="ts">
import SearchIcon from "./icons/SearchIcon.vue";
interface Props {
  name: string;
  placeholder: string;
}

const { name, placeholder } = defineProps<Props>();

const model = defineModel<string>();
</script>

<template>
  <div class="search-box">
    <SearchIcon class="search-icon" />
    <InputText
      v-model="model"
      :name="name"
      :placeholder="placeholder"
      class="search-box__input"
      aria-label="Search"
    />
  </div>
</template>
<style scoped>
.search-box {
  position: relative;
  width: 100%;
  max-width: 320px;
}
.search-icon {
  width: 24px;
  height: 24px;
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--p-surface-54);
}

.search-box__input {
  height: 40px;
  width: 100%;
  padding: 12px 12px 12px 40px;
  border-radius: 40px;
}

.search-box__input::placeholder {
  color: var(--p-surface-54);
}
</style>
