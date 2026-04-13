import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client/core";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  const apollo = new ApolloClient({
    link: new HttpLink({
      uri: config.public.apiUrl,
    }),
    cache: new InMemoryCache(),
    ssrMode: import.meta.server,
  });

  return {
    provide: {
      apollo,
    },
  };
});
