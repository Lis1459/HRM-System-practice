<script setup lang="ts">
import { computed, ref } from "vue";
import { useAuthStore } from "~/stores/auth";
import { useAppToast } from "~/composables/useAppToast";
import ArrowIcon from "~/components/icons/ArrowIcon.vue";
import AngleRightIcon from "~/components/icons/AngleLeftIcon.vue";

const authStore = useAuthStore();
const { successToast } = useAppToast();

const currentUser = computed(() => authStore.user);
const isAdmin = computed(() => currentUser.value?.role === "Admin");

const columns = [
  { key: "firstName", label: "First name", min_width: "173", sortable: true },
  { key: "lastName", label: "Last name", min_width: "173", sortable: true },
  { key: "email", label: "Email", min_width: "320", sortable: true },
  { key: "department", label: "Department", min_width: "163", sortable: true },
  { key: "position", label: "Position", min_width: "203", sortable: true },
] as const;

type SortKey = (typeof columns)[number]["key"];

const search = ref("");
const sortKey = ref<SortKey>("firstName");
const sortOrder = ref<"asc" | "desc">("asc");

const actionsMenu = ref([
  {
    label: "Edit",
    icon: "pi pi-file-edit",
    command: () => successToast("Open profile"),
  },
  {
    label: "Delete",
    icon: "pi pi-delete-left",
    command: () => successToast("Open settings"),
  },
]);

const filteredUsers = computed(() => {
  const query = search.value.trim().toLowerCase();
  const rows = users.value.filter((item) => {
    const fullName = `${item.firstName} ${item.lastName}`.toLowerCase();
    return fullName.includes(query);
  });

  return [...rows].sort((a, b) => {
    const left = String(a[sortKey.value]).toLowerCase();
    const right = String(b[sortKey.value]).toLowerCase();

    if (left < right) {
      return sortOrder.value === "asc" ? -1 : 1;
    }
    if (left > right) {
      return sortOrder.value === "asc" ? 1 : -1;
    }
    return 0;
  });
});

const breadcrumbItems = [{ label: "Employees", to: "/users" }];

const toggleSort = (key: typeof sortKey.value) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortKey.value = key;
    sortOrder.value = "asc";
  }
};

// const handleEdit = (user: {
//   email: string;
//   firstName: string;
//   lastName: string;
// }) => {
//   successToast(`Open edit form for ${user.firstName} ${user.lastName}`);
// };

const handleCreate = () => {
  successToast("Open create new user form");
};

// const handleDelete = (user: { firstName: string; lastName: string }) => {
//   successToast(`Delete ${user.firstName} ${user.lastName}`);
// };
</script>

<template>
  <section class="users-page">
    <div class="users-page__header">
      <Breadcrumb :model="breadcrumbItems" class="users-breadcrumb" />
      <div class="users-page__controls">
        <SearchInput v-model="search" name="serach" placeholder="Search" />
        <AppButton
          v-if="isAdmin"
          icon="pi pi-plus"
          variant="text"
          label="CREATE USER"
          class="create-button"
          @click="handleCreate"
        />
      </div>
    </div>

    <div class="users-table-wrapper">
      <table class="users-table">
        <thead class="users-table__head">
          <tr>
            <th class="avatar-column" />
            <th
              v-for="col in columns"
              :key="col.key"
              :class="{ sortable: col.sortable }"
              @click="col.sortable && toggleSort(col.key)"
            >
              <div class="th-content">
                {{ col.label }}
                <ArrowIcon
                  class="sortable__icon"
                  :class="{ active: sortKey === col.key }"
                  :style="{
                    transform: `rotate(${sortOrder === 'asc' ? 0 : 180}deg)`,
                  }"
                />
              </div>
            </th>
            <th />
          </tr>
        </thead>
        <tbody class="users-table__body">
          <tr v-for="user in filteredUsers" :key="user.id" class="user-row">
            <td class="avatar-cell">
              <div class="avatar-wrapper">
                <Avatar :image="user.avatar" shape="circle" class="avatar" />
              </div>
            </td>
            <td class="user-table__cell">{{ user.firstName }}</td>
            <td class="user-table__cell">{{ user.lastName }}</td>
            <td class="user-table__cell">{{ user.email }}</td>
            <td class="user-table__cell">{{ user.department }}</td>
            <td class="user-table__cell">{{ user.position }}</td>
            <td class="actions-cell">
              <div class="avatar-wrapper">
                <MenuButton
                  v-if="isAdmin || user.id === currentUser?.id"
                  :model="actionsMenu"
                >
                  <i class="pi pi-ellipsis-v" />
                </MenuButton>
                <Button
                  v-else
                  type="button"
                  class="profile-button"
                  variant="text"
                  severity="secondary"
                >
                  <AngleRightIcon class="angle-icon" />
                </Button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>
.users-page {
  height: 100vh;
  padding: 24px 16px 24px;
  display: flex;
  flex-direction: column;
}

.users-page__header {
  padding: 0px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.users-page__controls {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  align-items: center;
  justify-content: space-between;
}

.create-button {
  min-width: 156px;
}

.users-breadcrumb {
  color: var(--p-surface-60);
  padding: 0;
  margin: 0;
}

.users-table-wrapper {
  /* flex: 1; */
  width: 100%;
  min-width: 0;
  /* display: flex; */
  overflow-y: auto;
  overflow-x: auto;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
  overflow: hidden;
}

.sortable__icon {
  width: 18px;
  height: 18px;
  opacity: 0;
}

.sortable__icon.active {
  opacity: 1;
}

.users-table__head {
  color: var(--p-text-muted-color);
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 0.01em;
  text-transform: uppercase;
  white-space: nowrap;
  background-color: #f5f5f7;
  border-bottom: 1px solid var(--p-surface-10);
  position: sticky;
  top: 0;
}

.users-table-wrapper::-webkit-scrollbar:vertical {
  width: 6px;
}

.users-table-wrapper::-webkit-scrollbar:horizontal {
  height: 6px;
}

.users-table-wrapper::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
}

.users-table-wrapper::-webkit-scrollbar-track {
  background: transparent;
}

.avatar-column {
  width: 80px;
}

.avatar-cell {
  white-space: nowrap;
}

.avatar-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.user-table__cell {
  overflow: hidden;
  padding-left: 16px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-row {
  height: 73px;
  border-bottom: 1px solid var(--p-surface-10);
}

.sortable {
  cursor: pointer;
  user-select: none;
}

.th-content {
  padding: 17px 0;
  padding-left: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.avatar {
  width: 40px;
  height: 40px;
}

.angle-icon {
  width: 24px;
  height: 24px;
  transform: rotate(180deg);
}

.profile-button {
  padding: 10px;
}

@media (max-width: 1024px) {
  .users-table {
    min-width: 900px;
  }
}

@media (max-width: 768px) {
  .users-table {
    min-width: 800px;
  }
}

@media (max-width: 480px) {
  .users-page__controls {
    flex-direction: column;
    justify-content: center;
    gap: 10px;
  }

  .create-button {
    width: 100%;
  }

  .users-table {
    min-width: 700px;
  }
}

.action-button {
  min-width: 84px;
}
</style>
