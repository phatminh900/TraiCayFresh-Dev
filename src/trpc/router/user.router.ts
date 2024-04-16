import { z } from "zod";
import { privateProcedure, router } from "../trpc";
import { getPayloadClient } from "../../payload/get-client-payload";
import { TRPCError } from "@trpc/server";
import {
  AddressValidationSchema,
  PhoneValidationSchema,
} from "../../validations/user-infor.valiator";
import { SignUpCredentialSchema } from "../../validations/auth.validation";
import { CartItems, Product } from "../../payload/payload-types";
import {  ADDRESS_MESSAGE, NAME_MESSAGE, PHONE_NUMBER_MESSAGE, USER_MESSAGE } from "../../constants/api-messages.constant";
import { throwTrpcInternalServer } from "../../utils/server/error-server.util";

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
      message: USER_MESSAGE.NOT_FOUND,
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
          message: PHONE_NUMBER_MESSAGE.CONFLICT,
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
        return { success: true, message: PHONE_NUMBER_MESSAGE.UPDATE_SUCCESSFULLY};
      } catch (error) {
        throwTrpcInternalServer(error)

      }
    }),
  changeUserName: getUserProcedure
    .input(SignUpCredentialSchema.pick({ name: true }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { name } = input;
      // to make sure have actual user
      const payload = await getPayloadClient();
      if (name === user.name) return {success:true,message:NAME_MESSAGE.UPDATE_SUCCESSFULLY};
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
        return { success: true, message: NAME_MESSAGE.UPDATE_SUCCESSFULLY };
      } catch (error) {
       throwTrpcInternalServer(error)
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
          message: PHONE_NUMBER_MESSAGE.CANT_SET_DEFAULT
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
          message: PHONE_NUMBER_MESSAGE.SET_DEFAULT_SUCCESSFULLY,
        };
      } catch (error) {
       throwTrpcInternalServer(error)
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
        return { success: true, message: PHONE_NUMBER_MESSAGE.UPDATE_SUCCESSFULLY };
      } catch (error) {
        throwTrpcInternalServer(error)
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
          message: USER_MESSAGE.NOT_FOUND
        });

      const doesPhoneNumberExist = user.phoneNumber?.find(
        (number) => number.id === id
      );
      if (!doesPhoneNumberExist)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: PHONE_NUMBER_MESSAGE.CANT_DELETE,
        });
        // if is the defaultNumber can't delete
        if(doesPhoneNumberExist.isDefault){
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: PHONE_NUMBER_MESSAGE.CANT_DELETE,
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
       throwTrpcInternalServer(error)
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
          message: ADDRESS_MESSAGE.CONFLICT,
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
        return { success: true, message: ADDRESS_MESSAGE.UPDATE_SUCCESSFULLY };
      } catch (error) {
       throwTrpcInternalServer(error)
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
          message: ADDRESS_MESSAGE.CANT_SET_DEFAULT,
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
          message: ADDRESS_MESSAGE.SET_DEFAULT_SUCCESSFULLY
        };
      } catch (error) {
        throwTrpcInternalServer(error)
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
          message: ADDRESS_MESSAGE.CANT_UPDATE,
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
          message: ADDRESS_MESSAGE.UPDATE_SUCCESSFULLY,
        };
      } catch (error) {
      throwTrpcInternalServer(error)
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
          message: USER_MESSAGE.NOT_FOUND
        });

      const doesAddressExist = user.address?.find(
        (ad) => ad.id === id
      );
      if (!doesAddressExist || doesAddressExist.isDefault)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: ADDRESS_MESSAGE.CANT_DELETE,
        });
        // do not allow to delete default Address
        if (doesAddressExist.isDefault)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: ADDRESS_MESSAGE.CANT_DELETE,
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
          message: ADDRESS_MESSAGE.DELETE_SUCCESSFULLY
        };
      } catch (error) {
       throwTrpcInternalServer(error)
      }
    }),
  setUserCart: getUserProcedure
    .input(z.array(CartItemSchema))
    .mutation(async ({ input, ctx }) => {
      const { user } = ctx;
      const payload = await getPayloadClient();
      const cartInput: CartItems = input;
      const populatedUserCart=(await payload.findByID({collection:'customers',depth:2,id:user.id})).cart
      
      let updatedCart=cartInput
      const totalPrice=populatedUserCart?.items?.reduce((total,item)=>{
        const product=item.product as Product
        const quantity=item.quantity!
        const productPrice=product?.priceAfterDiscount||product.originalPrice
        return total+(productPrice*quantity)

      },0)
      const isInCartHasCouponCodeApplied=populatedUserCart?.items?.some(item=>item.isAppliedCoupon)
      if(!isInCartHasCouponCodeApplied){
       updatedCart=cartInput.map(item=>({...item,totalPrice}))

      }
      if(populatedUserCart&& isInCartHasCouponCodeApplied){
        updatedCart =populatedUserCart.items!.map(
          ({ product, quantity, isAppliedCoupon, priceAfterCoupon,discountAmount,...rest }) => {
            const cartProduct = product! as Product;
            if (isAppliedCoupon) {
              const totalPrice =
                (cartProduct.priceAfterDiscount || cartProduct.originalPrice) *
                quantity!;
              const priceAfterCoupon =
                totalPrice - (discountAmount! * totalPrice) / 100;
              return {
                ...rest,
                product: cartProduct.id,
                quantity,
                priceAfterCoupon,
              };
            }
            return {
              ...rest,
              product: cartProduct.id,
              quantity,
              isAppliedCoupon,
              priceAfterCoupon,
            };
          }
        );
      }
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
       throwTrpcInternalServer(error)
      }
    }),
});

export default UserRouter;
