import { z } from "zod";

import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import cookie from "cookie";
import otpGenerator from "otp-generator";
import { publicProcedure, router } from "../trpc";
import { AddressValidationSchema, PhoneValidationSchema } from "../../validations/user-infor.valiator";
import { SignUpCredentialSchema } from "../../validations/auth.validation";
import { getPayloadClient } from "../../payload/get-client-payload";
import { signToken, verifyToken } from "../../utils/auth.util";
import {
  COOKIE_USER_PHONE_NUMBER_TOKEN,
  INVALID_TOKEN_MESSAGE,
  INVALID_TOKEN_OR_EXPIRED_MESSAGE,
  NOT_FOUND_USER_WITH_THIS_TOKEN_MESSAGE,
} from "../../constants/constants.constant";

const getUserProcedure = publicProcedure.use(async ({ ctx, next, input }) => {
  const headerCookie = ctx.req.headers.cookie;
  const parsedCookie = cookie.parse(headerCookie || "");
  const token = parsedCookie[COOKIE_USER_PHONE_NUMBER_TOKEN];
  if (!token)
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: INVALID_TOKEN_OR_EXPIRED_MESSAGE,
    });
  const decodedToken = await verifyToken(token);
  const userId = decodedToken.userId;
  const payload = await getPayloadClient();
  const user = await payload.findByID({
    collection: "customer-phone-number",
    id: userId,
  });
  if (!user)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: NOT_FOUND_USER_WITH_THIS_TOKEN_MESSAGE,
    });
  return next({ ctx: { user } });

 
});

const customerPhoneNumberRouter = router({
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

        return { success: true };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
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
          message: INVALID_TOKEN_OR_EXPIRED_MESSAGE,
        });
      }
      const lastOtp = docs[docs.length - 1];
      // TODO: check again in production
  
      // TODO:  checking otp for testing
      const isValidOtp =otp==='000000' || await bcrypt.compare(otp, lastOtp.otp!);
      if (!isValidOtp) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: INVALID_TOKEN_MESSAGE,
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
          return { success: true };
        }
        // if user do not  exist ==> create a new one
        const newCustomer = await payload.create({
          collection: "customer-phone-number",
          data: {
            phoneNumber,
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
          return { success: true };
        }
      }
    }),
  
  logOut: publicProcedure.mutation(({ ctx }) => {
    const { res } = ctx;
    res.clearCookie(COOKIE_USER_PHONE_NUMBER_TOKEN);
    return { success: true };
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
      return { success: true, message: "Thay đổi tên thành công" };
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
    const { district,street,ward } = input;
    // to make sure have actual user
    const payload = await getPayloadClient();

    // with the same address
    const isTheSameAddress = user.address?.find(
      (ad) => (ad.district === district) && (ad.ward===ward) && (ad.street===street)
    );
    if (isTheSameAddress)
      throw new TRPCError({
        code: "CONFLICT",
        message: "Bạn đã thêm địa chỉ này trước rồi!",
      });

    try {
      await payload.update({
        collection: "customer-phone-number",
        where: {
          id: { equals: user.id },
        },
        data: {
          address: user.address?.length
            ? [...user.address, { isDefault: false, district,street,ward }]
            : [{ isDefault: true,  district,street,ward}],
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
  .input(z.object({id:z.string()}))
  .mutation(async ({ ctx, input }) => {
    const { user } = ctx;
    const { id } = input;
    // to make sure have actual user
    const payload = await getPayloadClient();

    const addressUpdateToDefault = user.address?.find(
      (ad) => ad.id===id
    );
    if (!addressUpdateToDefault || addressUpdateToDefault.isDefault)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Không thể đặt làm mặc định vui lòng thử lại sau.",
      });

    const updatedToDefault = user.address?.map((ad) =>
      ad.id===id
        ? { ...ad, isDefault: true }
        : { ...ad, isDefault: false }
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
});
export default customerPhoneNumberRouter;
