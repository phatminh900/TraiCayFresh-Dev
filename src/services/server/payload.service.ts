import 'server-only'

import type { UserCart } from "@/app/cart/types/user-cart.type";
import { getPayloadClient } from "@/payload/get-client-payload";
import {
  CartItems, Customer,
  CustomerPhoneNumber,
  Product
} from "@/payload/payload-types";

export const getProducts = async () => {
  try {
    const payload = await getPayloadClient();
    const { docs: products } = await payload.find({
      collection: "products",
      // Only get 3 products to shows
      limit: 3,
      where: {
        priority: {
          equals: true,
        },
      },
    });
    return { data:products,ok:true };
  } catch (error) {
    console.error(error)
    return {ok:false,data:null}

  }
};

export const getProduct = async ({ id }: { id: string}) => {
  
  try {
    const payload = await getPayloadClient();
    // await payload[config['authenticate']]
    // payload['']
    const product = await payload.findByID({
      collection: "products",
      id,
    });
    
    return {ok:true ,data:product };
  } catch (error) {
    console.error(error)
    return {ok:false,data:null}
    // throw new Error(GENERAL_ERROR_MESSAGE);
  }
};
export const getUserCartServer = async ({
  items,
}: {
  items?: CartItems | undefined;
}) => {
  if (!items) return {ok:false,data:null};
  const productIds = items?.map((item) => item.product);
  const cartItemsMap = new Map<string, number>();
  items.forEach((item) => {
    if (item.quantity && item.product)
      cartItemsMap.set(item.product as string, item?.quantity);
  });
  const payload = await getPayloadClient();
  try {
    const { docs } = await payload.find({
      collection: "products",
      where: {
        id: {
          in: productIds,
        },
      },
    });
    const cartItems = docs.map((doc) => {
      const productInCartQuantity = cartItemsMap.get(doc.id);
      return { ...doc, quantity: productInCartQuantity || 1 };
    });
    return { ok:true,data:{cart: cartItems }};
  } catch (error) {
    console.error(error)
    return {ok:false}

  }
};

export const getOrderStatus=async({orderId}:{orderId:string})=>{
  try {
    const payload=await getPayloadClient()
    const order=await payload.findByID({collection:'orders',id:orderId})
    return {success:true,data:order}
  } catch (error) {
    console.error(error)
      return {ok:false,data:null}
    
  }
}

export const getCartOfUser = async (
  type: "phoneNumber" | "email",
  userId?: string
) => {
  try {
    let userCart: UserCart = [];
    if (!userId) return {ok:false,data:userCart};
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

    return { ok: true,data: userCart };
  } catch (error) {
    console.error(error)
    return {
      ok: false,
      data:null
    }
  }
};