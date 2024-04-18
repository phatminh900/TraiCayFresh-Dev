import { z } from "zod";
import { SignUpCredentialSchema } from "./auth.validation";

export const PhoneValidationSchema = z.object({
  phoneNumber: z
    .string()
    .regex(
      /(84[3|5|7|8|9])+([0-9]{8})\b/g,
      "Vui lòng nhập đúng định dạng số điện thoại"
    )
    .trim(),
});
export const AddressValidationSchema = z.object({
  district:z.string().min(5,'Vui lòng chọn Quận / Huyện').trim(),
  
  ward:z.string().min(5,'Vui lòng chọn Phường / Xã').trim(),
  street: z
    .string()
    .regex(
      new RegExp(/^[0-9]+(\/[0-9]+)?(\s+[A-Za-zÀ-ỹ\s\d-]+)+$/),
      "Vui lòng nhập đúng địa chỉ"
    )
    .trim(),
}).merge(PhoneValidationSchema).merge(SignUpCredentialSchema.pick({name:true}));

export type IAddressValidation = z.infer<typeof AddressValidationSchema>;
export type IPhoneNumberValidation = z.infer<typeof PhoneValidationSchema>;
