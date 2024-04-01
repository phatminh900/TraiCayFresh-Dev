import { z } from "zod";
import { privateProcedure, router } from "../trpc";
import { getPayloadClient } from "../../payload/get-client-payload";
import { TRPCError } from "@trpc/server";
import { PhoneValidationSchema } from "../../validations/user-infor.valiator";

const getUserProcedure=privateProcedure.use(async({ctx,next})=>{
  const { user } = ctx;
  const payload = await getPayloadClient();
  const userInDb = await payload.findByID({
    collection: "customers",
    id: user.id,
  });
  if (!userInDb)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Không có người dùng nào với tài khoản này",
    });
    return next({ctx:{user:userInDb}})
})

const UserRouter = router({
  addNewPhoneNumber: getUserProcedure
    .input(PhoneValidationSchema)
    .mutation(async ({ ctx, input }) => {
      // TODO: add middleware for this
      const { user } = ctx;
      const { phoneNumber } = input;
      // to make sure have actual user
      const payload = await getPayloadClient();
    
      // with the same phoneNumber
      const isTheSamePhoneNumber = user.phoneNumber?.find(
        (number) => number.phoneNumber === phoneNumber
      );
      if (isTheSamePhoneNumber)
        throw new TRPCError({
          code: "CONFLICT",
          message: "Bạn đã thêm số điện thoại này trước rồi!",
        });

      try {
        await payload.update({
          collection: "customers",
          where: {
            id: { equals: user.id },
          },
          data: {
            phoneNumber: user.phoneNumber?.length
              ? [...user.phoneNumber, { isDefault: false, phoneNumber }]
              : [{ isDefault: true, phoneNumber }],
          },
        });
        return { success: true };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),
  setDefaultPhoneNumber: getUserProcedure
    .input(PhoneValidationSchema)
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { phoneNumber } = input;
      // to make sure have actual user
      const payload = await getPayloadClient();
    
      const phoneNumberUpdatedToDefault = user.phoneNumber?.find(
        (number) => number.phoneNumber === phoneNumber
      );
      if (!phoneNumberUpdatedToDefault || phoneNumberUpdatedToDefault.isDefault)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Không thể đặt làm mặc định vui lòng thử lại sau.",
        });
      const updatedToDefault = user.phoneNumber?.map((number) =>
        number.phoneNumber === phoneNumber
          ? { ...number, isDefault: true }
          : { ...number, isDefault: false }
      );
      try {
        await payload.update({
          collection: "customers",
          where: {
            id: {
              equals: user.id,
            },
          },
          data: {
            phoneNumber: updatedToDefault,
          },
        });
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),
  deletePhoneNumber: getUserProcedure
    .input(PhoneValidationSchema)
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { phoneNumber } = input;
      // to make sure have actual user
      const payload = await getPayloadClient();
     
      if (!user)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Không có người dùng nào với tài khoản này",
        });

      const phoneNumberUpdatedToDefault = user.phoneNumber?.find(
        (number) => number.phoneNumber === phoneNumber
      );
      if (!phoneNumberUpdatedToDefault || phoneNumberUpdatedToDefault.isDefault)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Không thể đặt làm mặc định vui lòng thử lại sau.",
        });
      const updatedPhoneNumbers = user.phoneNumber?.filter(
        (number) => number.phoneNumber !== phoneNumber
      );
      try {
        await payload.update({
          collection: "customers",
          where: {
            id: {
              equals: user.id,
            },
          },
          data: {
            phoneNumber: updatedPhoneNumbers,
          },
        });
        return { deletedPhoneNumber: phoneNumber };
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),
});

export default UserRouter;
