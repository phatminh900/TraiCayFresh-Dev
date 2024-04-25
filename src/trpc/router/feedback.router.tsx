import { z } from "zod";
import { getUserProcedure, router } from "../trpc";
import { INVALID_FEEDBACK } from "../../constants/validation-message.constant";
import { getPayloadClient } from "../../payload/get-client-payload";
import { throwTrpcInternalServer } from "../../utils/server/error-server.util";
import { isEmailUser } from "../../utils/util.utls";
import { Feedback } from "../../payload/payload-types";

const preFilledFeedback:Record<NonNullable<Feedback['feedbackOption']>,NonNullable<Feedback['feedbackOption']>>={
  'better-serve-attitude':'better-serve-attitude',
  'delivery-faster':'delivery-faster'
}

const FeedbackRouter = router({
  createFeedback: getUserProcedure
    .input(z.object({ feedback: z.string().min(10, INVALID_FEEDBACK) ,feedBackOption:z.literal(preFilledFeedback['better-serve-attitude']).or(z.literal(preFilledFeedback['delivery-faster'])).optional()}))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { feedBackOption,feedback } = input;

      try {
        const payload = await getPayloadClient();
        await payload.create({
          collection: "feedback",
          data: {
            feedback,
            feedbackOption:feedBackOption,
            user: {
              value: user.id,
              relationTo: isEmailUser(user)
                ? "customers"
                : "customer-phone-number",
            },
          },
        });
      } catch (error) {
        throwTrpcInternalServer(error);
      }
    }),
    // TODO: finish trpc CRUD
    // getFeedbacks: getUserProcedure
    // .input(z.object({ feedback: z.string().min(10, INVALID_FEEDBACK) }))
    // .mutation(async ({ ctx, input }) => {
    //   const { user } = ctx;
    //   const { feedback } = input;

    //   try {
    //     const payload = await getPayloadClient();
    //     await payload.create({
    //       collection: "feedback",
    //       data: {
    //         feedback,
    //         user: {
    //           value: user.id,
    //           relationTo: isEmailUser(user)
    //             ? "customers"
    //             : "customer-phone-number",
    //         },
    //       },
    //     });
    //   } catch (error) {
    //     throwTrpcInternalServer(error);
    //   }
    // }),
});

export default FeedbackRouter