import { GENERAL_ERROR_MESSAGE } from "@/constants/app-message.constant";
import { getPayloadClient } from "@/payload/get-client-payload";
import { CartItems } from "@/payload/payload-types";

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

export const getOrderStatus=async({orderId}:{orderId:string})=>{
  try {
    const payload=await getPayloadClient()
    const order=await payload.findByID({collection:'orders',id:orderId})
    return {success:true,order}
  } catch (error) {
    console.log(error)
    throw new Error(GENERAL_ERROR_MESSAGE);
    
  }
}