import { z } from "zod";
import { ORDER_MESSAGE } from "../../constants/api-messages.constant";
import { getPayloadClient } from "../../payload/get-client-payload";
import { Order } from "../../payload/payload-types";
import { throwTrpcInternalServer } from "../../utils/server/error-server.util";
import { getUserProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";

const cancelReasons: Record<
  NonNullable<Order["cancelReason"]>,
  NonNullable<Order["cancelReason"]>
> = {
  "add-change-coupon-code": "add-change-coupon-code",
  "another-reason": "another-reason",
  "bad-service-quality": "bad-service-quality",
  "dont-want-to-buy": "dont-want-to-buy",
  "update-address-phone-number": "update-address-phone-number",
};
const OrderRouter = router({
  cancelOrder: getUserProcedure
    .input(
      z.object({
        orderId: z.string(),
        cancelReason: z
          .literal(cancelReasons["add-change-coupon-code"])
          .or(z.literal(cancelReasons["another-reason"]))
          .or(z.literal(cancelReasons["bad-service-quality"]))
          .or(z.literal(cancelReasons["dont-want-to-buy"]))
          .or(z.literal(cancelReasons["update-address-phone-number"])),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const payload = await getPayloadClient();
      const { user } = ctx;
      const { orderId, cancelReason } = input;
      // check if the same user otherwise login user knows the orderId can cancel other order
      const order = await payload.findByID({
        collection: "orders",
        id: orderId,
      });
      if (!order)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: ORDER_MESSAGE.NOT_FOUND,
        });
      let orderUserId = order.orderBy.value;
      if (typeof order.orderBy.value === "object") {
        // orderUserId=
        orderUserId = order.orderBy.value.id;
      }
      console.log(orderUserId,user.id)
      console.log(order.orderBy.value === user.id)
      if (order.orderBy.value !== user.id)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: ORDER_MESSAGE.BAD_REQUEST,
        });
      try {
        await payload.update({
          collection: "orders",
          id: orderId,
          data: {
            cancelReason,
            status: "canceled",
            deliveryStatus: "canceled",
          },
        });
        return { success: true, message: ORDER_MESSAGE.SUCCESS_CANCEL_ORDER };
      } catch (error) {
        throwTrpcInternalServer(error);
      }
    }),
});
export default OrderRouter;
