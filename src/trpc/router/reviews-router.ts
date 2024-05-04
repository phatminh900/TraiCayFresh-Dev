import { z } from "zod";
import { zfd } from 'zod-form-data';
import { Review } from "@/payload/payload-types";
import { TRPCError } from "@trpc/server";
import { getPayloadClient } from "../../payload/get-client-payload";

import { imagesSchema } from "../../validations/img.validation";
import getUserProcedure from "../middlewares/get-user-phone-number.middleware";
import { router } from "../trpc";
import { isEmailUser } from "../../utils/util.utls";

import { REVIEW_MESSAGE } from "../../constants/api-messages.constant";
export const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const ReviewRouter = router({
  createReview: getUserProcedure.use(({next,ctx})=>{
    delete ctx.req.headers['content-type']
    return next()
  })

    .input(
      z.object({
        productId: z.string(),
        rating: z.number().min(1).max(5),
        reviewText: z.string().optional(),
        img:zfd.file().optional()
      })
      // .merge(imagesSchema)
    )
    .mutation(async ({ ctx, input }) => {

      const { user ,req} = ctx;
      const { rating, reviewText, productId, img } = input;
      console.log('-----img')
      console.log(img)
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
