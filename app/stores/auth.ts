import { defineStore } from "pinia";
import { LOGIN, SIGNUP } from "~/graphqj/auth";
import type {
  AuthMutation,
  AuthQuery,
  AuthVariables,
  User,
} from "~/types/auth";
import {
  clearPersistedAuthTokens,
  createAuthSession,
  createAuthVariables,
  persistAuthTokens,
} from "~/utils/auth";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<null | User>(null);
  const refreshToken = ref<null | string>(null);
  const accessToken = ref<null | string>(null);

  const isAuthenticated = computed<boolean>(() =>
    Boolean(refreshToken.value || accessToken.value),
  );

  const { $apollo } = useNuxtApp();

  const applyAuthSession = (session: ReturnType<typeof createAuthSession>) => {
    user.value = session.user;
    accessToken.value = session.accessToken;
    refreshToken.value = session.refreshToken;

    persistAuthTokens(session);
  };

  async function Login(email: string, password: string): Promise<void> {
    const { data } = await $apollo.query<AuthQuery, AuthVariables>({
      query: LOGIN,
      variables: createAuthVariables(email, password),
    });

    if (!data) {
      throw new Error("Something went wrong");
    }

    applyAuthSession(createAuthSession(data.login));
  }

  async function SignUp(email: string, password: string): Promise<void> {
    const { data } = await $apollo.mutate<AuthMutation, AuthVariables>({
      mutation: SIGNUP,
      variables: createAuthVariables(email, password),
    });

    if (!data) {
      throw new Error("Something went wrong");
    }

    applyAuthSession(createAuthSession(data.signup));
  }

  function Logout(): void {
    user.value = null;
    accessToken.value = null;
    refreshToken.value = null;

    clearPersistedAuthTokens();
  }

  return {
    user,
    refreshToken,
    accessToken,
    isAuthenticated,
    Login,
    SignUp,
    Logout,
  };
});
