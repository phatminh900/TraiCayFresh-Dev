import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getPayloadClient } from "../../payload/get-client-payload";

import { isEmailUser } from "../../utils/util.utls";
import getUserProcedure from "../middlewares/get-user-procedure";
import { router } from "../trpc";

import { REVIEW_MESSAGE } from "../../constants/api-messages.constant";
export const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const ReviewRouter = router({
  createReview: getUserProcedure
    .use(({ next, ctx }) => {
      ctx.req.headers["content-type"] = "multipart/form-data";
      return next();
    })

    .input(
      z.object({
        productId: z.string(),
        rating: z.number().min(1).max(5),
        reviewText: z.string().optional(),
        img:z.any(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { user, req } = ctx;
      const { rating, reviewText, productId, img } = input;
      console.log("-----img");
      console.log(img);
      try {
        const payload = await getPayloadClient();
        // check if user already bought the product
        const { docs: userOrders } = await payload.find({
          collection: "orders",
          depth: 0,
          where: {
            "orderBy.value": {
              equals: user.id,
            },
          },
        });

        if (
          !userOrders.length ||
          !userOrders?.some((order) => {
            return (
              order._isPaid &&
              order.items.find((item) => item.product === productId)
            );
          })
        ) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: REVIEW_MESSAGE.BAD_REQUEST,
          });
        }

        await payload.create({
          collection: "reviews",
          data: {
            rating,
            product: productId,
            user: {
              value: user.id,
              relationTo: isEmailUser(user)
                ? "customers"
                : "customer-phone-number",
            },

            reviewText,
            // reviewImgs: imgs,
          },
        });
        return { success: true, message: REVIEW_MESSAGE.SUCCESS };
      } catch (error) {
        throw error;
      }
    }),
});
export default ReviewRouter;
