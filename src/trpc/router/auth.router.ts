import {
  AuthCredentialSchema,
  SignUpCredentialSchema,
} from "../../validations/auth.validation";
import { privateProcedure, publicProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import { getPayloadClient } from "../../payload/get-client-payload";
import { z } from "zod";
// PREVENT LOGIN TOO MUCH
const AuthRouter = router({
  signUp: publicProcedure
    .input(SignUpCredentialSchema)
    .mutation(async ({ input }) => {
      const { email, password, passwordConfirm, name } = input;
      if (password !== passwordConfirm) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Mật khẩu và xác nhận mật khẩu không giống nhau",
        });
      }
      const payload = await getPayloadClient();
      const { docs: customers } = await payload.find({
        collection: "customers",
        where: {
          email: {
            equals: email,
          },
        },
      });
      if (customers.length) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email này đã đăng kí rồi. Thử đăng nhập lại nhé.",
        });
      }
      await payload.create({
        collection: "customers",
        data: {
          email,
          password,
          name,
        },
      });
      return { success: true, emailSentTo: email };
    }),
  login: publicProcedure
    .input(AuthCredentialSchema)
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input;
      const { res } = ctx;

      const payload = await getPayloadClient();
      const { docs } = await payload.find({
        collection: "customers",
        where: {
          email: {
            equals: email,
          },
          _verified: {
            equals: false,
          },
        },
      });
      if (docs.length) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Vui lòng xác nhận email.",
        });
      }
      try {
        await payload.login({
          collection: "customers",
          data: {
            email,
            password,
          },
          res,
        });
        return { success: true,message:"Đăng nhập thành công" };
      } catch (err) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Tài khoản hoặc mật khẩu sai.",
        });
      }
    }),
  verifyEmail: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      const { token } = input;
      if(!token) return
      const payload = await getPayloadClient();

      const isVerified = await payload.verifyEmail({
        collection: "customers",
        token,
      });

      if (!isVerified) throw new TRPCError({ code: "UNAUTHORIZED" });
      return { success: true };
    }),
  resetPassword: publicProcedure
    .input(
      SignUpCredentialSchema.pick({
        password: true,
        passwordConfirm: true,
      }).extend({ token: z.string() })
    )
    .mutation(async ({ input }) => {
      const { password, passwordConfirm, token } = input;
      if (password !== passwordConfirm) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Mật khẩu và xác nhận mật khẩu không giống nhau",
        });
      }
      const payload = await getPayloadClient();
      try {
        await payload.resetPassword({
          collection: "customers",
          data: { password, token },
          overrideAccess: true,
        });
        return { success: true ,message:'Thay đổi mật khẩu thành công'};
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Link yêu cầu đổi mật khẩu có thể hết hạn hoặc không đúng vui lòng kiểm tra lại email hoặc yêu cầu gửi lại mã xác nhận",
        });
      }
    }),

  // TODO: ask Nguyen
  checkIfEmailExist: publicProcedure
    .input(AuthCredentialSchema.pick({ email: true }))
    .mutation(async ({ input }) => {
      const { email } = input;
      const payload = await getPayloadClient();
      const { docs } = await payload.find({
        collection: "customers",
        where: {
          email: {
            equals: email,
          },
        },
      });
      if (!docs.length)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Email chưa được đăng kí. Đăng kí ngay nhé",
        });
      return { success: true, email };
    }),
});

export default AuthRouter;
