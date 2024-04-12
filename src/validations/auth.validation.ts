import { z } from "zod";

export const AuthCredentialSchema = z.object({
  email: z
    .string()
    .email("Định dạng email không đúng")
    .min(1, "Vui lòng nhập email")
    .trim(),
  password: z
    .string()
    .min(6, { message: "Mật khẩu phải có ít nhất 6 kí tự" })
    .regex(
      new RegExp(/^(?=.*\d)(?=.*[a-zA-Z]).{6,}$/),
      "Mật khẩu phải có ít nhất 1 chữ cái và 1 số. Và có độ dài từ 6 kí tự trở lên"
    ),
});

export const SignUpCredentialSchema = AuthCredentialSchema.extend({
  name: z.string().min(2, "Tên phải từ 2 chữ cái").trim() .regex(
    new RegExp(/^[a-zA-ZÀ-ỹ]+(?:[\s-][a-zA-ZÀ-ỹ]+)*$/),
    "Vui lòng nhập tên của bạn"
  ),
  passwordConfirm: z
    .string()
    .min(6, { message: "Nhập lại mật khẩu phải có ít nhất 6 kí tự" })
    .regex(
      new RegExp(/^(?=.*\d)(?=.*[a-zA-Z]).{6,}$/),
      "Mật khẩu phải có ít nhất 1 chữ cái và 1 số. Và có độ dài từ 6 kí tự trở lên"
    ),
});
export type IAuthCredential = z.infer<typeof AuthCredentialSchema>;
export type ISignUpCredential = z.infer<typeof SignUpCredentialSchema>;
