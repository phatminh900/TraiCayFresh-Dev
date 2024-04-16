import { RateLimiterMemory } from "rate-limiter-flexible";
import { z } from "zod";
import cookie from "cookie";
import { PayloadRequest } from "payload/types";
import {
  AUTH_MESSAGE,
  COUPON_MESSAGE,
  USER_MESSAGE,
} from "../../constants/api-messages.constant";
import { COOKIE_USER_PHONE_NUMBER_TOKEN } from "../../constants/constants.constant";
import { CartItems, Customer, Product } from "../../payload/payload-types";
import { verifyToken } from "../../utils/auth.util";
import { TRPCError } from "@trpc/server";

import { getPayloadClient } from "../../payload/get-client-payload";
import { publicProcedure, router } from "../trpc";
import { throwTrpcInternalServer } from "../../utils/server/error-server.util";

enum USER_TYPE {
  email = "email",
  phoneNumber = "phoneNumber",
}

const rateLimiter = new RateLimiterMemory({
  // FIXME: change later
  points: 100, // max number of points
  duration: 60 * 60, // per 1 hour,
});

const getUserProcedure = publicProcedure.use(async ({ ctx, next }) => {
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
      message: AUTH_MESSAGE.INVALID_OR_EXPIRED,
    });
  const decodedToken = await verifyToken(token);
  const userId = decodedToken.userId;
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

const rateLimitMiddleware = getUserProcedure.use(async ({ ctx, next }) => {
  try {
    const req = ctx.req as PayloadRequest;
    await rateLimiter.consume(ctx.req.ip || req.user); // assuming ctx.ip is the user's IP
    return next();
  } catch (err) {
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: "Too many requests from this IP, please try again in an hour!",
    });
  }
});

const CouponRouter = router({
  applyCoupon: rateLimitMiddleware

    .input(z.object({ coupon: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { user, type } = ctx;
      const { coupon } = input;
      const payload = await getPayloadClient();
      const { docs: coupons } = await payload.find({
        collection: "coupons",
        where: { coupon: { equals: coupon } },
      });
      if (!coupons.length)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: COUPON_MESSAGE.INVALID,
        });
      // check if the coupon still valid
      const couponInDb = coupons[0];
      if (new Date(couponInDb.expiryDate!).getTime() - Date.now() < 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: COUPON_MESSAGE.EXPIRED,
        });
      }
      const isAppliedCoupon = user.cart?.items?.every(
        (item) => item.isAppliedCoupon
      );
      if (isAppliedCoupon)
        throw new TRPCError({
          code: "CONFLICT",
          message: COUPON_MESSAGE.ALREADY_APPLIED,
        });

      // apply coupon
      const updatedUserCart: CartItems = user.cart!.items!.map(
        ({ product, quantity, isAppliedCoupon, priceAfterCoupon,...rest }) => {
          const cartProduct = product! as Product;
          if (!isAppliedCoupon) {
            const totalPrice =
              (cartProduct.priceAfterDiscount || cartProduct.originalPrice) *
              quantity!;
            const priceAfterCoupon =
              totalPrice - (couponInDb.discount * totalPrice) / 100;
            return {
              ...rest,
              product: cartProduct.id,
              discountAmount:couponInDb.discount,
              quantity,
              isAppliedCoupon: true,
              priceAfterCoupon,
            };
          }
          return {
            ...rest,
            product: cartProduct.id,
            quantity,
            isAppliedCoupon,
            priceAfterCoupon,
          };
        }
      );
      try {
        if (type === USER_TYPE.email) {
          await payload.update({
            collection: "customers",
            where: { id: { equals: user.id } },
            data: { cart: { items: updatedUserCart } },
          });
          return { success: true, message: COUPON_MESSAGE.SUCCESS };
        }
        if (type === USER_TYPE.phoneNumber) {
          await payload.update({
            collection: "customer-phone-number",
            where: { id: { equals: user.id } },
            data: { cart: { items: [] } },
          });
          return { success: true, message: COUPON_MESSAGE.SUCCESS };
        }
      } catch (error) {
        throwTrpcInternalServer(error);
      }
    }),
});

export default CouponRouter;
