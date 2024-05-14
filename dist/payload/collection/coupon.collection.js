"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Coupons = void 0;
var isAdmin_1 = require("../access/isAdmin");
exports.Coupons = {
    slug: "coupons",
    access: {
        read: isAdmin_1.isAdmins,
        update: isAdmin_1.isAdmins,
        create: isAdmin_1.isAdmins,
        delete: isAdmin_1.isAdmins,
    },
    fields: [
        {
            name: "coupon",
            label: "Coupon",
            type: "text",
        },
        { name: "discount", label: "Discount", type: "number", required: true },
        { name: "expiryDate", label: "Expiry Date", type: "date", required: true },
        { name: "usageCount", label: "Usage Count", type: "number", defaultValue: 0 },
        { name: "usageLimit", label: "Usage Limit", type: "number" },
    ],
};
