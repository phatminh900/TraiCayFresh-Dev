import { initTRPC } from "@trpc/server";
import { Context } from "./context";
import { TRPCError } from "@trpc/server";
import cookie from "cookie";
import { PayloadRequest } from "payload/types";
import { Customer } from "@/payload/payload-types";
import { COOKIE_USER_PHONE_NUMBER_TOKEN } from "../constants/configs.constant";
import { AUTH_MESSAGE, USER_MESSAGE } from "../constants/api-messages.constant";
import { ERROR_JWT_CODE, verifyToken } from "../utils/auth.util";
import { getPayloadClient } from "../payload/get-client-payload";
const t = initTRPC.context<Context>().create();

// Base router and procedure helpers

const authMiddleWare = t.middleware(async ({ ctx, next }) => {
  const req = ctx.req as PayloadRequest;
  const user = req.user as Customer | null;
  if (!user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Vui lòng đăng nhập",
    });
  }
  return next({
    ctx: {
      user,
    },
  });
});

export const router = t.router;

export const publicProcedure = t.procedure;
export enum USER_TYPE {
  email = "email",
  phoneNumber = "phoneNumber",
}
export const getUserProcedure = publicProcedure.use(async ({ ctx, next }) => {
  // if user exists ==> payload user login by email
  const req = ctx.req as PayloadRequest;
  const user = req.user as Customer;
  if (user) {
    return next({ ctx: { user, type: USER_TYPE.email } });
  }

  const headerCookie = ctx.req.headers.cookie;
  const parsedCookie = cookie.parse(headerCookie || "");
  const token = parsedCookie[COOKIE_USER_PHONE_NUMBER_TOKEN];
  if (!token)
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: AUTH_MESSAGE.INVALID_OTP,
    });
  const decodedToken = await verifyToken(token);
  decodedToken
  if(decodedToken.code===ERROR_JWT_CODE.ERR_JWS_INVALID){
    throw new TRPCError({code:"BAD_REQUEST",message:AUTH_MESSAGE.INVALID_OTP})
  }
  if(decodedToken.code===ERROR_JWT_CODE.ERR_JWT_EXPIRED){
    throw new TRPCError({code:"BAD_REQUEST",message:AUTH_MESSAGE.EXPIRED})
  }
  
  // @ts-ignore
  const userId = decodedToken?.userId
  const payload = await getPayloadClient();
  const userPhoneNumber = await payload.findByID({
    collection: "customer-phone-number",
    id: userId,
  });
  if (!userPhoneNumber)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: USER_MESSAGE.NOT_FOUND,
    });
  return next({ ctx: { user: userPhoneNumber, type: USER_TYPE.phoneNumber } });
});

export const privateProcedure = t.procedure.use(authMiddleWare);
