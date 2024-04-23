"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = void 0;
var trpc_1 = require("./trpc");
var auth_router_1 = __importDefault(require("./router/auth.router"));
var user_router_1 = __importDefault(require("./router/user.router"));
var products_router_1 = __importDefault(require("./router/products.router"));
var customer_phone_number_router_1 = __importDefault(require("./router/customer-phone-number.router"));
var coupons_router_1 = __importDefault(require("./router/coupons.router"));
var payment_router_1 = __importDefault(require("./router/payment.router"));
var address_router_1 = __importDefault(require("./router/address.router"));
// import { productRouter } from "./routes/product-router";
// import { PaymentRouter } from "./routes/payment-router";
exports.appRouter = (0, trpc_1.router)({
    auth: auth_router_1.default,
    user: user_router_1.default,
    products: products_router_1.default,
    customerPhoneNumber: customer_phone_number_router_1.default,
    coupon: coupons_router_1.default,
    address: address_router_1.default,
    //   products: productRouter,
    payment: payment_router_1.default
});
