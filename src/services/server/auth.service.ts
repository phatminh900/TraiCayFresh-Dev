import 'server-only';

import { NextRequest } from "next/server";

import { API_ROUTES } from "@/constants/api-routes.constant";
import {
  COOKIE_PAYLOAD_TOKEN,
  COOKIE_USER_PHONE_NUMBER_TOKEN,
} from "@/constants/constants.constant";
import { getPayloadClient } from "@/payload/get-client-payload";
import type { Customer } from "@/payload/payload-types";
import { verifyToken } from "@/utils/auth.util";
import { callApi } from "@/utils/service.util";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export const getUserPhoneNumberProfile = async (token: string) => {
    const payload = await getPayloadClient();
    const tokenResult = await verifyToken(token);
    const userId = tokenResult?.userId;
    const user = await payload.findByID({
      collection: "customer-phone-number",
      id: userId as string,
    });
    return user;
  };


export const getMeServer = async (token?: string) => {
    if (!token) return { ok: false };
    const data = await callApi<{ user: Customer }>({
      url: `${API_ROUTES.me}?depth=2`,
      credentials: "include",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  };
  

export const getUserServer = async (
    cookies: NextRequest["cookies"] | ReadonlyRequestCookies
  ) => {
    const payloadToken = cookies.get(COOKIE_PAYLOAD_TOKEN)?.value;
    if (payloadToken) {
      const userData = await getMeServer(payloadToken);
      const user = userData.result?.user;
  
      return user;
    }
  
    const userToken = cookies.get(COOKIE_USER_PHONE_NUMBER_TOKEN)?.value;
    if (userToken) {
      const user = await getUserPhoneNumberProfile(userToken);
      return user;
    }
    return 
  };
  