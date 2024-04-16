import { API_ROUTES } from "@/constants/api-routes.constant";
import { GENERAL_ERROR_MESSAGE } from "@/constants/constants.constant";
import { getPayloadClient } from "@/payload/get-client-payload";
import { CartItems, Product } from "@/payload/payload-types";
import { callApi } from "@/utils/service.util";

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
    return { products };
  } catch (error) {
    throw new Error(GENERAL_ERROR_MESSAGE);
  }
};

export const getProduct = async ({ id }: { id: string }) => {
  try {
    const payload = await getPayloadClient();
    const product = await payload.findByID({
      collection: "products",
      id,
    });
    return { product };
  } catch (error) {
    throw new Error(GENERAL_ERROR_MESSAGE);
  }
};
export const getUserCartServer = async ({
  items,
}: {
  items?: CartItems | undefined;
}) => {
  if (!items) return;
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
    return { cart: cartItems };
  } catch (error) {
    console.log(error)
    throw new Error(GENERAL_ERROR_MESSAGE);
  }
};
