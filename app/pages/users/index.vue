<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useAuthStore } from "~/stores/auth";
import { useUsersStore } from "~/stores/users";
import type { UpdateProfileInput } from "~/graphql/users/types";
import { useAppToast } from "~/composables/useAppToast";
import ArrowIcon from "~/components/icons/ArrowIcon.vue";
import AngleLeftIcon from "~/components/icons/AngleLeftIcon.vue";
import AppDialog from "~/components/AppDialog.vue";
import { useConfirm } from "primevue/useconfirm";
import { useRouter } from "vue-router";
import { useDepartmentsStore } from "~/stores/departments";
import { usePositionsStore } from "~/stores/positions";
import { UserRole } from "~/types/auth";

const authStore = useAuthStore();
const usersStore = useUsersStore();
const departmentsStore = useDepartmentsStore();
const positionsStore = usePositionsStore();
const { successToast, errorToast } = useAppToast();
const confirm = useConfirm();
const router = useRouter();

const currentUser = computed(() => authStore.user);
const isAdmin = computed(() => currentUser.value?.role === "Admin");

const users = computed(() => usersStore.users);
const loading = computed(() => usersStore.loading);

const departmentOptions = computed(() =>
  departmentsStore.departments.map((department) => ({
    label: department.name,
    value: String(department.id),
  })),
);

const positionOptions = computed(() =>
  positionsStore.positions.map((position) => ({
    label: position.name,
    value: String(position.id),
  })),
);

const roleOptions: Array<{ label: string; value: UserRole }> = [
  { label: "Employee", value: UserRole.Employee },
  { label: "Admin", value: UserRole.Admin },
];

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

// Dialogs
type CreateUserForm = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  departmentId: string;
  positionId: string;
  role: UserRole;
};

type EditUserForm = {
  id: string;
  firstName: string;
  lastName: string;
  departmentId: string;
  positionId: string;
  role: UserRole;
};

type UserTableRow = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  avatar: string;
};

const createDialogVisible = ref(false);
const editDialogVisible = ref(false);

// Forms
const createForm = ref<CreateUserForm>({
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  departmentId: "",
  positionId: "",
  role: UserRole.Employee,
});

const editForm = ref<EditUserForm>({
  id: "",
  firstName: "",
  lastName: "",
  departmentId: "",
  positionId: "",
  role: UserRole.Employee,
});

const getActionsMenu = (user: UserTableRow) => {
  const isOwnProfile = user.id === currentUser.value?.id;
  const menu = [];

  menu.push({
    label: "Edit",
    icon: "pi pi-file-edit",
    command: () => handleEdit(user),
  });

  if (isAdmin.value && !isOwnProfile) {
    menu.push({
      label: "Delete",
      icon: "pi pi-delete-left",
      command: () => handleDelete(user),
    });
  }

  return menu;
};

