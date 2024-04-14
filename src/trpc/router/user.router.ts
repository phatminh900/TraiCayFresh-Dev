import { z } from "zod";
import { privateProcedure, router } from "../trpc";
import { getPayloadClient } from "../../payload/get-client-payload";
import { TRPCError } from "@trpc/server";
import {
  AddressValidationSchema,
  PhoneValidationSchema,
} from "../../validations/user-infor.valiator";
import { SignUpCredentialSchema } from "../../validations/auth.validation";
import { CartItems } from "@/payload/payload-types";
import { NOT_FOUND_USER_WITH_THIS_TOKEN_MESSAGE } from "../../constants/constants.constant";

const CartItemSchema = z.object({ product: z.string(), quantity: z.number() });

const getUserProcedure = privateProcedure.use(async ({ ctx, next }) => {
  const { user } = ctx;
  const payload = await getPayloadClient();
  const userInDb = await payload.findByID({
    collection: "customers",
    id: user.id,
  });
  if (!userInDb)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: NOT_FOUND_USER_WITH_THIS_TOKEN_MESSAGE,
    });
  return next({ ctx: { user: userInDb } });
});

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
        return { success: true, message: "Cập nhật số điện thoại thành công" };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),
  changeUserName: getUserProcedure
    .input(SignUpCredentialSchema.pick({ name: true }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { name } = input;
      // to make sure have actual user
      const payload = await getPayloadClient();
      if (name === user.name) return {success:true,message:"Thay đổi tên thành công"};
      try {
        await payload.update({
          collection: "customers",
          where: {
            id: {
              equals: user.id,
            },
          },
          data: {
            name,
          },
        });
        return { success: true, message: "Thay đổi tên thành công" };
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),
  setDefaultPhoneNumber: getUserProcedure
    .input(PhoneValidationSchema.extend({id:z.string()}))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { phoneNumber,id } = input;
      // to make sure have actual user
      const payload = await getPayloadClient();

      const phoneNumberUpdatedToDefault = user.phoneNumber?.find(
        (number) => number.id === id
      );
      if (!phoneNumberUpdatedToDefault || phoneNumberUpdatedToDefault.isDefault)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Không thể đặt làm mặc định vui lòng thử lại sau.",
        });
      const updatedToDefault = user.phoneNumber?.map((number) =>
        number.id === id
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
        return {
          success: true,
          message: "Đổi số điện thoại mặc định thành công",
        };
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),
  changeUserPhoneNumber: getUserProcedure
    .input(PhoneValidationSchema.extend({id:z.string()}))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { phoneNumber,id } = input;
      // to make sure have actual user
      const payload = await getPayloadClient();
      const isTryingModifySameNumber = user.phoneNumber?.find(
        (phone) => phone.id === id
      )?.phoneNumber===phoneNumber;
      if (isTryingModifySameNumber) return;
      try {
        const updatedPhoneNumbers = user.phoneNumber?.map((phone) =>
          phone.id === id ? { ...phone, phoneNumber } : phone
        );
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
        return { success: true, message: "Cập nhật số điện thoại thành công" };
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),
  deletePhoneNumber: getUserProcedure
    .input(PhoneValidationSchema.extend({id:z.string()}))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { phoneNumber ,id} = input;
      // to make sure have actual user
      const payload = await getPayloadClient();

      if (!user)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Không có người dùng nào với tài khoản này",
        });

      const doesPhoneNumberExist = user.phoneNumber?.find(
        (number) => number.id === id
      );
      if (!doesPhoneNumberExist)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Không thể xóa số điện thoại này vui lòng thử lại sau.",
        });
        // if is the defaultNumber can't delete
        if(doesPhoneNumberExist.isDefault){
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Không thể xóa số điện thoại này vì đang là mặc định",
          });
        }
      const updatedPhoneNumbers = user.phoneNumber?.filter(
        (number) => number.id !== id
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
        return {
          deletedPhoneNumber: phoneNumber,
          success: true,
          message: `Xóa số điện thoại ${phoneNumber.replace(
            "84",
            "0"
          )} thành công`,
        };
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),
  addNewAddress: getUserProcedure
    .input(AddressValidationSchema)
    .mutation(async ({ ctx, input }) => {
      // TODO: add middleware for this
      const { user } = ctx;
      const { district, street, ward } = input;
      // to make sure have actual user
      const payload = await getPayloadClient();

      // with the same address
      const isTheSameAddress = user.address?.find(
        (ad) =>
          ad.district === district && ad.ward === ward && ad.street === street
      );
      if (isTheSameAddress)
        throw new TRPCError({
          code: "CONFLICT",
          message: "Bạn đã thêm số địa chỉ này trước rồi!",
        });

      try {
        await payload.update({
          collection: "customers",
          where: {
            id: { equals: user.id },
          },
          data: {
            address: user.address?.length
              ? [...user.address, { isDefault: false, district, street, ward }]
              : [{ isDefault: true, district, street, ward }],
          },
        });
        return { success: true, message: "Cập nhật địa chỉ thành công" };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),
  setDefaultAddress: getUserProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { id } = input;
      // to make sure have actual user
      const payload = await getPayloadClient();

      const addressUpdateToDefault = user.address?.find((ad) => ad.id === id);
      if (!addressUpdateToDefault || addressUpdateToDefault.isDefault)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Không thể đặt làm mặc định vui lòng thử lại sau.",
        });

      const updatedToDefault = user.address?.map((ad) =>
        ad.id === id ? { ...ad, isDefault: true } : { ...ad, isDefault: false }
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
            address: updatedToDefault,
          },
        });
        return {
          success: true,
          message: "Đổi số điện thoại mặc định thành công",
        };
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),
    adjustUserAddress: getUserProcedure
    .input(AddressValidationSchema.extend({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { id, ward, district, street } = input;
      // to make sure have actual user
      const payload = await getPayloadClient();

      const existingAddress = user.address?.find((ad) => ad.id === id);
      if (!existingAddress)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Không thể cập nhật địa chỉ vui lòng thử lại sau.",
        });
      const isTheSameAddress = user.address?.find(
        (ad) =>
          ad.district === district && ad.ward === ward && ad.street === street
      );
      // TODO: THINK IF SHOULD NOTIFY USER OR NOT
      if (isTheSameAddress) return;
      const updatedAddress = user.address?.map((ad) =>
        ad.id === id ? { ...ad, ward, district, street } : { ...ad }
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
            address: updatedAddress,
          },
        });
        return {
          success: true,
          message: "Cập nhật địa chỉ thành công",
        };
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),
    deleteAddress: getUserProcedure
    .input(z.object({id:z.string()}))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { id } = input;
      // to make sure have actual user
      const payload = await getPayloadClient();

      if (!user)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Không có người dùng nào với tài khoản này",
        });

      const doesAddressExist = user.address?.find(
        (ad) => ad.id === id
      );
      if (!doesAddressExist || doesAddressExist.isDefault)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Không thể đặt làm mặc định vui lòng thử lại sau.",
        });
        // do not allow to delete default Address
        if (doesAddressExist.isDefault)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Không xóa địa chỉ này vì đang là địa chỉ mặc định",
          });
      const updatedAddress = user.address?.filter(
        (ad) => ad.id !== id
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
            address: updatedAddress,
          },
        });
        return {
          success: true,
          message: `Xóa địa chỉ thành công`,
        };
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),
  setUserCart: getUserProcedure
    .input(z.array(CartItemSchema))
    .mutation(async ({ input, ctx }) => {
      const { user } = ctx;

      const payload = await getPayloadClient();
      const updatedCart: CartItems = input;
      // TODO: should i extend with the existing one or simply replace it
      try {
        await payload.update({
          collection: "customers",
          where: {
            id: {
              equals: user.id,
            },
          },
          data: {
            cart: {
              items: updatedCart,
            },
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
});

export default UserRouter;
