"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressValidationSchema = exports.PhoneValidationSchema = void 0;
var zod_1 = require("zod");
var auth_validation_1 = require("./auth.validation");
var validation_message_constant_1 = require("../constants/validation-message.constant");
// export const PhoneValidationSchema = z.object({
//   phoneNumber: z
//     .string()
//     .regex(
//      new RegExp("^(84|\\+84)?(3[2-9]|5[6-9]|7[0|6-9]|8[1-9]|9[0-9])[0-9]{7}$"),
//       // /(84[3|5|7|8|9])+([0-9]{8})\b/g,
//       "Vui lòng nhập đúng định dạng số điện thoại di ban"
//     )
//     .trim(),
// });
exports.PhoneValidationSchema = zod_1.z.object({
    phoneNumber: zod_1.z.string().refine(function (value) {
        // the regexp of zod seems not working
        return /^(0|84|\+84)?(3[2-9]|5[6-9]|7[0|6-9]|8[1-9]|9[0-9])[0-9]{7}$/.test(value);
    }, validation_message_constant_1.INVALID_PHONE_NUMBER_TYPE),
});
exports.AddressValidationSchema = zod_1.z
    .object({
    district: zod_1.z.string().min(5, validation_message_constant_1.REQUIRED_DISTRICT).trim(),
    ward: zod_1.z.string().min(5, validation_message_constant_1.REQUIRED_WARD).trim(),
    street: zod_1.z
        .string()
        .regex(new RegExp(/^[0-9]+(\/[0-9]+)?(\s+[A-Za-zÀ-ỹ\s\d-]+)+$/), validation_message_constant_1.INVALID_STREET_TYPE)
        .trim(),
})
    .merge(exports.PhoneValidationSchema)
    .merge(auth_validation_1.SignUpCredentialSchema.pick({ name: true }));
