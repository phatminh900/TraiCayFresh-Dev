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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var server_1 = require("@trpc/server");
var rate_limiter_flexible_1 = require("rate-limiter-flexible");
var zod_1 = require("zod");
var api_messages_constant_1 = require("../../constants/api-messages.constant");
var get_client_payload_1 = require("../../payload/get-client-payload");
var util_utls_1 = require("../../utils/util.utls");
var get_user_procedure_1 = __importDefault(require("../middlewares/get-user-procedure"));
var trpc_1 = require("../trpc");
var rateLimiter = new rate_limiter_flexible_1.RateLimiterMemory({
    // FIXME: change later
    points: 100, // max number of points
    duration: 60 * 60, // per 1 hour,
});
var rateLimitMiddleware = get_user_procedure_1.default.use(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var req, err_1;
    var ctx = _b.ctx, next = _b.next;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                req = ctx.req;
                return [4 /*yield*/, rateLimiter.consume(ctx.req.ip || req.user)];
            case 1:
                _c.sent(); // assuming ctx.ip is the user's IP
                return [2 /*return*/, next()];
            case 2:
                err_1 = _c.sent();
                throw new server_1.TRPCError({
                    code: "TOO_MANY_REQUESTS",
                    message: "Too many requests from this IP, please try again in an hour!",
                });
            case 3: return [2 /*return*/];
        }
    });
}); });
var CouponRouter = (0, trpc_1.router)({
    applyCoupon: rateLimitMiddleware
        .input(zod_1.z.object({ coupon: zod_1.z.string() }))
        .mutation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var user, coupon, payload, coupons, couponInDb_1, isAppliedCoupon, updatedUserCart, error_1;
        var _c, _d;
        var ctx = _b.ctx, input = _b.input;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    user = ctx.user;
                    coupon = input.coupon;
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 8, , 9]);
                    return [4 /*yield*/, (0, get_client_payload_1.getPayloadClient)()];
                case 2:
                    payload = _e.sent();
                    return [4 /*yield*/, payload.find({
                            collection: "coupons",
                            where: { coupon: { equals: coupon } },
                        })];
                case 3:
                    coupons = (_e.sent()).docs;
                    if (!coupons.length)
                        throw new server_1.TRPCError({
                            code: "NOT_FOUND",
                            message: api_messages_constant_1.COUPON_MESSAGE.INVALID,
                        });
                    couponInDb_1 = coupons[0];
                    if (new Date(couponInDb_1.expiryDate).getTime() - Date.now() < 0) {
                        throw new server_1.TRPCError({
                            code: "BAD_REQUEST",
                            message: api_messages_constant_1.COUPON_MESSAGE.EXPIRED,
                        });
                    }
                    isAppliedCoupon = (_d = (_c = user.cart) === null || _c === void 0 ? void 0 : _c.items) === null || _d === void 0 ? void 0 : _d.every(function (item) { return item.isAppliedCoupon; });
                    if (isAppliedCoupon)
                        throw new server_1.TRPCError({
                            code: "CONFLICT",
                            message: api_messages_constant_1.COUPON_MESSAGE.ALREADY_APPLIED,
                        });
                    updatedUserCart = user.cart.items.map(function (_a) {
                        var product = _a.product, quantity = _a.quantity, isAppliedCoupon = _a.isAppliedCoupon, rest = __rest(_a, ["product", "quantity", "isAppliedCoupon"]);
                        var cartProduct = product;
                        if (!isAppliedCoupon) {
                            return __assign(__assign({}, rest), { product: cartProduct.id, discountAmount: couponInDb_1.discount, coupon: coupon, quantity: quantity, isAppliedCoupon: true });
                        }
                        return __assign(__assign({}, rest), { product: cartProduct.id, quantity: quantity, isAppliedCoupon: isAppliedCoupon });
                    });
                    if (!(0, util_utls_1.isEmailUser)(user)) return [3 /*break*/, 5];
                    return [4 /*yield*/, payload.update({
                            collection: "customers",
                            where: { id: { equals: user.id } },
                            data: { cart: { items: updatedUserCart } },
                        })];
                case 4:
                    _e.sent();
                    return [2 /*return*/, {
                            success: true,
                            message: api_messages_constant_1.COUPON_MESSAGE.SUCCESS,
                            updatedUserCart: updatedUserCart,
                        }];
                case 5:
                    if (!!(0, util_utls_1.isEmailUser)(user)) return [3 /*break*/, 7];
                    return [4 /*yield*/, payload.update({
                            collection: "customer-phone-number",
                            where: { id: { equals: user.id } },
                            data: { cart: { items: updatedUserCart } },
                        })];
                case 6:
                    _e.sent();
                    return [2 /*return*/, {
                            success: true,
                            message: api_messages_constant_1.COUPON_MESSAGE.SUCCESS,
                            updatedUserCart: updatedUserCart,
                        }];
                case 7: return [3 /*break*/, 9];
                case 8:
                    error_1 = _e.sent();
                    throw error_1;
                case 9: return [2 /*return*/];
            }
        });
    }); }),
    applyCouponBuyNow: rateLimitMiddleware
        .input(zod_1.z.object({ coupon: zod_1.z.string() }))
        .mutation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var coupon, payload, coupons, couponInDb, error_2;
        var ctx = _b.ctx, input = _b.input;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    coupon = input.coupon;
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, (0, get_client_payload_1.getPayloadClient)()];
                case 2:
                    payload = _c.sent();
                    return [4 /*yield*/, payload.find({
                            collection: "coupons",
                            where: { coupon: { equals: coupon } },
                        })];
                case 3:
                    coupons = (_c.sent()).docs;
                    if (!coupons.length)
                        throw new server_1.TRPCError({
                            code: "NOT_FOUND",
                            message: api_messages_constant_1.COUPON_MESSAGE.INVALID,
                        });
                    couponInDb = coupons[0];
                    if (new Date(couponInDb.expiryDate).getTime() - Date.now() < 0) {
                        throw new server_1.TRPCError({
                            code: "BAD_REQUEST",
                            message: api_messages_constant_1.COUPON_MESSAGE.EXPIRED,
                        });
                    }
                    return [2 /*return*/, {
                            success: true,
                            message: api_messages_constant_1.COUPON_MESSAGE.SUCCESS,
                            discount: couponInDb.discount,
                        }];
                case 4:
                    error_2 = _c.sent();
                    throw error_2;
                case 5: return [2 /*return*/];
            }
        });
    }); }),
});
exports.default = CouponRouter;