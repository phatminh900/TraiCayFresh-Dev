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
var dotenv_1 = __importDefault(require("dotenv"));
var zod_1 = require("zod");
var trpc_1 = require("../trpc");
var path_1 = __importDefault(require("path"));
var get_client_payload_1 = require("../../payload/get-client-payload");
var util_utls_1 = require("../../utils/util.utls");
var error_server_util_1 = require("../../utils/server/error-server.util");
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../../../.env") });
var PaymentRouter = (0, trpc_1.router)({
    payWithMomo: trpc_1.getUserProcedure
        .input(zod_1.z.object({
        orderNotes: zod_1.z.string().optional(),
        shippingAddress: zod_1.z.object({
            address: zod_1.z.string(),
            userName: zod_1.z.string(),
            userPhoneNumber: zod_1.z.string(),
        }),
        // deliveryInfo: z.object({
        //   deliveryAddress: z.string(),
        //   deliveryFee: z.string(),
        //   quantity: z.string(),
        // }),
        // items: z.array(
        //   z.object({
        //     id: z.string(),
        //     imageUrl: z.string(),
        //     currency: z.literal("VND"),
        //     quantity: z.number(),
        //     // totalAmount: z.number(),
        //   })
        // ),
    }))
        .mutation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var payload_1, orderNotes_1, shippingAddress_1, user_1, userCart, cartTotalPrice, totalAfterCoupon_1, amount_1, coupon, couponInDb, salePrice, priceAfterDiscount, orderItems_1, partnerCode, accessKey, secretkey, requestId, orderId, orderDetails, orderInfo, redirectUrl, ipnUrl, requestType, extraData, rawSignature, crypto_1, signature, requestBody_1, https_1, error_1;
        var _c, _d;
        var ctx = _b.ctx, input = _b.input;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, (0, get_client_payload_1.getPayloadClient)()];
                case 1:
                    payload_1 = _e.sent();
                    orderNotes_1 = input.orderNotes, shippingAddress_1 = input.shippingAddress;
                    user_1 = ctx.user;
                    return [4 /*yield*/, payload_1.findByID({
                            collection: (0, util_utls_1.isEmailUser)(user_1)
                                ? "customers"
                                : "customer-phone-number",
                            id: user_1.id,
                            depth: 2,
                        })];
                case 2:
                    userCart = (_c = (_e.sent()).cart) === null || _c === void 0 ? void 0 : _c.items;
                    // return total + item.quantity! * (item.priceAfterDiscount! || item.originalPrice!),
                    if (!userCart)
                        return [2 /*return*/];
                    cartTotalPrice = userCart.reduce(function (total, item) {
                        var product = item.product;
                        return (total +
                            item.quantity *
                                (product.priceAfterDiscount || product.originalPrice));
                    }, 0);
                    totalAfterCoupon_1 = 0;
                    amount_1 = cartTotalPrice;
                    coupon = (_d = userCart.find(function (item) { return item.coupon; })) === null || _d === void 0 ? void 0 : _d.coupon;
                    if (!coupon) return [3 /*break*/, 4];
                    return [4 /*yield*/, payload_1.find({
                            collection: "coupons",
                            where: { coupon: { equals: coupon } },
                        })];
                case 3:
                    couponInDb = _e.sent();
                    if (!couponInDb) {
                        amount_1 = cartTotalPrice;
                        return [2 /*return*/];
                    }
                    salePrice = userCart.reduce(function (total, item) {
                        var product = item.product;
                        if (item.discountAmount) {
                            return (total +
                                (item.discountAmount *
                                    item.quantity *
                                    (product.priceAfterDiscount || product.originalPrice)) /
                                    100);
                        }
                        return total;
                    }, 0);
                    priceAfterDiscount = cartTotalPrice - salePrice;
                    amount_1 = priceAfterDiscount;
                    totalAfterCoupon_1 = priceAfterDiscount;
                    _e.label = 4;
                case 4:
                    orderItems_1 = userCart.map(function (item) {
                        var product = item.product;
                        return {
                            product: product.id,
                            price: product.priceAfterDiscount || product.originalPrice,
                            quantity: item.quantity,
                        };
                    });
                    partnerCode = process.env.MOMO_PARTNER_CODE;
                    accessKey = process.env.MOMO_ACCESS_KEY;
                    secretkey = process.env.MOMO_SECRET_KEY;
                    requestId = partnerCode + new Date().getTime() + user_1.id;
                    orderId = requestId;
                    orderDetails = userCart.reduce(function (acc, item) {
                        var product = item.product;
                        return "".concat(acc).concat(acc ? "," : "", " ").concat(item.quantity, "KG ").concat(product.title);
                    }, "");
                    orderInfo = "Thanh to\u00E1n ".concat(orderDetails);
                    redirectUrl = "".concat(process.env.NEXT_PUBLIC_SERVER_URL, "/");
                    ;
                    ipnUrl = "".concat(process.env.NEXT_PUBLIC_SERVER_URL, "/verify-momo-payment-success");
                    console.log('------------------');
                    console.log(ipnUrl);
                    requestType = "payWithATM";
                    extraData = "";
                    rawSignature = "accessKey=" +
                        accessKey +
                        "&amount=" +
                        amount_1 +
                        "&extraData=" +
                        extraData +
                        "&ipnUrl=" +
                        ipnUrl +
                        "&orderId=" +
                        orderId +
                        "&orderInfo=" +
                        orderInfo +
                        "&partnerCode=" +
                        partnerCode +
                        "&redirectUrl=" +
                        redirectUrl +
                        "&requestId=" +
                        requestId +
                        "&requestType=" +
                        requestType;
                    crypto_1 = require("crypto");
                    signature = crypto_1
                        .createHmac("sha256", secretkey)
                        .update(rawSignature)
                        .digest("hex");
                    requestBody_1 = JSON.stringify({
                        partnerCode: partnerCode,
                        accessKey: accessKey,
                        requestId: requestId,
                        amount: amount_1,
                        orderId: orderId,
                        orderInfo: orderInfo,
                        redirectUrl: redirectUrl,
                        ipnUrl: ipnUrl,
                        notifyUrl: ipnUrl,
                        extraData: extraData,
                        requestType: requestType,
                        signature: signature,
                        lang: "vi",
                        // items: {
                        //   id: "204727",
                        //   name: "YOMOST Bac Ha&Viet Quat 170ml",
                        //   description: "YOMOST Sua Chua Uong Bac Ha&Viet Quat 170ml/1 Hop",
                        //   category: "beverage",
                        //   imageUrl: "https://momo.vn/uploads/product1.jpg",
                        //   manufacturer: "Vinamilk",
                        //   price: 11000,
                        //   quantity: 5,
                        //   unit: "hộp",
                        //   totalPrice: 55000,
                        //   taxAmount: "200",
                        // },
                    });
                    https_1 = require("https");
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            var options = {
                                hostname: "test-payment.momo.vn",
                                port: 443,
                                path: "/v2/gateway/api/create",
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    "Content-Length": Buffer.byteLength(requestBody_1),
                                },
                            };
                            var req = https_1.request(options, function (res) {
                                res.setEncoding("utf8");
                                res.on("data", function (body) { return __awaiter(void 0, void 0, void 0, function () {
                                    var payUrl;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                console.log('---body');
                                                console.log(body);
                                                payUrl = JSON.parse(body).payUrl;
                                                if (!payUrl) return [3 /*break*/, 2];
                                                // create order
                                                return [4 /*yield*/, payload_1.create({
                                                        collection: "orders",
                                                        data: {
                                                            orderBy: user_1.id,
                                                            total: amount_1,
                                                            items: orderItems_1,
                                                            orderNotes: orderNotes_1,
                                                            _isPaid: false,
                                                            totalAfterCoupon: totalAfterCoupon_1,
                                                            shippingAddress: shippingAddress_1,
                                                            status: "pending",
                                                        },
                                                    })];
                                            case 1:
                                                // create order
                                                _a.sent();
                                                resolve({ success: true, payUrl: payUrl });
                                                _a.label = 2;
                                            case 2: return [2 /*return*/];
                                        }
                                    });
                                }); });
                                res.on("end", function () {
                                    console.log("No more data in response.");
                                });
                            });
                            req.on("error", function (error) {
                                console.error("Problem with request: ".concat(error.message));
                                reject({
                                    message: "Không thể thanh toán bằng momo vui lòng thử lại",
                                    code: 500,
                                });
                                // reject(error);
                            });
                            req.write(requestBody_1);
                            req.end();
                        })];
                case 5:
                    error_1 = _e.sent();
                    (0, error_server_util_1.throwTrpcInternalServer)(error_1);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); }),
    verifyMomoPaymentSuccessStatus: trpc_1.getUserProcedure.mutation(function (_a) {
        var ctx = _a.ctx;
        var res = ctx.res, req = ctx.req;
        var transactionInfo = req.body;
        console.log(transactionInfo);
        // TODO: Xác minh thông tin giao dịch tại đây
        // Phản hồi Momo với status code 200
        res.sendStatus(200);
    })
});
exports.default = PaymentRouter;
