import type { Customer } from "@/payload/payload-types";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { NextRequest } from "next/server";
import { API_ROUTES } from "@/constants/api-route.constant";
import { callApi } from "@/utils/service.util";
import { COOKIE_NAME_AUTH } from "@/constants/constants.constant";

export const getMeServer = async (
  cookies: NextRequest["cookies"] | ReadonlyRequestCookies
) => {
  const token = cookies.get(COOKIE_NAME_AUTH)?.value;
  if (!token) return { ok: false };
  const data = await callApi<{ user: Customer }>({
    url: API_ROUTES.me,
    credentials: "include",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};
export const logOutUser = async () => {
  const data = await callApi({
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    url: API_ROUTES.logOut,
  });
  return data;
};

export const forgotPassword = async (email: string) => {
  const result = await callApi({
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: { email },
    url: API_ROUTES.forgotPassword,
  });
  return result;
};
// export const resetPassword = async (token: string,password) => {
//   const result = await callApi({
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     data: { token ,password},
//     url: API_ROUTES.forgotPassword,
//   });
//   return result;
// };
