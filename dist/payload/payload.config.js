"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
var path_1 = __importDefault(require("path"));
var bundler_webpack_1 = require("@payloadcms/bundler-webpack");
var db_mongodb_1 = require("@payloadcms/db-mongodb");
// import nestedDocs from '@payloadcms/plugin-nested-docs'
// import redirects from '@payloadcms/plugin-redirects'
// import seo from '@payloadcms/plugin-seo'
// import type { GenerateTitle } from '@payloadcms/plugin-seo/types'
var richtext_slate_1 = require("@payloadcms/richtext-slate");
var config_1 = require("payload/config");
var admins_collection_1 = require("./collection/admins.collection");
var customers_collection_1 = require("./collection/customers/customers.collection");
var products_collection_1 = require("./collection/products.collection");
var media_collection_1 = require("./collection/media.collection");
var reviews_collection_1 = require("./collection/reviews.collection");
var orders_collection_1 = require("./collection/orders.collection");
var otp_collection_1 = require("./collection/otp.collection");
var customer_phone_number_collection_1 = require("./collection/customer-phone-number.collection");
var coupon_collection_1 = require("./collection/coupon.collection");
dotenv_1.default.config({
    path: path_1.default.resolve(__dirname, "../../.env"),
});
exports.default = (0, config_1.buildConfig)({
    routes: {
        admin: "/admins",
    },
    admin: {
        user: admins_collection_1.Admins.slug,
        autoLogin: true
            ? {
                email: "phatminh900@gmail.com",
                password: "Ch@vameo5",
                prefillOnly: true,
            }
            : false,
        bundler: (0, bundler_webpack_1.webpackBundler)(),
        meta: {
            titleSuffix: "- TraiCayFresh",
            favicon: "/favicon.ico",
            ogImage: "/thumbnail.jpg",
        },
    },
    rateLimit: {
        max: 3000,
    },
    editor: (0, richtext_slate_1.slateEditor)({}),
    db: (0, db_mongodb_1.mongooseAdapter)({
        url: process.env.DATABASE_URI,
    }),
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL,
    collections: [
        admins_collection_1.Admins,
        products_collection_1.Products,
        orders_collection_1.Orders,
        reviews_collection_1.Reviews,
        customers_collection_1.Customers,
        media_collection_1.Media,
        otp_collection_1.Otp,
        customer_phone_number_collection_1.CustomerPhoneNumber,
        coupon_collection_1.Coupons,
    ],
    typescript: {
        outputFile: path_1.default.resolve(__dirname, "payload-types.ts"),
    },
    plugins: [],
});
