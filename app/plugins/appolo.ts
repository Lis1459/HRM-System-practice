import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  Observable,
  CombinedGraphQLErrors,
} from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";
import { ErrorLink } from "@apollo/client/link/error";
import { useAuthStore } from "~/stores/auth";
import { refreshTokenRequest } from "~/utils/refreshTokenRequest";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  const authLink = new SetContextLink((prevContext) => {
    const authStore = useAuthStore();

    const token = import.meta.client
      ? // ? localStorage.getItem("access_token")
        authStore.accessToken
      : null;
    return {
      headers: {
        ...prevContext.headers,
        Authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  const httpLink = new HttpLink({
    uri: config.public.apiUrl,
  });

  const errorLink = new ErrorLink(({ error, operation, forward }) => {
    if (!CombinedGraphQLErrors.is(error)) return;

    for (const err of error.errors) {
      console.log(err.extensions?.code);
      if (err.extensions?.code === "UNAUTHENTICATED") {
        const authStore = useAuthStore();
        console.log("refetch");

        if (!authStore.refreshToken) {
          authStore.Logout();
          return;
        }

        return new Observable((observer) => {
          refreshTokenRequest(authStore.refreshToken)
            .then((tokens) => {
              if (!tokens) {
                authStore.Logout();
                observer.error(new Error("Refresh failed"));
                return;
              }

              authStore.setTokens(tokens.access_token, tokens.refresh_token);
              console.log("apply new tokens");

              operation.setContext(({ headers = {} }) => ({
                headers: {
                  ...headers,
                  Authorization: `Bearer ${tokens.access_token}`,
                },
              }));

              forward(operation).subscribe({
                next: (result) => observer.next(result),
                error: (err) => observer.error(err),
                complete: () => observer.complete(),
              });
            })
            .catch((err) => {
              authStore.Logout();
              observer.error(err);
            });
        });
      }
    }
  });

  const apollo = new ApolloClient({
    link: authLink.concat(errorLink).concat(httpLink),
    cache: new InMemoryCache(),
    ssrMode: import.meta.server,
  });

  return {
    provide: {
      apollo,
    },
  };
});
