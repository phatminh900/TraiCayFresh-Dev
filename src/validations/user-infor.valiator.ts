import { z } from "zod";

export const PhoneValidationSchema = z.object({
  phoneNumber: z
    .string()
    .regex(
      new RegExp(/(84[3|5|7|8|9])+([0-9]{8})\b/g),
      "Vui lòng nhập đúng định dạng số điện thoại"
    )
    .trim(),
});
export type IPhoneNumberValidation=z.infer<typeof PhoneValidationSchema>