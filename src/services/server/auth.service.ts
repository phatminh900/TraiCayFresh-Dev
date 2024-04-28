import 'server-only';

import { NextRequest } from "next/server";

import { API_ROUTES } from "@/constants/api-routes.constant";

import { COOKIE_PAYLOAD_TOKEN, COOKIE_USER_PHONE_NUMBER_TOKEN } from '@/constants/configs.constant';
import { getPayloadClient } from "@/payload/get-client-payload";
import type { Customer } from "@/payload/payload-types";
import { verifyToken } from "@/utils/auth.util";
import { callApi } from "@/utils/service.util";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

// TODO: check the data fetching
export const getUserPhoneNumberProfile = async (token: string) => {
 try {
  const payload = await getPayloadClient();
  const tokenResult = await verifyToken(token);
  // @ts-ignore
  const userId = tokenResult?.userId;
  if(!userId)   return {ok:false,data:null}  
  const user = await payload.findByID({
    collection: "customer-phone-number",
    id: userId as string,
  });
  return {data:user,ok:true};
 } catch (error) {
  return {ok:false,data:null}  
 }
  };


export const getMeServer = async (token?: string) => {
    try {
      if (!token) return { ok: false };
      const data = await callApi<{ user: Customer }>({
        url: `${API_ROUTES.me}`,
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return {ok:data.ok,data:data.result?.user};
    } catch (error) {
  console.error(error)

      return {ok:false,data:null}
    }
  };
  

export const getUserServer = async (
    cookies: NextRequest["cookies"] | ReadonlyRequestCookies
  ) => {
    try {
      const payloadToken = cookies.get(COOKIE_PAYLOAD_TOKEN)?.value;
      if (payloadToken) {
        const {data:user} = await getMeServer(payloadToken);
        return user;
      }
    
      const userToken = cookies.get(COOKIE_USER_PHONE_NUMBER_TOKEN)?.value;
      if (userToken) {
        const {data:user} = await getUserPhoneNumberProfile(userToken);
        return user;
      }
    } catch (error) {
      // console.log(error)
    }
  };
  