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
var path_1 = __importDefault(require("path"));
var dotenv_1 = __importDefault(require("dotenv"));
var zod_1 = require("zod");
var moment_1 = __importDefault(require("moment"));
var qs_1 = __importDefault(require("qs"));
var trpc_1 = require("../trpc");
var get_client_payload_1 = require("../../payload/get-client-payload");
var util_utls_1 = require("../../utils/util.utls");
var error_server_util_1 = require("../../utils/server/error-server.util");
var navigation_constant_1 = require("../../constants/navigation.constant");
var api_messages_constant_1 = require("../../constants/api-messages.constant");
var get_user_procedure_1 = __importDefault(require("../middlewares/get-user-procedure"));
var server_1 = require("@trpc/server");
var configs_constant_1 = require("../../constants/configs.constant");
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../../../.env") });
// TODO: freeship for orders meet condition
var calculateUserAmountAndCreateOrderItems = function (user) { return __awaiter(void 0, void 0, void 0, function () {
    var payload, userCart, cartTotalPrice, totalAfterCoupon, amount, coupon, couponInDb, salePrice, priceAfterDiscount, orderItems;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, (0, get_client_payload_1.getPayloadClient)()];
            case 1:
                payload = _c.sent();
                return [4 /*yield*/, payload.findByID({
                        collection: (0, util_utls_1.isEmailUser)(user) ? "customers" : "customer-phone-number",
                        id: user.id,
                        depth: 2,
                    })];
            case 2:
                userCart = (_a = (_c.sent()).cart) === null || _a === void 0 ? void 0 : _a.items;
                // return total + item.quantity! * (item.priceAfterDiscount! || item.originalPrice!),
                if (!userCart)
                    return [2 /*return*/];
                cartTotalPrice = userCart.reduce(function (total, item) {
                    var product = item.product;
                    return (total +
                        item.quantity * (product.priceAfterDiscount || product.originalPrice));
                }, 0);
                totalAfterCoupon = 0;
                amount = cartTotalPrice;
                coupon = (_b = userCart.find(function (item) { return item.coupon; })) === null || _b === void 0 ? void 0 : _b.coupon;
                if (!coupon) return [3 /*break*/, 4];
                return [4 /*yield*/, payload.find({
                        collection: "coupons",
                        where: { coupon: { equals: coupon } },
                    })];
            case 3:
                couponInDb = _c.sent();
                if (!couponInDb) {
                    amount = cartTotalPrice;
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
                amount = priceAfterDiscount;
                totalAfterCoupon = priceAfterDiscount;
                _c.label = 4;
            case 4:
                orderItems = userCart.map(function (item) {
                    var product = item.product;
                    return {
                        product: product.id,
                        price: product.priceAfterDiscount || product.originalPrice,
                        originalPrice: product.originalPrice,
                        quantity: item.quantity,
                    };
                });
                return [2 /*return*/, {
                        amount: amount,
                        totalAfterCoupon: totalAfterCoupon,
                        orderItems: orderItems,
                        userCart: userCart,
                        provisional: cartTotalPrice,
                    }];
        }
    });
}); };
var CheckoutInfoSchema = zod_1.z.object({
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
});
var PaymentRouter = (0, trpc_1.router)({
    payWithCash: get_user_procedure_1.default
        .input(CheckoutInfoSchema)
        .mutation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var orderNotes, shippingAddress, user, payload, resultCalculateAndOrderItems, amount, orderItems, totalAfterCoupon, userCart, provisional, shippingFee, newOrder, error_1;
        var ctx = _b.ctx, input = _b.input;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    orderNotes = input.orderNotes, shippingAddress = input.shippingAddress;
                    user = ctx.user;
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 5, , 6]);
                    return [4 /*yield*/, (0, get_client_payload_1.getPayloadClient)()];
                case 2:
                    payload = _c.sent();
                    return [4 /*yield*/, calculateUserAmountAndCreateOrderItems(user)];
                case 3:
                    resultCalculateAndOrderItems = _c.sent();
                    if (!resultCalculateAndOrderItems)
                        return [2 /*return*/];
                    amount = resultCalculateAndOrderItems.amount, orderItems = resultCalculateAndOrderItems.orderItems, totalAfterCoupon = resultCalculateAndOrderItems.totalAfterCoupon, userCart = resultCalculateAndOrderItems.userCart, provisional = resultCalculateAndOrderItems.provisional;
                    shippingFee = amount >= configs_constant_1.FREESHIP_BY_CASH_FROM ? 0 : configs_constant_1.DEFAULT_SHIPPING_FREE;
                    return [4 /*yield*/, payload.create({
                            collection: "orders",
                            data: {
                                deliveryStatus: "pending",
                                paymentMethod: "cash",
                                provisional: provisional,
                                orderBy: {
                                    value: user.id,
                                    relationTo: (0, util_utls_1.isEmailUser)(user)
                                        ? "customers"
                                        : "customer-phone-number",
                                },
                                total: amount + shippingFee,
                                items: orderItems,
                                orderNotes: orderNotes,
                                _isPaid: false,
                                shippingFee: shippingFee,
                                totalAfterCoupon: totalAfterCoupon,
                                shippingAddress: shippingAddress,
                                status: "pending",
                            },
                        })];
                case 4:
                    newOrder = _c.sent();
                    return [2 /*return*/, {
                            success: true,
                            url: "".concat(process.env.NEXT_PUBLIC_SERVER_URL).concat(navigation_constant_1.APP_URL.orderStatus, "?").concat(navigation_constant_1.APP_PARAMS.cartOrderId, "=").concat(newOrder.id),
                        }];
                case 5:
                    error_1 = _c.sent();
                    (0, error_server_util_1.throwTrpcInternalServer)(error_1);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); }),
    payWithCashBuyNow: get_user_procedure_1.default
        .input(zod_1.z
        .object({
        productId: zod_1.z.string(),
        quantity: zod_1.z.number(),
        couponCode: zod_1.z.string().optional(),
    })
        .merge(CheckoutInfoSchema))
        .mutation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var orderNotes, shippingAddress, quantity, productId, couponCode, user, payload, product, provisional, totalAfterCoupon, coupons, couponInDb, amount, orderItems, shippingFee, newOrder, error_2;
        var ctx = _b.ctx, input = _b.input;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    orderNotes = input.orderNotes, shippingAddress = input.shippingAddress, quantity = input.quantity, productId = input.productId, couponCode = input.couponCode;
                    user = ctx.user;
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 7, , 8]);
                    return [4 /*yield*/, (0, get_client_payload_1.getPayloadClient)()];
                case 2:
                    payload = _c.sent();
                    return [4 /*yield*/, payload.findByID({
                            collection: "products",
                            id: productId,
                        })];
                case 3:
                    product = _c.sent();
                    if (!product)
                        throw new server_1.TRPCError({
                            code: "NOT_FOUND",
                            message: api_messages_constant_1.PRODUCT_MESSAGE.NOT_FOUND,
                        });
                    provisional = (product.priceAfterDiscount || product.originalPrice) * quantity;
                    totalAfterCoupon = provisional;
                    if (!couponCode) return [3 /*break*/, 5];
                    return [4 /*yield*/, payload.find({
                            collection: "coupons",
                            where: { coupon: { equals: couponCode } },
                        })];
                case 4:
                    coupons = (_c.sent()).docs;
                    couponInDb = coupons[0];
                    if (couponInDb) {
                        totalAfterCoupon =
                            provisional - (provisional * couponInDb.discount) / 100;
                    }
                    _c.label = 5;
                case 5:
                    amount = totalAfterCoupon;
                    orderItems = [
                        {
                            product: productId,
                            price: product.priceAfterDiscount || product.originalPrice,
                            originalPrice: product.originalPrice,
                            quantity: quantity,
                        },
                    ];
                    shippingFee = amount >= configs_constant_1.FREESHIP_BY_CASH_FROM ? 0 : configs_constant_1.DEFAULT_SHIPPING_FREE;
                    return [4 /*yield*/, payload.create({
                            collection: "orders",
                            data: {
                                deliveryStatus: "pending",
                                paymentMethod: "cash",
                                provisional: provisional,
                                orderBy: {
                                    value: user.id,
                                    relationTo: (0, util_utls_1.isEmailUser)(user)
                                        ? "customers"
                                        : "customer-phone-number",
                                },
                                total: amount + shippingFee,
                                items: orderItems,
                                orderNotes: orderNotes,
                                _isPaid: false,
                                shippingFee: shippingFee,
                                totalAfterCoupon: totalAfterCoupon,
                                shippingAddress: shippingAddress,
                                status: "pending",
                            },
                        })];
                case 6:
                    newOrder = _c.sent();
                    return [2 /*return*/, {
                            success: true,
                            url: "".concat(process.env.NEXT_PUBLIC_SERVER_URL).concat(navigation_constant_1.APP_URL.orderStatus, "?").concat(navigation_constant_1.APP_PARAMS.cartOrderId, "=").concat(newOrder.id),
                        }];
                case 7:
                    error_2 = _c.sent();
                    (0, error_server_util_1.throwTrpcInternalServer)(error_2);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    }); }),
    payWithMomo: get_user_procedure_1.default
        .input(CheckoutInfoSchema)
        .mutation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var payload, orderNotes, shippingAddress, user, resultCalculateAndOrderItems, amount, orderItems, totalAfterCoupon, userCart, provisional, partnerCode, accessKey, secretkey, requestId, orderId, orderDetails, orderInfo, shippingFee, newOrder, redirectUrl, ipnUrl, requestType, extraData, rawSignature, crypto_1, signature, requestBody_1, https_1, error_3;
        var ctx = _b.ctx, input = _b.input;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, (0, get_client_payload_1.getPayloadClient)()];
                case 1:
                    payload = _c.sent();
                    orderNotes = input.orderNotes, shippingAddress = input.shippingAddress;
                    user = ctx.user;
                    return [4 /*yield*/, calculateUserAmountAndCreateOrderItems(user)];
                case 2:
                    resultCalculateAndOrderItems = _c.sent();
                    if (!resultCalculateAndOrderItems)
                        return [2 /*return*/];
                    amount = resultCalculateAndOrderItems.amount, orderItems = resultCalculateAndOrderItems.orderItems, totalAfterCoupon = resultCalculateAndOrderItems.totalAfterCoupon, userCart = resultCalculateAndOrderItems.userCart, provisional = resultCalculateAndOrderItems.provisional;
                    partnerCode = process.env.MOMO_PARTNER_CODE;
                    accessKey = process.env.MOMO_ACCESS_KEY;
                    secretkey = process.env.MOMO_SECRET_KEY;
                    requestId = partnerCode + new Date().getTime() + user.id;
                    orderId = requestId;
                    orderDetails = userCart.reduce(function (acc, item) {
                        var product = item.product;
                        return "".concat(acc).concat(acc ? "," : "", " ").concat(item.quantity, "KG ").concat(product.title);
                    }, "");
                    orderInfo = "Thanh to\u00E1n ".concat(orderDetails);
                    shippingFee = amount >= configs_constant_1.FREESHIP_FROM ? 0 : configs_constant_1.DEFAULT_SHIPPING_FREE;
                    return [4 /*yield*/, payload.create({
                            collection: "orders",
                            data: {
                                deliveryStatus: "pending",
                                provisional: provisional,
                                paymentMethod: "momo",
                                orderBy: {
                                    value: user.id,
                                    relationTo: (0, util_utls_1.isEmailUser)(user)
                                        ? "customers"
                                        : "customer-phone-number",
                                },
                                total: amount + shippingFee,
                                items: orderItems,
                                orderNotes: orderNotes,
                                shippingFee: 0,
                                _isPaid: false,
                                totalAfterCoupon: totalAfterCoupon,
                                shippingAddress: shippingAddress,
                                status: "pending",
                            },
                        })];
                case 3:
                    newOrder = _c.sent();
                    redirectUrl = "".concat(process.env.NEXT_PUBLIC_SERVER_URL).concat(navigation_constant_1.APP_URL.orderStatus, "?").concat(navigation_constant_1.APP_PARAMS.cartOrderId, "=").concat(newOrder.id);
                    ipnUrl = "".concat(process.env.NEXT_PUBLIC_SERVER_URL, "/verify-momo-payment-success");
                    console.log("------------------");
                    console.log(ipnUrl);
                    requestType = "payWithATM";
                    extraData = "";
                    rawSignature = "accessKey=" +
                        accessKey +
                        "&amount=" +
                        amount +
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
                        amount: amount,
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
                                res.on("data", function (body) {
                                    var payUrl = JSON.parse(body).payUrl;
                                    if (payUrl) {
                                        // create order
                                        resolve({ success: true, url: payUrl });
                                    }
                                });
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
                case 4:
                    error_3 = _c.sent();
                    throw new Error(api_messages_constant_1.CHECKOUT_MESSAGE.ERROR);
                case 5: return [2 /*return*/];
            }
        });
    }); }),
    verifyMomoPaymentSuccessStatus: get_user_procedure_1.default.mutation(function (_a) {
        var ctx = _a.ctx;
        var res = ctx.res, req = ctx.req;
        var transactionInfo = req.body;
        console.log(transactionInfo);
        // TODO: Xác minh thông tin giao dịch tại đây
        // Phản hồi Momo với status code 200
        res.sendStatus(200);
    }),
    payWithVnPay: get_user_procedure_1.default
        .input(CheckoutInfoSchema)
        .mutation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var payload, orderNotes, shippingAddress, user, req, resultCalculateAndOrderItems, amount, orderItems, totalAfterCoupon, userCart, provisional, shippingFee, newOrder, date, createDate, ipAddr, tmnCode, secretKey, vnpUrl, returnUrl, orderId, orderDetails, orderInfo, bankCode, locale, currCode, vnp_Params, signData, crypto_2, hmac, signed, error_4;
        var ctx = _b.ctx, input = _b.input;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, (0, get_client_payload_1.getPayloadClient)()];
                case 1:
                    payload = _c.sent();
                    orderNotes = input.orderNotes, shippingAddress = input.shippingAddress;
                    user = ctx.user, req = ctx.req;
                    return [4 /*yield*/, calculateUserAmountAndCreateOrderItems(user)];
                case 2:
                    resultCalculateAndOrderItems = _c.sent();
                    if (!resultCalculateAndOrderItems)
                        return [2 /*return*/];
                    amount = resultCalculateAndOrderItems.amount, orderItems = resultCalculateAndOrderItems.orderItems, totalAfterCoupon = resultCalculateAndOrderItems.totalAfterCoupon, userCart = resultCalculateAndOrderItems.userCart, provisional = resultCalculateAndOrderItems.provisional;
                    // if no user already handle in the previous middleware
                    //parameters
                    console.log("----amount");
                    console.log(amount);
                    shippingFee = amount >= configs_constant_1.FREESHIP_FROM ? 0 : configs_constant_1.DEFAULT_SHIPPING_FREE;
                    return [4 /*yield*/, payload.create({
                            collection: "orders",
                            data: {
                                deliveryStatus: "pending",
                                paymentMethod: "vnpay",
                                orderBy: {
                                    value: user.id,
                                    relationTo: (0, util_utls_1.isEmailUser)(user)
                                        ? "customers"
                                        : "customer-phone-number",
                                },
                                total: amount + shippingFee,
                                provisional: provisional,
                                items: orderItems,
                                orderNotes: orderNotes,
                                shippingFee: shippingFee,
                                _isPaid: false,
                                totalAfterCoupon: totalAfterCoupon,
                                shippingAddress: shippingAddress,
                                status: "pending",
                            },
                        })];
                case 3:
                    newOrder = _c.sent();
                    date = new Date();
                    createDate = (0, moment_1.default)(date).format("YYYYMMDDHHmmss");
                    ipAddr = req.headers["x-forwarded-for"] ||
                        req.connection.remoteAddress ||
                        req.socket.remoteAddress ||
                        // @ts-ignore
                        req.connection.socket.remoteAddress;
                    tmnCode = process.env.VN_PAY_TMN_CODE;
                    secretKey = process.env.VN_PAY_SECRET_KEY;
                    vnpUrl = process.env.VN_PAY_URL;
                    returnUrl = "".concat(process.env.NEXT_PUBLIC_SERVER_URL).concat(navigation_constant_1.APP_URL.orderStatus, "?").concat(navigation_constant_1.APP_PARAMS.cartOrderId, "=").concat(newOrder.id);
                    orderId = newOrder.id;
                    orderDetails = userCart.reduce(function (acc, item) {
                        var product = item.product;
                        return "".concat(acc).concat(acc ? "," : "", " ").concat(item.quantity, "KG ").concat(product.title);
                    }, "");
                    orderInfo = "Thanh to\u00E1n ".concat(orderDetails)
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "");
                    bankCode = void 0;
                    locale = "vn";
                    if (locale === null || locale === "") {
                        locale = "vn";
                    }
                    currCode = "VND";
                    vnp_Params = {};
                    vnp_Params["vnp_Version"] = "2.1.0";
                    vnp_Params["vnp_Command"] = "pay";
                    vnp_Params["vnp_TmnCode"] = tmnCode;
                    vnp_Params["vnp_Locale"] = locale;
                    vnp_Params["vnp_CurrCode"] = currCode;
                    vnp_Params["vnp_TxnRef"] = orderId;
                    vnp_Params["vnp_OrderInfo"] = orderInfo;
                    vnp_Params["vnp_OrderType"] = "other";
                    vnp_Params["vnp_Amount"] = amount * 100;
                    vnp_Params["vnp_ReturnUrl"] = returnUrl;
                    vnp_Params["vnp_IpAddr"] = ipAddr;
                    vnp_Params["vnp_CreateDate"] = createDate;
                    // if (bankCode !== null && bankCode !== "") {
                    //   vnp_Params["vnp_BankCode"] = bankCode;
                    // }
                    vnp_Params = sortObject(vnp_Params);
                    signData = qs_1.default.stringify(vnp_Params, { encode: false });
                    crypto_2 = require("crypto");
                    hmac = crypto_2.createHmac("sha512", secretKey);
                    signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
                    vnp_Params["vnp_SecureHash"] = signed;
                    vnpUrl += "?" + qs_1.default.stringify(vnp_Params, { encode: false });
                    return [2 /*return*/, { success: true, url: vnpUrl }];
                case 4:
                    error_4 = _c.sent();
                    throw new Error(api_messages_constant_1.CHECKOUT_MESSAGE.ERROR);
                case 5: return [2 /*return*/];
            }
        });
    }); }),
});
exports.default = PaymentRouter;
function sortObject(obj) {
    var sorted = {};
    var str = [];
    var key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}
