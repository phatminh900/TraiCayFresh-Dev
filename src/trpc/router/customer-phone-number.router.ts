import { z } from "zod";

import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import cookie from "cookie";
import otpGenerator from "otp-generator";
import {
  ADDRESS_MESSAGE,
  AUTH_MESSAGE,
  NAME_MESSAGE,
  OTP_MESSAGE,
  PHONE_NUMBER_MESSAGE,
  USER_MESSAGE,
} from "../../constants/api-messages.constant";
import { COOKIE_USER_PHONE_NUMBER_TOKEN } from "../../constants/configs.constant";
import { getPayloadClient } from "../../payload/get-client-payload";
import { CartItems } from "../../payload/payload-types";
import { signToken } from "../../utils/server/auth.util";
import { ERROR_JWT_CODE, verifyToken } from "../../utils/auth.util";

import { throwTrpcInternalServer } from "../../utils/server/error-server.util";
import { SignUpCredentialSchema } from "../../validations/auth.validation";
import {
  AddressValidationSchema,
  PhoneValidationSchema,
} from "../../validations/user-infor.valiator";
import { publicProcedure, router } from "../trpc";

const CartItemSchema = z.object({
  product: z.string(),
  quantity: z.number(),
  coupon: z.string().nullable().optional(),
  discountAmount: z.number().nullable().optional(),
  isAppliedCoupon: z.boolean().nullable().optional(),
  shippingCost: z.number().nullable().optional(),
});

const getUserProcedure = publicProcedure.use(async ({ ctx, next }) => {
  const headerCookie = ctx.req.headers.cookie;
  const parsedCookie = cookie.parse(headerCookie || "");
  const token = parsedCookie[COOKIE_USER_PHONE_NUMBER_TOKEN];
  if (!token)
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: AUTH_MESSAGE.EXPIRED,
    });
  const decodedToken = await verifyToken(token);

  if (decodedToken.code === ERROR_JWT_CODE.ERR_JWS_INVALID) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: AUTH_MESSAGE.INVALID_OTP,
    });
  }
  if (decodedToken.code === ERROR_JWT_CODE.ERR_JWT_EXPIRED) {
    throw new TRPCError({ code: "BAD_REQUEST", message: AUTH_MESSAGE.EXPIRED });
  }
  // @ts-ignore
  const userId = decodedToken?.userId;
  const payload = await getPayloadClient();
  const user = await payload.findByID({
    collection: "customer-phone-number",
    id: userId || "",
  });
  if (!user)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: USER_MESSAGE.NOT_FOUND,
    });
  return next({ ctx: { user } });
});

