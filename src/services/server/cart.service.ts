import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import type { NextRequest } from "next/server";
import type { UserCart } from "@/app/cart/types/user-cart.type";
import { getMeServer, getUserPhoneNumberProfile } from "./auth.service";
import { getUserCartServer } from "../payload.service";
import {
  COOKIE_PAYLOAD_TOKEN,
  COOKIE_USER_PHONE_NUMBER_TOKEN,
} from "@/constants/constants.constant";
import { getPayloadClient } from "@/payload/get-client-payload";
import {
  CartItems,
  Customer,
  CustomerPhoneNumber,
  Product,
} from "@/payload/payload-types";

export const getCartOfUser = async (
  type: "phoneNumber" | "email",
  userId?: string
) => {
  let userCart: UserCart = [];
  if (!userId) return userCart;
  const payload = await getPayloadClient();
  let user: Customer | CustomerPhoneNumber;
  if (type === "email") {
    user = await payload.findByID({
      collection: "customers",
      id: userId,
      depth: 2,
    });
    if (user.cart?.items) {
      const cartItems = user.cart.items as unknown as {
        product: Product;
        quantity: number;
        id: string;
      }[];
      userCart = cartItems;
    }
  }
  if (type === "phoneNumber") {
    user = await payload.findByID({
      collection: "customer-phone-number",
      id: userId,
      depth: 2,
    });
    if (user.cart?.items) {
      const cartItems = user.cart.items as unknown as {
        product: Product;
        quantity: number;
        id: string;
      }[];
      userCart = cartItems;
    }
  }

  return userCart;
};
