"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignUpCredentialSchema = exports.AuthCredentialSchema = void 0;
var validation_message_constant_1 = require("../constants/validation-message.constant");
var zod_1 = require("zod");
exports.AuthCredentialSchema = zod_1.z.object({
    email: zod_1.z.string().email(validation_message_constant_1.INVALID_EMAIL_TYPE).min(1, validation_message_constant_1.REQUIRED_EMAIL).trim(),
    password: zod_1.z
        .string()
        .min(6, { message: validation_message_constant_1.REQUIRED_PASSWORD })
        .regex(new RegExp(/^(?=.*\d)(?=.*[a-zA-Z]).{6,}$/), validation_message_constant_1.INVALID_PASSWORD_CONFIRM_TYPE),
});
exports.SignUpCredentialSchema = exports.AuthCredentialSchema.extend({
    name: zod_1.z
        .string()
        .min(2, validation_message_constant_1.INVALID_NAME)
        .trim()
        .regex(new RegExp(/^[a-zA-ZÀ-ỹ]+(?:[\s-][a-zA-ZÀ-ỹ]+)*$/), validation_message_constant_1.REQUIRED_NAME),
    passwordConfirm: zod_1.z
        .string()
        .min(6, { message: validation_message_constant_1.REQUIRED_PASSWORD_CONFIRM })
        .regex(new RegExp(/^(?=.*\d)(?=.*[a-zA-Z]).{6,}$/), validation_message_constant_1.INVALID_PASSWORD_CONFIRM_TYPE),
});
