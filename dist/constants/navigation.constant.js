"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APP_PARAMS = exports.APP_URL = void 0;
exports.APP_URL = {
    home: "/",
    cart: "/cart",
    products: "/products",
    signUp: "/sign-up",
    login: "/login",
    myProfile: "/my-profile",
    myOrders: "/my-orders",
    checkout: '/checkout',
    forgotPassword: "/forgot-password",
    resetPassword: "/reset-password",
    orderStatus: '/order-status',
    contact: '/contact',
    aboutUs: '/about-us',
    verifyEmail: '/verify-email'
};
exports.APP_PARAMS = {
    // TODO: adjust consistency
    token: "token=",
    toEmail: "toEmail=",
    origin: 'origin',
    currentQuantityOption: "currentQuantityOption",
    isOpenOtp: 'isOpenOtp',
    cartOrderId: 'cartOrderId',
    checkoutFlow: 'checkoutFlow',
    productId: 'productId'
};
