import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import type { NextRequest } from "next/server";
import type { UserCart } from "@/app/cart/types/user-cart.type";
import { getMeServer } from "./server/auth.service";
import { getUserCartServer } from "./payload.service";
import { COOKIE_PAYLOAD_TOKEN } from "@/constants/constants.constant";

export const getCartOfUser = async (
  cookies: NextRequest["cookies"] | ReadonlyRequestCookies
) => {
  const token=cookies.get(COOKIE_PAYLOAD_TOKEN)?.value
  const data = await getMeServer(token);
  let userCart: UserCart = [];
  if (data.result?.user.cart) {
    const cartData = await getUserCartServer(data.result?.user.cart!);
    userCart = cartData?.cart || [];
  }
  return userCart;
};
