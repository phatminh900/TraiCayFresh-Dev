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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var server_1 = require("@trpc/server");
var zod_1 = require("zod");
var api_messages_constant_1 = require("../../constants/api-messages.constant");
var configs_constant_1 = require("../../constants/configs.constant");
var get_client_payload_1 = require("../../payload/get-client-payload");
var get_user_procedure_1 = __importDefault(require("../middlewares/get-user-procedure"));
var trpc_1 = require("../trpc");
var cancelReasons = {
    "add-change-coupon-code": "add-change-coupon-code",
    "another-reason": "another-reason",
    "bad-service-quality": "bad-service-quality",
    "dont-want-to-buy": "dont-want-to-buy",
    "update-address-phone-number": "update-address-phone-number",
};
var OrderRouter = (0, trpc_1.router)({
    cancelOrder: get_user_procedure_1.default
        .input(zod_1.z.object({
        orderId: zod_1.z.string(),
        cancelReason: zod_1.z
            .literal(cancelReasons["add-change-coupon-code"])
            .or(zod_1.z.literal(cancelReasons["another-reason"]))
            .or(zod_1.z.literal(cancelReasons["bad-service-quality"]))
            .or(zod_1.z.literal(cancelReasons["dont-want-to-buy"]))
            .or(zod_1.z.literal(cancelReasons["update-address-phone-number"])),
    }))
        .mutation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var user, orderId, cancelReason, payload, order, orderUserId, error_1;
        var input = _b.input, ctx = _b.ctx;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    user = ctx.user;
                    orderId = input.orderId, cancelReason = input.cancelReason;
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 5, , 6]);
                    return [4 /*yield*/, (0, get_client_payload_1.getPayloadClient)()];
                case 2:
                    payload = _c.sent();
                    return [4 /*yield*/, payload.findByID({
                            collection: "orders",
                            id: orderId,
                        })];
                case 3:
                    order = _c.sent();
                    if (!order)
                        throw new server_1.TRPCError({
                            code: "NOT_FOUND",
                            message: api_messages_constant_1.ORDER_MESSAGE.NOT_FOUND,
                        });
                    orderUserId = order.orderBy.value;
                    if (typeof order.orderBy.value === "object") {
                        // orderUserId=
                        orderUserId = order.orderBy.value.id;
                    }
                    if (orderUserId !== user.id || order.deliveryStatus !== "pending")
                        throw new server_1.TRPCError({
                            code: "BAD_REQUEST",
                            message: api_messages_constant_1.ORDER_MESSAGE.BAD_REQUEST,
                        });
                    return [4 /*yield*/, payload.update({
                            collection: "orders",
                            id: orderId,
                            data: {
                                cancelReason: cancelReason,
                                status: "canceled",
                                deliveryStatus: "canceled",
                            },
                        })];
                case 4:
                    _c.sent();
                    return [2 /*return*/, { success: true, message: api_messages_constant_1.ORDER_MESSAGE.SUCCESS_CANCEL_ORDER }];
                case 5:
                    error_1 = _c.sent();
                    throw error_1;
                case 6: return [2 /*return*/];
            }
        });
    }); }),
    getOrders: get_user_procedure_1.default
        .input(zod_1.z.object({ page: zod_1.z.number() }))
        .query(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var user, page, payload, result, limit, orders, totalPages, totalDocs, hasNextPage, pagingCounter, error_2;
        var ctx = _b.ctx, input = _b.input;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    user = ctx.user;
                    page = input.page;
                    return [4 /*yield*/, (0, get_client_payload_1.getPayloadClient)()];
                case 1:
                    payload = _c.sent();
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, payload.find({
                            collection: "orders",
                            where: {
                                "orderBy.value": {
                                    equals: user.id,
                                },
                            },
                            page: page,
                            limit: configs_constant_1.USER_ORDERS_SHOW_LIMIT,
                            // get all the imgs nested as well
                            depth: 2,
                        })];
                case 3:
                    result = _c.sent();
                    limit = result.limit, orders = result.docs, totalPages = result.totalPages, totalDocs = result.totalDocs, hasNextPage = result.hasNextPage, pagingCounter = result.pagingCounter;
                    // TODO: limit
                    return [2 /*return*/, {
                            success: true,
                            orders: orders,
                            totalPages: totalPages,
                            totalDocs: totalDocs,
                            hasNextPage: hasNextPage,
                            pagingCounter: pagingCounter,
                        }];
                case 4:
                    error_2 = _c.sent();
                    throw error_2;
                case 5: return [2 /*return*/];
            }
        });
    }); }),
});
exports.default = OrderRouter;
