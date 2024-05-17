"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var zod_1 = require("zod");
var server_1 = require("@trpc/server");
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var cookie_1 = __importDefault(require("cookie"));
var otp_generator_1 = __importDefault(require("otp-generator"));
var api_messages_constant_1 = require("../../constants/api-messages.constant");
var configs_constant_1 = require("../../constants/configs.constant");
var get_client_payload_1 = require("../../payload/get-client-payload");
var auth_util_1 = require("../../utils/server/auth.util");
var error_server_util_1 = require("../../utils/server/error-server.util");
var auth_validation_1 = require("../../validations/auth.validation");
var user_infor_valiator_1 = require("../../validations/user-infor.valiator");
var get_user_procedure_1 = __importDefault(require("../middlewares/get-user-procedure"));
var trpc_1 = require("../trpc");
var CartItemSchema = zod_1.z.object({
    product: zod_1.z.string(),
    quantity: zod_1.z.number(),
    coupon: zod_1.z.string().nullable().optional(),
    discountAmount: zod_1.z.number().nullable().optional(),
    isAppliedCoupon: zod_1.z.boolean().nullable().optional(),
    shippingCost: zod_1.z.number().nullable().optional(),
});
var CustomerPhoneNumberRouter = (0, trpc_1.router)({
    requestOtp: trpc_1.publicProcedure
        .input(user_infor_valiator_1.PhoneValidationSchema)
        .mutation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var phoneNumber, payload, otp, salt, hashOtp, error_1;
        var input = _b.input;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 5, , 6]);
                    phoneNumber = input.phoneNumber;
                    return [4 /*yield*/, (0, get_client_payload_1.getPayloadClient)()];
                case 1:
                    payload = _c.sent();
                    otp = otp_generator_1.default.generate(6, {
                        digits: true,
                        specialChars: false,
                        lowerCaseAlphabets: false,
                        upperCaseAlphabets: false,
                    });
                    console.log("OTP:::", otp);
                    return [4 /*yield*/, bcryptjs_1.default.genSalt(10)];
                case 2:
                    salt = _c.sent();
                    return [4 /*yield*/, bcryptjs_1.default.hash(otp, salt)];
                case 3:
                    hashOtp = _c.sent();
                    // still send otp
                    return [4 /*yield*/, payload.create({
                            collection: "otp",
                            data: {
                                otp: hashOtp,
                                phoneNumber: phoneNumber,
                            },
                        })];
                case 4:
                    // still send otp
                    _c.sent();
                    return [2 /*return*/, { success: true, message: api_messages_constant_1.OTP_MESSAGE.SUCCESS }];
                case 5:
                    error_1 = _c.sent();
                    (0, error_server_util_1.throwTrpcInternalServer)(error_1);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); }),
    verifyOtp: trpc_1.publicProcedure
        .input(user_infor_valiator_1.PhoneValidationSchema.extend({ otp: zod_1.z.string() }))
        .mutation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var res, phoneNumber, otp, payload, expirationDays, docs, lastOtp, isValidOtp, _c, docs_1, userId, token, expiresAt, refreshToken, newCustomer, userId, token, refreshToken, expiresAt, error_2;
        var input = _b.input, ctx = _b.ctx;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    res = ctx.res;
                    phoneNumber = input.phoneNumber, otp = input.otp;
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 18, , 19]);
                    return [4 /*yield*/, (0, get_client_payload_1.getPayloadClient)()];
                case 2:
                    payload = _d.sent();
                    expirationDays = process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME_NUMBER || 7;
                    return [4 /*yield*/, payload.find({
                            collection: "otp",
                            where: { phoneNumber: { equals: phoneNumber } },
                        })];
                case 3:
                    docs = (_d.sent()).docs;
                    if (!docs.length) {
                        throw new server_1.TRPCError({
                            code: "NOT_FOUND",
                            message: api_messages_constant_1.AUTH_MESSAGE.EXPIRED,
                        });
                    }
                    lastOtp = docs[docs.length - 1];
                    console.log('-----last otp');
                    console.log(lastOtp);
                    console.log('----otp');
                    console.log(otp);
                    _c = (otp === "000000");
                    if (_c) return [3 /*break*/, 5];
                    return [4 /*yield*/, bcryptjs_1.default.compare(otp, lastOtp.otp)];
                case 4:
                    _c = (_d.sent());
                    _d.label = 5;
                case 5:
                    isValidOtp = _c;
                    if (!isValidOtp) {
                        throw new server_1.TRPCError({
                            code: "UNAUTHORIZED",
                            message: api_messages_constant_1.AUTH_MESSAGE.INVALID_OTP,
                        });
                    }
                    if (!(isValidOtp && phoneNumber === lastOtp.phoneNumber)) return [3 /*break*/, 17];
                    return [4 /*yield*/, payload.find({
                            collection: "customer-phone-number",
                            where: { phoneNumber: { equals: lastOtp.phoneNumber } },
                        })];
                case 6:
                    docs_1 = (_d.sent()).docs;
                    if (!docs_1.length) return [3 /*break*/, 11];
                    return [4 /*yield*/, payload.delete({
                            collection: "otp",
                            where: { phoneNumber: { equals: lastOtp.phoneNumber } },
                        })];
                case 7:
                    _d.sent();
                    userId = docs_1[0].id;
                    return [4 /*yield*/, (0, auth_util_1.signToken)(userId)];
                case 8:
                    token = _d.sent();
                    expiresAt = new Date(Date.now() + (+expirationDays) * 24 * 60 * 60 * 1000);
                    return [4 /*yield*/, (0, auth_util_1.signRefreshToken)(userId)];
                case 9:
                    refreshToken = _d.sent();
                    return [4 /*yield*/, payload.update({ collection: 'customer-phone-number', data: { refreshToken: refreshToken }, id: userId })];
                case 10:
                    _d.sent();
                    res.setHeader("Set-Cookie", cookie_1.default.serialize(configs_constant_1.COOKIE_USER_PHONE_NUMBER_TOKEN, token, {
                        secure: process.env.NODE_ENV === "production",
                        path: "/",
                        expires: expiresAt,
                        httpOnly: true,
                    }));
                    return [2 /*return*/, { success: true, message: api_messages_constant_1.OTP_MESSAGE.VERIFY_SUCCESSFULLY }];
                case 11: return [4 /*yield*/, payload.create({
                        collection: "customer-phone-number",
                        data: {
                            phoneNumber: phoneNumber,
                            phoneNumbers: [{ phoneNumber: phoneNumber, isDefault: true }],
                        },
                    })];
                case 12:
                    newCustomer = _d.sent();
                    if (!newCustomer) return [3 /*break*/, 17];
                    userId = newCustomer.id;
                    return [4 /*yield*/, (0, auth_util_1.signToken)(userId)];
                case 13:
                    token = _d.sent();
                    return [4 /*yield*/, (0, auth_util_1.signRefreshToken)(userId)];
                case 14:
                    refreshToken = _d.sent();
                    expiresAt = new Date(Date.now() + (+expirationDays) * 24 * 60 * 60 * 1000);
                    return [4 /*yield*/, payload.update({ collection: 'customer-phone-number', data: { refreshToken: refreshToken }, id: userId })];
                case 15:
                    _d.sent();
                    res.setHeader("Set-Cookie", cookie_1.default.serialize(configs_constant_1.COOKIE_USER_PHONE_NUMBER_TOKEN, token, {
                        secure: process.env.NODE_ENV === "production",
                        path: "/",
                        expires: expiresAt,
                        httpOnly: true,
                    }));
                    return [4 /*yield*/, payload.delete({
                            collection: "otp",
                            where: { phoneNumber: { equals: lastOtp.phoneNumber } },
                        })];
                case 16:
                    _d.sent();
                    return [2 /*return*/, { success: true, message: api_messages_constant_1.OTP_MESSAGE.VERIFY_SUCCESSFULLY }];
                case 17: return [3 /*break*/, 19];
                case 18:
                    error_2 = _d.sent();
                    throw error_2;
                case 19: return [2 /*return*/];
            }
        });
    }); }),
    logOut: trpc_1.publicProcedure.mutation(function (_a) {
        var ctx = _a.ctx;
        try {
            var res = ctx.res;
            console.log('why not logout');
            res.clearCookie(configs_constant_1.COOKIE_USER_PHONE_NUMBER_TOKEN);
            return { success: true };
        }
        catch (error) {
            (0, error_server_util_1.throwTrpcInternalServer)(error);
        }
    }),
    addNewPhoneNumber: get_user_procedure_1.default
        .input(user_infor_valiator_1.PhoneValidationSchema)
        .mutation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var user, phoneNumber, payload, isTheSamePhoneNumber, updatedPhoneNumbers, error_3;
        var _c;
        var ctx = _b.ctx, input = _b.input;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    user = ctx.user;
                    phoneNumber = input.phoneNumber;
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, (0, get_client_payload_1.getPayloadClient)()];
                case 2:
                    payload = _d.sent();
                    isTheSamePhoneNumber = (_c = user.phoneNumbers) === null || _c === void 0 ? void 0 : _c.find(function (number) { return number.phoneNumber === phoneNumber; });
                    if (isTheSamePhoneNumber)
                        throw new server_1.TRPCError({
                            code: "CONFLICT",
                            message: api_messages_constant_1.PHONE_NUMBER_MESSAGE.CONFLICT,
                        });
                    updatedPhoneNumbers = __spreadArray(__spreadArray([], user.phoneNumbers, true), [
                        { isDefault: false, phoneNumber: phoneNumber },
                    ], false);
                    return [4 /*yield*/, payload.update({
                            collection: "customer-phone-number",
                            where: {
                                id: { equals: user.id },
                            },
                            data: {
                                // after login already set the default and can't change
                                phoneNumbers: updatedPhoneNumbers,
                            },
                        })];
                case 3:
                    _d.sent();
                    return [2 /*return*/, {
                            success: true,
                            message: api_messages_constant_1.PHONE_NUMBER_MESSAGE.SUCCESS,
                        }];
                case 4:
                    error_3 = _d.sent();
                    throw error_3;
                case 5: return [2 /*return*/];
            }
        });
    }); }),
    changeUserPhoneNumber: get_user_procedure_1.default
        .input(user_infor_valiator_1.PhoneValidationSchema.extend({ id: zod_1.z.string() }))
        .mutation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var user, phoneNumber, id, payload, isTryingModifySameNumber, updatedPhoneNumbers, error_4;
        var _c, _d, _e;
        var ctx = _b.ctx, input = _b.input;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    user = ctx.user;
                    phoneNumber = input.phoneNumber, id = input.id;
                    _f.label = 1;
                case 1:
                    _f.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, (0, get_client_payload_1.getPayloadClient)()];
                case 2:
                    payload = _f.sent();
                    isTryingModifySameNumber = ((_d = (_c = user.phoneNumbers) === null || _c === void 0 ? void 0 : _c.find(function (phone) { return phone.id === id; })) === null || _d === void 0 ? void 0 : _d.phoneNumber) ===
                        phoneNumber;
                    if (isTryingModifySameNumber)
                        return [2 /*return*/];
                    updatedPhoneNumbers = (_e = user.phoneNumbers) === null || _e === void 0 ? void 0 : _e.map(function (phone) {
                        return phone.id === id ? __assign(__assign({}, phone), { phoneNumber: phoneNumber }) : phone;
                    });
                    return [4 /*yield*/, payload.update({
                            collection: "customer-phone-number",
                            where: {
                                id: {
                                    equals: user.id,
                                },
                            },
                            data: {
                                phoneNumbers: updatedPhoneNumbers,
                            },
                        })];
                case 3:
                    _f.sent();
                    return [2 /*return*/, {
                            success: true,
                            message: api_messages_constant_1.PHONE_NUMBER_MESSAGE.UPDATE_SUCCESSFULLY,
                        }];
                case 4:
                    error_4 = _f.sent();
                    (0, error_server_util_1.throwTrpcInternalServer)(error_4);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); }),
    deletePhoneNumber: get_user_procedure_1.default
        .input(zod_1.z.object({ id: zod_1.z.string() }))
        .mutation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var user, id, payload, doesPhoneNumberExist, updatedPhoneNumbers, error_5;
        var _c, _d;
        var ctx = _b.ctx, input = _b.input;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    user = ctx.user;
                    id = input.id;
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, (0, get_client_payload_1.getPayloadClient)()];
                case 2:
                    payload = _e.sent();
                    if (!user)
                        throw new server_1.TRPCError({
                            code: "NOT_FOUND",
                            message: api_messages_constant_1.USER_MESSAGE.NOT_FOUND,
                        });
                    doesPhoneNumberExist = (_c = user.phoneNumbers) === null || _c === void 0 ? void 0 : _c.find(function (number) { return number.id === id; });
                    if (!doesPhoneNumberExist)
                        throw new server_1.TRPCError({
                            code: "NOT_FOUND",
                            message: api_messages_constant_1.PHONE_NUMBER_MESSAGE.CANT_DELETE,
                        });
                    // if is the defaultNumber can't delete
                    if (doesPhoneNumberExist.isDefault) {
                        throw new server_1.TRPCError({
                            code: "BAD_REQUEST",
                            message: api_messages_constant_1.PHONE_NUMBER_MESSAGE.CANT_DELETE,
                        });
                    }
                    updatedPhoneNumbers = (_d = user.phoneNumbers) === null || _d === void 0 ? void 0 : _d.filter(function (number) { return number.id !== id; });
                    return [4 /*yield*/, payload.update({
                            collection: "customer-phone-number",
                            where: {
                                id: {
                                    equals: user.id,
                                },
                            },
                            data: {
                                phoneNumbers: updatedPhoneNumbers,
                            },
                        })];
                case 3:
                    _e.sent();
                    return [2 /*return*/, {
                            deletedPhoneNumber: doesPhoneNumberExist.phoneNumber,
                            success: true,
                            message: "X\u00F3a s\u1ED1 \u0111i\u1EC7n tho\u1EA1i \n            ".concat(doesPhoneNumberExist.phoneNumber, "\n           th\u00E0nh c\u00F4ng"),
                        }];
                case 4:
                    error_5 = _e.sent();
                    throw error_5;
                case 5: return [2 /*return*/];
            }
        });
    }); }),
    changeUserName: get_user_procedure_1.default
        .input(auth_validation_1.SignUpCredentialSchema.pick({ name: true }))
        .mutation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var user, name, payload, error_6;
        var ctx = _b.ctx, input = _b.input;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    user = ctx.user;
                    name = input.name;
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, (0, get_client_payload_1.getPayloadClient)()];
                case 2:
                    payload = _c.sent();
                    if (name === user.name)
                        return [2 /*return*/];
                    return [4 /*yield*/, payload.update({
                            collection: "customer-phone-number",
                            where: {
                                id: {
                                    equals: user.id,
                                },
                            },
                            data: {
                                name: name,
                            },
                        })];
                case 3:
                    _c.sent();
                    return [2 /*return*/, { success: true, message: api_messages_constant_1.NAME_MESSAGE.UPDATE_SUCCESSFULLY }];
                case 4:
                    error_6 = _c.sent();
                    (0, error_server_util_1.throwTrpcInternalServer)(error_6);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); }),
    addNewAddress: get_user_procedure_1.default
        .input(user_infor_valiator_1.AddressValidationSchema)
        .mutation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var user, district, street, ward, name, phoneNumber, payload, isTheSameAddress, userResult, userAddresses, error_7;
        var _c, _d;
        var ctx = _b.ctx, input = _b.input;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    user = ctx.user;
                    district = input.district, street = input.street, ward = input.ward, name = input.name, phoneNumber = input.phoneNumber;
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, (0, get_client_payload_1.getPayloadClient)()];
                case 2:
                    payload = _e.sent();
                    isTheSameAddress = (_c = user.address) === null || _c === void 0 ? void 0 : _c.find(function (ad) {
                        return ad.district === district &&
                            ad.ward === ward &&
                            ad.street === street &&
                            ad.phoneNumber === phoneNumber &&
                            ad.name === name;
                    });
                    if (isTheSameAddress)
                        throw new server_1.TRPCError({
                            code: "CONFLICT",
                            message: api_messages_constant_1.ADDRESS_MESSAGE.CONFLICT,
                        });
                    return [4 /*yield*/, payload.update({
                            collection: "customer-phone-number",
                            where: {
                                id: { equals: user.id },
                            },
                            data: {
                                address: ((_d = user.address) === null || _d === void 0 ? void 0 : _d.length)
                                    ? __spreadArray(__spreadArray([], user.address, true), [
                                        {
                                            isDefault: false,
                                            district: district,
                                            street: street,
                                            ward: ward,
                                            phoneNumber: phoneNumber,
                                            name: name,
                                        },
                                    ], false) : [
                                    {
                                        isDefault: true,
                                        district: district,
                                        street: street,
                                        ward: ward,
                                        phoneNumber: phoneNumber,
                                        name: name,
                                    },
                                ],
                            },
                        })];
                case 3:
                    userResult = (_e.sent()).docs;
                    userAddresses = userResult[0].address;
                    return [2 /*return*/, { success: true, message: api_messages_constant_1.ADDRESS_MESSAGE.SUCCESS, userAddresses: userAddresses }];
                case 4:
                    error_7 = _e.sent();
                    throw error_7;
                case 5: return [2 /*return*/];
            }
        });
    }); }),
    setDefaultAddress: get_user_procedure_1.default
        .input(zod_1.z.object({ id: zod_1.z.string() }))
        .mutation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var user, id, payload, addressUpdateToDefault, updatedToDefault, error_8;
        var _c, _d;
        var ctx = _b.ctx, input = _b.input;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    user = ctx.user;
                    id = input.id;
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, (0, get_client_payload_1.getPayloadClient)()];
                case 2:
                    payload = _e.sent();
                    addressUpdateToDefault = (_c = user.address) === null || _c === void 0 ? void 0 : _c.find(function (ad) { return ad.id === id; });
                    if (!addressUpdateToDefault || addressUpdateToDefault.isDefault)
                        throw new server_1.TRPCError({
                            code: "NOT_FOUND",
                            message: api_messages_constant_1.ADDRESS_MESSAGE.CANT_SET_DEFAULT,
                        });
                    updatedToDefault = (_d = user.address) === null || _d === void 0 ? void 0 : _d.map(function (ad) {
                        return ad.id === id ? __assign(__assign({}, ad), { isDefault: true }) : __assign(__assign({}, ad), { isDefault: false });
                    });
                    return [4 /*yield*/, payload.update({
                            collection: "customer-phone-number",
                            where: {
                                id: {
                                    equals: user.id,
                                },
                            },
                            data: {
                                address: updatedToDefault,
                            },
                        })];
                case 3:
                    _e.sent();
                    return [2 /*return*/, {
                            success: true,
                            message: api_messages_constant_1.ADDRESS_MESSAGE.SET_DEFAULT_SUCCESSFULLY,
                        }];
                case 4:
                    error_8 = _e.sent();
                    throw error_8;
                case 5: return [2 /*return*/];
            }
        });
    }); }),
    adjustUserAddress: get_user_procedure_1.default
        .input(user_infor_valiator_1.AddressValidationSchema.extend({ id: zod_1.z.string() }))
        .mutation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var user, id, ward, district, street, phoneNumber, name, payload, existingAddress, isTheSameAddress, updatedAddress, error_9;
        var _c, _d, _e;
        var ctx = _b.ctx, input = _b.input;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    user = ctx.user;
                    id = input.id, ward = input.ward, district = input.district, street = input.street, phoneNumber = input.phoneNumber, name = input.name;
                    _f.label = 1;
                case 1:
                    _f.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, (0, get_client_payload_1.getPayloadClient)()];
                case 2:
                    payload = _f.sent();
                    existingAddress = (_c = user.address) === null || _c === void 0 ? void 0 : _c.find(function (ad) { return ad.id === id; });
                    if (!existingAddress)
                        throw new server_1.TRPCError({
                            code: "NOT_FOUND",
                            message: api_messages_constant_1.ADDRESS_MESSAGE.CANT_UPDATE,
                        });
                    isTheSameAddress = (_d = user.address) === null || _d === void 0 ? void 0 : _d.find(function (ad) {
                        return ad.district === district &&
                            ad.ward === ward &&
                            ad.street === street &&
                            ad.phoneNumber === phoneNumber &&
                            ad.name === name;
                    });
                    // TODO: THINK IF SHOULD NOTIFY USER OR NOT
                    if (isTheSameAddress)
                        return [2 /*return*/, { success: true, message: api_messages_constant_1.ADDRESS_MESSAGE.UPDATE_SUCCESSFULLY }];
                    updatedAddress = (_e = user.address) === null || _e === void 0 ? void 0 : _e.map(function (ad) {
                        return ad.id === id
                            ? __assign(__assign({}, ad), { ward: ward, district: district, street: street, name: name, phoneNumber: phoneNumber }) : __assign({}, ad);
                    });
                    return [4 /*yield*/, payload.update({
                            collection: "customer-phone-number",
                            where: {
                                id: {
                                    equals: user.id,
                                },
                            },
                            data: {
                                address: updatedAddress,
                            },
                        })];
                case 3:
                    _f.sent();
                    return [2 /*return*/, {
                            success: true,
                            message: api_messages_constant_1.ADDRESS_MESSAGE.UPDATE_SUCCESSFULLY,
                        }];
                case 4:
                    error_9 = _f.sent();
                    throw error_9;
                case 5: return [2 /*return*/];
            }
        });
    }); }),
    deleteAddress: get_user_procedure_1.default
        .input(zod_1.z.object({ id: zod_1.z.string() }))
        .mutation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var user, id, payload, doesAddressExist, updatedAddress, error_10;
        var _c, _d;
        var ctx = _b.ctx, input = _b.input;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    user = ctx.user;
                    id = input.id;
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, (0, get_client_payload_1.getPayloadClient)()];
                case 2:
                    payload = _e.sent();
                    if (!user)
                        throw new server_1.TRPCError({
                            code: "NOT_FOUND",
                            message: api_messages_constant_1.USER_MESSAGE.NOT_FOUND,
                        });
                    doesAddressExist = (_c = user.address) === null || _c === void 0 ? void 0 : _c.find(function (ad) { return ad.id === id; });
                    if (!doesAddressExist || doesAddressExist.isDefault)
                        throw new server_1.TRPCError({
                            code: "NOT_FOUND",
                            message: api_messages_constant_1.ADDRESS_MESSAGE.CANT_DELETE,
                        });
                    // do not allow to delete default Address
                    if (doesAddressExist.isDefault)
                        throw new server_1.TRPCError({
                            code: "BAD_REQUEST",
                            message: api_messages_constant_1.ADDRESS_MESSAGE.CANT_DELETE,
                        });
                    updatedAddress = (_d = user.address) === null || _d === void 0 ? void 0 : _d.filter(function (ad) { return ad.id !== id; });
                    return [4 /*yield*/, payload.update({
                            collection: "customer-phone-number",
                            where: {
                                id: {
                                    equals: user.id,
                                },
                            },
                            data: {
                                address: updatedAddress,
                            },
                        })];
                case 3:
                    _e.sent();
                    return [2 /*return*/, {
                            success: true,
                            message: api_messages_constant_1.ADDRESS_MESSAGE.DELETE_SUCCESSFULLY,
                        }];
                case 4:
                    error_10 = _e.sent();
                    throw error_10;
                case 5: return [2 /*return*/];
            }
        });
    }); }),
    setUserCart: get_user_procedure_1.default
        .input(zod_1.z.array(CartItemSchema))
        .mutation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var user, payload, updatedCart, error_11;
        var input = _b.input, ctx = _b.ctx;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    user = ctx.user;
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, (0, get_client_payload_1.getPayloadClient)()];
                case 2:
                    payload = _c.sent();
                    updatedCart = input;
                    // TODO: should i extend with the existing one or simply replace it
                    return [4 /*yield*/, payload.update({
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
                        })];
                case 3:
                    // TODO: should i extend with the existing one or simply replace it
                    _c.sent();
                    return [3 /*break*/, 5];
                case 4:
                    error_11 = _c.sent();
                    (0, error_server_util_1.throwTrpcInternalServer)(error_11);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); }),
});
exports.default = CustomerPhoneNumberRouter;