const CustomerPhoneNumberRouter = router({
  requestOtp: publicProcedure
    .input(PhoneValidationSchema)
    .mutation(async ({ input }) => {
      try {
        const { phoneNumber } = input;
        const payload = await getPayloadClient();

        const otp = otpGenerator.generate(6, {
          digits: true,
          specialChars: false,
          lowerCaseAlphabets: false,
          upperCaseAlphabets: false,
        });
        console.log("OTP:::", otp);
        // TODO: send to user
        const salt = await bcrypt.genSalt(10);
        const hashOtp = await bcrypt.hash(otp, salt);
        // still send otp
        await payload.create({
          collection: "otp",
          data: {
            otp: hashOtp,
            phoneNumber,
          },
        });

        return { success: true, message: OTP_MESSAGE.SUCCESS };
      } catch (error) {
        throwTrpcInternalServer(error);
      }
    }),
  verifyOtp: publicProcedure
    .input(PhoneValidationSchema.extend({ otp: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { res } = ctx;
      const { phoneNumber, otp } = input;
      const payload = await getPayloadClient();
      // check if the otp  matches the phone number
      const { docs } = await payload.find({
        collection: "otp",
        where: { phoneNumber: { equals: phoneNumber } },
      });
      if (!docs.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: AUTH_MESSAGE.EXPIRED,
        });
      }
      const lastOtp = docs[docs.length - 1];
      // TODO: check again in production

      // TODO:  checking otp for testing
      const isValidOtp =
        otp === "000000" || (await bcrypt.compare(otp, lastOtp.otp!));
      if (!isValidOtp) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: AUTH_MESSAGE.INVALID_OTP,
        });
      }
      if (isValidOtp && phoneNumber === lastOtp.phoneNumber) {
        const { docs } = await payload.find({
          collection: "customer-phone-number",
          where: { phoneNumber: { equals: lastOtp.phoneNumber } },
        });
        // send only the jwt

        // if exist no need to create new one
        if (docs.length) {
          await payload.delete({
            collection: "otp",
            where: { phoneNumber: { equals: lastOtp.phoneNumber } },
          });
          const token = await signToken(docs[0].id);
          res.setHeader(
            "Set-Cookie",
            cookie.serialize(COOKIE_USER_PHONE_NUMBER_TOKEN, token, {
              secure: process.env.NODE_ENV === "production",
              path: "/",
              httpOnly: true,
            })
          );
          return { success: true, message: OTP_MESSAGE.VERIFY_SUCCESSFULLY };
        }
        // if user do not  exist ==> create a new one
        const newCustomer = await payload.create({
          collection: "customer-phone-number",
          data: {
            phoneNumber,
            phoneNumbers: [{ phoneNumber, isDefault: true }],
          },
        });
        if (newCustomer) {
          const token = await signToken(newCustomer.id);
          res.setHeader(
            "Set-Cookie",
            cookie.serialize(COOKIE_USER_PHONE_NUMBER_TOKEN, token, {
              secure: process.env.NODE_ENV === "production",
              path: "/",
              httpOnly: true,
            })
          );
          await payload.delete({
            collection: "otp",
            where: { phoneNumber: { equals: lastOtp.phoneNumber } },
          });
          return { success: true, message: OTP_MESSAGE.VERIFY_SUCCESSFULLY };
        }
      }
    }),

  logOut: publicProcedure.mutation(({ ctx }) => {
    const { res } = ctx;
    res.clearCookie(COOKIE_USER_PHONE_NUMBER_TOKEN);
    return { success: true };
  }),
  addNewPhoneNumber: getUserProcedure
    .input(PhoneValidationSchema)
    .mutation(async ({ ctx, input }) => {
      // TODO: add middleware for this
      const { user } = ctx;
      const { phoneNumber } = input;
      // to make sure have actual user
      const payload = await getPayloadClient();

      // with the same phoneNumber
      const isTheSamePhoneNumber = user.phoneNumbers?.find(
        (number) => number.phoneNumber === phoneNumber
      );
      if (isTheSamePhoneNumber)
        throw new TRPCError({
          code: "CONFLICT",
          message: PHONE_NUMBER_MESSAGE.CONFLICT,
        });

      const updatedPhoneNumbers = [
        ...user.phoneNumbers!,
        { isDefault: false, phoneNumber },
      ];
      try {
        await payload.update({
          collection: "customer-phone-number",
          where: {
            id: { equals: user.id },
          },
          data: {
            // after login already set the default and can't change
            phoneNumbers: updatedPhoneNumbers,
          },
        });
        return {
          success: true,
          message: PHONE_NUMBER_MESSAGE.SUCCESS,
        };
      } catch (error) {
        throwTrpcInternalServer(error);
      }
    }),

  changeUserPhoneNumber: getUserProcedure
    .input(PhoneValidationSchema.extend({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { phoneNumber, id } = input;
      // to make sure have actual user
      const payload = await getPayloadClient();
      const isTryingModifySameNumber =
        user.phoneNumbers?.find((phone) => phone.id === id)?.phoneNumber ===
        phoneNumber;
      if (isTryingModifySameNumber) return;
      try {
        const updatedPhoneNumbers = user.phoneNumbers?.map((phone) =>
          phone.id === id ? { ...phone, phoneNumber } : phone
        );
        await payload.update({
          collection: "customer-phone-number",
          where: {
            id: {
              equals: user.id,
            },
          },
          data: {
            phoneNumbers: updatedPhoneNumbers,
          },
        });
        return {
          success: true,
          message: PHONE_NUMBER_MESSAGE.UPDATE_SUCCESSFULLY,
        };
      } catch (error) {
        throwTrpcInternalServer(error);
      }
    }),
  deletePhoneNumber: getUserProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { id } = input;
      // to make sure have actual user
      const payload = await getPayloadClient();

      if (!user)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: USER_MESSAGE.NOT_FOUND,
        });

      const doesPhoneNumberExist = user.phoneNumbers?.find(
        (number) => number.id === id
      );
      if (!doesPhoneNumberExist)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: PHONE_NUMBER_MESSAGE.CANT_DELETE,
        });
      // if is the defaultNumber can't delete
      if (doesPhoneNumberExist.isDefault) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: PHONE_NUMBER_MESSAGE.CANT_DELETE,
        });
      }
      const updatedPhoneNumbers = user.phoneNumbers?.filter(
        (number) => number.id !== id
      );
      try {
        await payload.update({
          collection: "customer-phone-number",
          where: {
            id: {
              equals: user.id,
            },
          },
          data: {
            phoneNumbers: updatedPhoneNumbers,
          },
        });
        return {
          deletedPhoneNumber: doesPhoneNumberExist.phoneNumber,
          success: true,
          message: `Xóa số điện thoại 
            ${doesPhoneNumberExist.phoneNumber}
           thành công`,
        };
      } catch (error) {
        throwTrpcInternalServer(error);
      }
    }),

  changeUserName: getUserProcedure
    .input(SignUpCredentialSchema.pick({ name: true }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { name } = input;
      // to make sure have actual user
      const payload = await getPayloadClient();
      if (name === user.name) return;
      try {
        await payload.update({
          collection: "customer-phone-number",
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
        throwTrpcInternalServer(error);
      }
    }),
  addNewAddress: getUserProcedure
    .input(AddressValidationSchema)
    .mutation(async ({ ctx, input }) => {
      // TODO: add middleware for this
      const { user } = ctx;
      const { district, street, ward, name, phoneNumber } = input;
      // to make sure have actual user
      const payload = await getPayloadClient();

      // with the same address
      const isTheSameAddress = user.address?.find(
        (ad) =>
          ad.district === district &&
          ad.ward === ward &&
          ad.street === street &&
          ad.phoneNumber === phoneNumber &&
          ad.name === name
      );
      if (isTheSameAddress)
        throw new TRPCError({
          code: "CONFLICT",
          message: ADDRESS_MESSAGE.CONFLICT,
        });

      try {
        await payload.update({
          collection: "customer-phone-number",
          where: {
            id: { equals: user.id },
          },
          data: {
            address: user.address?.length
              ? [
                  ...user.address,
                  {
                    isDefault: false,
                    district,
                    street,
                    ward,
                    phoneNumber,
                    name,
                  },
                ]
              : [
                  {
                    isDefault: true,
                    district,
                    street,
                    ward,
                    phoneNumber,
                    name,
                  },
                ],
          },
        });
        return { success: true, message: ADDRESS_MESSAGE.SUCCESS };
      } catch (error) {
        throwTrpcInternalServer(error);
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
          collection: "customer-phone-number",
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
          message: ADDRESS_MESSAGE.SET_DEFAULT_SUCCESSFULLY,
        };
      } catch (error) {
        throwTrpcInternalServer(error);
      }
    }),
  adjustUserAddress: getUserProcedure
    .input(AddressValidationSchema.extend({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { id, ward, district, street, phoneNumber, name } = input;
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
          ad.district === district &&
          ad.ward === ward &&
          ad.street === street &&
          ad.phoneNumber === phoneNumber &&
          ad.name === name
      );

      // TODO: THINK IF SHOULD NOTIFY USER OR NOT
      if (isTheSameAddress)
        return { success: true, message: ADDRESS_MESSAGE.UPDATE_SUCCESSFULLY };

      const updatedAddress = user.address?.map((ad) =>
        ad.id === id
          ? { ...ad, ward, district, street, name, phoneNumber }
          : { ...ad }
      );
      try {
        await payload.update({
          collection: "customer-phone-number",
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
        throwTrpcInternalServer(error);
      }
    }),
  deleteAddress: getUserProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { id } = input;
      // to make sure have actual user
      const payload = await getPayloadClient();

      if (!user)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: USER_MESSAGE.NOT_FOUND,
        });

      const doesAddressExist = user.address?.find((ad) => ad.id === id);
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
      const updatedAddress = user.address?.filter((ad) => ad.id !== id);
      try {
        await payload.update({
          collection: "customer-phone-number",
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
          message: ADDRESS_MESSAGE.DELETE_SUCCESSFULLY,
        };
      } catch (error) {
        throwTrpcInternalServer(error);
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
          collection: "customer-phone-number",
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
        throwTrpcInternalServer(error);
      }
    }),
});
export default CustomerPhoneNumberRouter;