const filteredUsers = computed(() => {
  const query = search.value.trim().toLowerCase();
  const rows = users.value
    .map((user) => ({
      id: user.id,
      firstName: user.profile?.first_name,
      lastName: user.profile?.last_name,
      email: user.email,
      department: user.department?.name,
      position: user.position?.name,
      avatar: user.profile?.avatar,
    }))
    .filter((item) => {
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

console.log("Users: ", users.value);

const toggleSort = (key: typeof sortKey.value) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortKey.value = key;
    sortOrder.value = "asc";
  }
};

const handleCreate = () => {
  console.log("UserRole", UserRole.Employee);
  createForm.value = {
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    departmentId: "",
    positionId: "",
    role: UserRole.Employee,
  };
  createDialogVisible.value = true;
};

const handleEdit = (user: UserTableRow) => {
  const userData = users.value.find((u) => u.id === user.id);
  if (userData) {
    editForm.value = {
      id: userData.id,
      firstName: userData.profile?.first_name,
      lastName: userData.profile?.last_name,
      departmentId: String(userData.department?.id || ""),
      positionId: String(userData.position?.id || ""),
      role: userData.role,
    };
    editDialogVisible.value = true;
  }
};

const handleDelete = (user: UserTableRow) => {
  confirm.require({
    message: `Are you sure you want to delete ${user.firstName} ${user.lastName}?`,
    header: "Delete User",
    icon: "pi pi-exclamation-triangle",
    rejectProps: {
      label: "Cancel",
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: "Save",
    },
    accept: () => {
      deleteUser(user.id);
    },
  });
};

const handleProfileClick = (user: UserTableRow) => {
  router.push(`/users/${user.id}`);
};

const createUser = async () => {
  console.log("CreateForm: ", createForm);
  try {
    await usersStore.createUser({
      auth: {
        email: createForm.value.email,
        password: createForm.value.password,
      },
      profile: {
        first_name: createForm.value.firstName,
        last_name: createForm.value.lastName,
      },
      cvsIds: ["1"],
      departmentId: Number(createForm.value.departmentId),
      positionId: Number(createForm.value.positionId),
      role: createForm.value.role,
    });
    successToast("User created successfully");
    createDialogVisible.value = false;
  } catch {
    errorToast("Failed to create user");
  }
};

const updateUser = async () => {
  try {
    const existingUser = users.value.find((u) => u.id === editForm.value.id);
    if (!existingUser) return;

    const userPayload = {
      userId: editForm.value.id,
      role: editForm.value.role,
      departmentId: Number(editForm.value.departmentId),
      positionId: Number(editForm.value.positionId),
    };

    const profilePayload: UpdateProfileInput = {
      userId: editForm.value.id,
      first_name: editForm.value.firstName,
      last_name: editForm.value.lastName,
    };
    console.log("userPayload: ", userPayload);

    await usersStore.updateUser(userPayload, profilePayload);
    successToast("User updated successfully");
    editDialogVisible.value = false;
  } catch {
    errorToast("Failed to update user");
  }
};

const deleteUser = async (userId: string) => {
  try {
    await usersStore.deleteUser(userId);
    successToast("User deleted successfully");
  } catch {
    errorToast("Failed to delete user");
  }
};

// Load users, departments and positions on mount
onMounted(() => {
  usersStore.fetchUsers();
  departmentsStore.fetchDepartments();
  positionsStore.fetchPositions();
});
</script>

<template>
  <section class="users-page">
    <div class="users-page__header">
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
        <tbody v-if="!loading" class="users-table__body">
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
                  :model="getActionsMenu(user)"
                >
                  <i class="pi pi-ellipsis-v" />
                </MenuButton>
                <AppButton
                  v-else
                  type="button"
                  variant="text"
                  severity="secondary"
                  class="profile-button"
                  @click="handleProfileClick(user)"
                >
                  <AngleLeftIcon class="angle-icon" />
                </AppButton>
              </div>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="7">
              <div class="spinner-wrapper">
                <AppSpinner />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create User Dialog -->
    <AppDialog
      v-model:visible="createDialogVisible"
      title="Create New User"
      confirm-label="Create"
      cancel-label="Cancel"
      :loading="loading"
      @confirm="createUser"
      @cancel="createDialogVisible = false"
      @hide="createDialogVisible = false"
    >
      <div class="dialog-form">
        <AppFloatLabel label="Email" input-id="create-email">
          <InputText
            id="create-email"
            v-model="createForm.email"
            type="email"
            fluid
            required
          />
        </AppFloatLabel>
        <AppFloatLabel label="Password" input-id="create-password">
          <Password
            id="create-password"
            v-model="createForm.password"
            :feedback="false"
            toggle-mask
            fluid
            required
          />
        </AppFloatLabel>
        <AppFloatLabel label="First Name" input-id="create-first-name">
          <InputText
            id="create-first-name"
            v-model="createForm.firstName"
            fluid
          />
        </AppFloatLabel>
        <AppFloatLabel label="Last Name" input-id="create-last-name">
          <InputText
            id="create-last-name"
            v-model="createForm.lastName"
            fluid
          />
        </AppFloatLabel>
        <AppFloatLabel label="Department" input-id="create-department">
          <Select
            id="create-department"
            v-model="createForm.departmentId"
            :options="departmentOptions"
            option-label="label"
            option-value="value"
            fluid
          />
        </AppFloatLabel>
        <AppFloatLabel label="Position" input-id="create-position">
          <Select
            id="create-position"
            v-model="createForm.positionId"
            :options="positionOptions"
            option-label="label"
            option-value="value"
            fluid
          />
        </AppFloatLabel>
        <AppFloatLabel label="Role" input-id="create-role">
          <Select
            id="create-role"
            v-model="createForm.role"
            :options="roleOptions"
            option-label="label"
            option-value="value"
            :disabled="!isAdmin"
            fluid
            required
          />
        </AppFloatLabel>
      </div>
    </AppDialog>

    <!-- Edit User Dialog -->
    <AppDialog
      v-model:visible="editDialogVisible"
      title="Edit User"
      confirm-label="Update"
      cancel-label="Cancel"
      :loading="loading"
      @confirm="updateUser"
      @cancel="editDialogVisible = false"
      @hide="editDialogVisible = false"
    >
      <div class="dialog-form">
        <AppFloatLabel label="First Name" input-id="edit-first-name" disabled>
          <InputText id="edit-first-name" v-model="editForm.firstName" fluid />
        </AppFloatLabel>
        <AppFloatLabel label="Last Name" input-id="edit-last-name">
          <InputText id="edit-last-name" v-model="editForm.lastName" fluid />
        </AppFloatLabel>
        <AppFloatLabel label="Department" input-id="edit-department">
          <Select
            id="edit-department"
            v-model="editForm.departmentId"
            :options="departmentOptions"
            option-label="label"
            option-value="value"
            fluid
          />
        </AppFloatLabel>
        <AppFloatLabel label="Position" input-id="edit-position">
          <Select
            id="edit-position"
            v-model="editForm.positionId"
            :options="positionOptions"
            option-label="label"
            option-value="value"
            fluid
          />
        </AppFloatLabel>
        <AppFloatLabel label="Role" input-id="edit-role">
          <Select
            id="edit-role"
            v-model="editForm.role"
            :options="roleOptions"
            option-label="label"
            option-value="value"
            :disabled="!isAdmin"
            fluid
          />
        </AppFloatLabel>
      </div>
    </AppDialog>

    <ConfirmDialog />
  </section>
</template>

<style scoped>
.spinner-wrapper {
  height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.users-page {
  height: calc(100vh - 47px);
  padding: 0px 16px;
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

.dialog-form {
  padding: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.users-table-wrapper {
  flex: 1;
  width: 100%;
  min-width: 0;
  /* display: flex; */
  overflow-y: auto;
  overflow-x: auto;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
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
  .dialog-form {
    grid-template-columns: 1fr;
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
