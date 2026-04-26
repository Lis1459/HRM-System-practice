import type { Tokens } from "~/types/appolo";

export const refreshTokenRequest = async (
  refreshToken: string | null,
): Promise<Tokens | null> => {
  const config = useRuntimeConfig();
  console.log("refresh token", refreshToken);

  const res = await fetch(config.public.apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${refreshToken}`,
    },
    body: JSON.stringify({
      query: `
         mutation UpdateToken {
          updateToken {
            access_token
            refresh_token
          }
         }
      `,
    }),
  });

  const json = await res.json();

  return json.data?.updateToken ?? null;
};
