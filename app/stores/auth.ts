import { defineStore } from "pinia";
import { LOGIN, ME, SIGNUP } from "~/graphql/auth";
import type { User } from "~/types/auth";
import type {
  AuthMutation,
  AuthQuery,
  AuthVariables,
} from "~/graphql/auth/types";
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

  function setTokens(access_token: string, refresh_token: string) {
    accessToken.value = access_token;
    refreshToken.value = refresh_token;
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
  }

  async function initAuth() {
    const access_token = localStorage.getItem("access_token");
    const refresh_token = localStorage.getItem("refresh_token");

    if (!access_token || !refresh_token) return;

    accessToken.value = access_token;
    refreshToken.value = refresh_token;
    const payload = parseJwt(accessToken.value);

    if (!payload) return;

    const fetchedUser = await fetchMe(payload?.sub);
    if (!fetchedUser) return;

    applyAuthSession(
      createAuthSession({ user: fetchedUser, access_token, refresh_token }),
    );
  }

  async function fetchMe(userId: number) {
    try {
      const { data } = await $apollo.query<{ user: User }>({
        query: ME,
        variables: {
          userId,
        },
      });

      if (!data) return;

      return data.user;
    } catch {
      console.log("fetch user data error");
      Logout();
    }
  }

  return {
    user,
    refreshToken,
    accessToken,
    isAuthenticated,
    Login,
    SignUp,
    Logout,
    setTokens,
    initAuth,
  };
});
