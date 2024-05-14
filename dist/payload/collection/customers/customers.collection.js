"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Customers = void 0;
var isAdmin_1 = require("../../access/isAdmin");
var adminsOrLoggedIn_1 = require("../../access/adminsOrLoggedIn");
var anyone_1 = require("../../access/anyone");
exports.Customers = {
    slug: "customers",
    access: {
        read: adminsOrLoggedIn_1.isAdminAndCustomer,
        update: adminsOrLoggedIn_1.isAdminAndCustomer,
        create: anyone_1.anyone,
        delete: isAdmin_1.isAdmins,
    },
    auth: {
        cookies: {
            secure: true
        },
        // token expires after 30days
        tokenExpiration: 2592000000,
        maxLoginAttempts: 7,
        lockTime: 600 * 1000,
        forgotPassword: {
            generateEmailHTML: function (agrs) {
                var req = agrs === null || agrs === void 0 ? void 0 : agrs.req;
                var user = agrs === null || agrs === void 0 ? void 0 : agrs.user;
                var token = agrs === null || agrs === void 0 ? void 0 : agrs.token;
                // Use the token provided to allow your user to reset their password
                var resetPasswordURL = "".concat(process.env.NEXT_PUBLIC_SERVER_URL, "/reset-password?token=").concat(token);
                return "\n          <!doctype html>\n          <html>\n            <body>\n              <h1>Here is my custom email template!</h1>\n              <p>Hello, ".concat(user.email, "!</p>\n              <p>Click below to reset your password.</p>\n              <p>\n                <a href=\"").concat(resetPasswordURL, "\">").concat(resetPasswordURL, "</a>\n              </p>\n            </body>\n          </html>\n        ");
            },
        },
        verify: {
            generateEmailHTML: function (token) {
                return "<p>Hi please verify your email ".concat(token, "</p>");
            },
        },
    },
    fields: [
        {
            name: "name",
            label: "Name",
            type: "text",
            required: true,
        },
        {
            name: "phoneNumbers",
            label: "Phone Number",
            type: "array",
            maxRows: 5,
            fields: [
                {
                    name: "isDefault",
                    label: "Is Default Phone Number",
                    type: "checkbox",
                },
                {
                    name: "phoneNumber",
                    label: "Phone Number",
                    type: "text",
                    required: true,
                },
            ],
        },
        {
            name: "address",
            label: "Address",
            type: "array",
            maxRows: 5,
            fields: [
                {
                    name: "isDefault",
                    label: "Is Default Address",
                    type: "checkbox",
                },
                { name: "district", label: "District", type: "text", required: true },
                { name: "ward", label: "Ward", type: "text", required: true },
                { name: "street", label: "Street", type: "text", required: true },
                { name: "name", label: "Name", type: "text", required: true },
                {
                    name: "phoneNumber",
                    label: "Phone Number",
                    type: "text",
                    required: true,
                },
                // {
                //   name: "address",
                //   label: "Address",
                //   type: "text",
                //   required: true,
                // },
            ],
        },
        {
            label: "Cart",
            name: "cart",
            type: "group",
            fields: [
                {
                    name: "items",
                    label: "Items",
                    type: "array",
                    interfaceName: "CartItems",
                    fields: [
                        {
                            name: "product",
                            type: "relationship",
                            relationTo: "products",
                        },
                        { name: "price", type: 'number' },
                        {
                            name: "quantity",
                            type: "number",
                            min: 0,
                            max: 20,
                            admin: {
                                step: 0.5,
                            },
                        },
                        {
                            name: "isAppliedCoupon",
                            type: "checkbox",
                            defaultValue: false,
                        },
                        { name: "coupon", type: "text" },
                        {
                            name: "discountAmount",
                            type: "number",
                        },
                        {
                            name: "shippingCost",
                            type: "number",
                        },
                    ],
                },
                // If you wanted to maintain a 'created on'
                // or 'last modified' date for the cart
                // you could do so here:
                // {
                //   name: 'createdOn',
                //   label: 'Created On',
                //   type: 'date',
                //   admin: {
                //     readOnly: true
                //   }
                // },
                // {
                //   name: 'lastModified',
                //   label: 'Last Modified',
                //   type: 'date',
                //   admin: {
                //     readOnly: true
                //   }
                // },
            ],
        },
        {
            name: "purchases",
            label: "Purchases",
            type: "relationship",
            relationTo: "products",
            hasMany: true,
            hooks: {
            //   beforeChange: [resolveDuplicatePurchases],
            },
        },
        {
            name: "cancelOrders",
            label: "Cancel Order Times",
            type: "number",
            max: 2,
            defaultValue: 0,
        },
        { name: "isTrusted", label: "Is Trusted", type: "checkbox" },
    ],
};
