"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Orders = void 0;
exports.Orders = {
    slug: "orders",
    fields: [
        {
            name: "orderBy",
            label: "Order By User",
            type: "relationship",
            relationTo: "customers",
            hasMany: false,
            required: true,
        },
        { name: "orderNotes", label: "Order Notes", type: "text" },
        {
            name: "total",
            label: "Total",
            type: "number",
            required: true,
            min: 1,
        },
        {
            name: "totalAfterCoupon",
            label: "Total After Coupon",
            type: "number",
            // required: true,
        },
        { name: "_isPaid", type: "checkbox", defaultValue: false },
        {
            name: "shippingAddress",
            label: "Shipping Address",
            type: "group",
            fields: [
                { name: "userName", label: "User Name", type: "text", required: true },
                {
                    name: "userPhoneNumber",
                    label: "User PhoneNumber",
                    type: "text",
                    required: true,
                },
                { name: "address", label: "address", type: "text", required: true },
            ],
        },
        {
            name: "status",
            label: "Order's status",
            type: "select",
            options: [
                { label: "Pending", value: "pending" },
                { label: "Delivering", value: "delivering" },
                { label: "Canceled", value: "canceled" },
                { label: "Confirmed", value: "confirmed" },
            ],
        },
        {
            name: "items",
            type: "array",
            fields: [
                {
                    name: "product",
                    type: "relationship",
                    relationTo: "products",
                    required: true,
                },
                {
                    name: "price",
                    type: "number",
                    min: 0,
                },
                {
                    name: "quantity",
                    type: "number",
                    min: 0,
                },
            ],
        },
    ],
};
