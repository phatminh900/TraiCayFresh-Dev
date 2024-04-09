import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import type { NextRequest } from "next/server";
import type { UserCart } from "@/app/cart/types/user-cart.type";
import { getMeServer } from "./auth.service";
import { getUserCartServer } from "./payload.service";

export const getCartOfUser = async (
  cookies: NextRequest["cookies"] | ReadonlyRequestCookies
) => {
  const data = await getMeServer(cookies);
  let userCart: UserCart = [];
  if (data.result?.user.cart) {
    const cartData = await getUserCartServer(data.result?.user.cart!);
    userCart = cartData?.cart || [];
  }
  return userCart;
};
