"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var auth_validation_1 = require("../../validations/auth.validation");
var trpc_1 = require("../trpc");
var server_1 = require("@trpc/server");
var get_client_payload_1 = require("../../payload/get-client-payload");
var zod_1 = require("zod");
var api_messages_constant_1 = require("../../constants/api-messages.constant");
var error_server_util_1 = require("../../utils/server/error-server.util");
// PREVENT LOGIN TOO MUCH
var AuthRouter = (0, trpc_1.router)({
    signUp: trpc_1.publicProcedure
        .input(auth_validation_1.SignUpCredentialSchema)
        .mutation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var email, password, passwordConfirm, name, payload, customers, error_1;
        var input = _b.input;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    email = input.email, password = input.password, passwordConfirm = input.passwordConfirm, name = input.name;
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 5, , 6]);
                    if (password !== passwordConfirm) {
                        throw new server_1.TRPCError({
                            code: "BAD_REQUEST",
                            message: "Mật khẩu và xác nhận mật khẩu không giống nhau",
                        });
                    }
                    return [4 /*yield*/, (0, get_client_payload_1.getPayloadClient)()];
                case 2:
                    payload = _c.sent();
                    return [4 /*yield*/, payload.find({
                            collection: "customers",
                            where: {
                                email: {
                                    equals: email,
                                },
                            },
                        })];
                case 3:
                    customers = (_c.sent()).docs;
                    if (customers.length) {
                        throw new server_1.TRPCError({
                            code: "CONFLICT",
                            message: "Email này đã đăng kí rồi. Thử đăng nhập lại nhé.",
                        });
                    }
                    return [4 /*yield*/, payload.create({
                            collection: "customers",
                            data: {
                                email: email,
                                password: password,
                                name: name,
                            },
                        })];
                case 4:
                    _c.sent();
                    return [2 /*return*/, { success: true, emailSentTo: email }];
                case 5:
                    error_1 = _c.sent();
                    throw error_1;
                case 6: return [2 /*return*/];
            }
        });
    }); }),
    login: trpc_1.publicProcedure
        .input(auth_validation_1.AuthCredentialSchema)
        .mutation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var email, password, res, payload, docs, err_1;
        var input = _b.input, ctx = _b.ctx;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    email = input.email, password = input.password;
                    res = ctx.res;
                    return [4 /*yield*/, (0, get_client_payload_1.getPayloadClient)()];
                case 1:
                    payload = _c.sent();
                    return [4 /*yield*/, payload.find({
                            collection: "customers",
                            where: {
                                email: {
                                    equals: email,
                                },
                                _verified: {
                                    equals: false,
                                },
                            },
                        })];
                case 2:
                    docs = (_c.sent()).docs;
                    if (docs.length) {
                        throw new server_1.TRPCError({
                            code: "FORBIDDEN",
                            message: "Vui lòng xác nhận email.",
                        });
                    }
                    _c.label = 3;
                case 3:
                    _c.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, payload.login({
                            collection: "customers",
                            data: {
                                email: email,
                                password: password,
                            },
                            res: res,
                        })];
                case 4:
                    _c.sent();
                    return [2 /*return*/, { success: true, message: "Đăng nhập thành công" }];
                case 5:
                    err_1 = _c.sent();
                    throw new server_1.TRPCError({
                        code: "UNAUTHORIZED",
                        message: "Tài khoản hoặc mật khẩu sai.",
                    });
                case 6: return [2 /*return*/];
            }
        });
    }); }),
    verifyEmail: trpc_1.publicProcedure
        .input(zod_1.z.object({ token: zod_1.z.string() }))
        .query(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var token, payload, isVerified, error_2;
        var input = _b.input;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    token = input.token;
                    if (!token)
                        return [2 /*return*/];
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, (0, get_client_payload_1.getPayloadClient)()];
                case 2:
                    payload = _c.sent();
                    return [4 /*yield*/, payload.verifyEmail({
                            collection: "customers",
                            token: token,
                        })];
                case 3:
                    isVerified = _c.sent();
                    if (!isVerified)
                        throw new server_1.TRPCError({ code: "UNAUTHORIZED", message: api_messages_constant_1.AUTH_MESSAGE.INVALID_EMAIL_TOKEN });
                    return [2 /*return*/, { success: true }];
                case 4:
                    error_2 = _c.sent();
                    throw error_2;
                case 5: return [2 /*return*/];
            }
        });
    }); }),
    resetPassword: trpc_1.publicProcedure
        .input(auth_validation_1.SignUpCredentialSchema.pick({
        password: true,
        passwordConfirm: true,
    }).extend({ token: zod_1.z.string() }))
        .mutation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var password, passwordConfirm, token, payload, error_3;
        var input = _b.input;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    password = input.password, passwordConfirm = input.passwordConfirm, token = input.token;
                    if (password !== passwordConfirm) {
                        throw new server_1.TRPCError({
                            code: "BAD_REQUEST",
                            message: "Mật khẩu và xác nhận mật khẩu không giống nhau",
                        });
                    }
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, (0, get_client_payload_1.getPayloadClient)()];
                case 2:
                    payload = _c.sent();
                    return [4 /*yield*/, payload.resetPassword({
                            collection: "customers",
                            data: { password: password, token: token },
                            overrideAccess: true,
                        })];
                case 3:
                    _c.sent();
                    return [2 /*return*/, { success: true, message: 'Thay đổi mật khẩu thành công' }];
                case 4:
                    error_3 = _c.sent();
                    throw new server_1.TRPCError({
                        code: "BAD_REQUEST",
                        message: "Link yêu cầu đổi mật khẩu có thể hết hạn hoặc không đúng vui lòng kiểm tra lại email hoặc yêu cầu gửi lại mã xác nhận",
                    });
                case 5: return [2 /*return*/];
            }
        });
    }); }),
    // TODO: ask Nguyen
    checkIfEmailExist: trpc_1.publicProcedure
        .input(auth_validation_1.AuthCredentialSchema.pick({ email: true }))
        .mutation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var email, payload, docs, error_4;
        var input = _b.input;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    email = input.email;
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, (0, get_client_payload_1.getPayloadClient)()];
                case 2:
                    payload = _c.sent();
                    return [4 /*yield*/, payload.find({
                            collection: "customers",
                            where: {
                                email: {
                                    equals: email,
                                },
                            },
                        })];
                case 3:
                    docs = (_c.sent()).docs;
                    if (!docs.length)
                        throw new server_1.TRPCError({
                            code: "NOT_FOUND",
                            message: "Email chưa được đăng kí. Đăng kí ngay nhé",
                        });
                    return [2 /*return*/, { success: true, email: email }];
                case 4:
                    error_4 = _c.sent();
                    (0, error_server_util_1.throwTrpcInternalServer)(error_4);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); }),
});
exports.default = AuthRouter;
