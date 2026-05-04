import { defineStore } from "pinia";
import { UPDATE_PROFILE } from "~/graphql/profile";
import { USERS, CREATE_USER, UPDATE_USER, DELETE_USER } from "~/graphql/users";
import type { UserListItem } from "~/types/user";
import type {
  CreateUserInput,
  UsersListQuery,
  CreateUserMutation,
  UpdateUserInput,
  UpdateProfileInput,
  UpdateUserMutation,
  UpdateProfileMutation,
} from "~/graphql/users/types";
import { ref } from "vue";

export const useUsersStore = defineStore("users", () => {
  const users = ref<UserListItem[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const { $apollo } = useNuxtApp();

  const fetchUsers = async () => {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await $apollo.query<UsersListQuery>({
        query: USERS,
        // fetchPolicy: "network-only",
      });
      users.value = data?.users ?? [];
    } catch (err) {
      error.value = "Failed to load users";
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const createUser = async (userInput: CreateUserInput) => {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await $apollo.mutate<CreateUserMutation>({
        mutation: CREATE_USER,
        variables: { user: userInput },
      });
      if (!data) return;
      users.value = [...users.value, data.createUser];
    } catch (err) {
      error.value = "Failed to create user";
      console.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateUser = async (
    userInput: UpdateUserInput,
    profileInput: UpdateProfileInput,
  ) => {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await $apollo.mutate<UpdateUserMutation>({
        mutation: UPDATE_USER,
        variables: { user: userInput },
      });

      const { data: profileData } = await $apollo.mutate<UpdateProfileMutation>(
        {
          mutation: UPDATE_PROFILE,
          variables: { profile: profileInput },
        },
      );
      if (!data || !profileData) return;

      const updatedUser = data.updateUser;
      const updatedProfile = profileData.updateProfile;

      const existingUser = users.value.find((u) => u.id === updatedUser.id);
      if (!existingUser) return;

      const mergedUser: UserListItem = {
        ...existingUser,
        ...updatedUser,
        profile: {
          ...existingUser.profile,
          ...updatedProfile,
        },
      };

      users.value = users.value.map((u) =>
        u.id === mergedUser.id ? mergedUser : u,
      );
      return mergedUser;
    } catch (err) {
      error.value = "Failed to update user";
      console.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteUser = async (userId: string) => {
    loading.value = true;
    error.value = null;
    try {
      await $apollo.mutate({
        mutation: DELETE_USER,
        variables: { userId },
      });
      users.value = users.value.filter((u) => u.id !== userId);
    } catch (err) {
      error.value = "Failed to delete user";
      console.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  };
});
