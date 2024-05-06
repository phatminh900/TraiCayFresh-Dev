import { getPayloadClient } from "@/payload/get-client-payload";

export const getProductReviews = async ({
  productId,
}: {
  productId: string;
}) => {
  try {
    const payload = await getPayloadClient();
    const { docs: reviews } = await payload.find({
      collection: "reviews",
      where: {
        product: {
          equals: productId,
        },
      },
    });

    return { success: true, data: reviews };
  } catch (error) {
    return { ok: false, data: null };
  }
};

export const checkUserHasReviewed = async ({
  userId,
  productId,
}: {
  userId: string;
  productId: string;
}) => {
  try {
    const payload = await getPayloadClient();
    const { docs: userReview } = await payload.find({
      collection: "reviews",
      where: {
        and: [
          {
            "user.value": {
              equals: userId,
            },
          },
          {
            product: {
              equals: productId,
            },
          },
        ],
      },
    });

    if (!userReview.length) return { success: true, data: null };
    return { success: true, data: userReview };
  } catch (error) {
    return { ok: false, data: null };
  }
};
