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
                return "\n        <!DOCTYPE html>\n        <html>\n          <body>\n            <h2>Xin ch\u00E0o ".concat(user.email, ",</h2>\n            <p>Vui l\u00F2ng nh\u1EA5p v\u00E0o link b\u00EAn d\u01B0\u1EDBi \u0111\u1EC3 \u0111\u1ED5i l\u1EA1i m\u1EADt kh\u1EA5u</p>\n            <a href=\"").concat(resetPasswordURL, "\" style=\"background-color: #22C55E; color: black; padding: 14px 20px; text-align: center; text-decoration: none; display: inline-block;\">\u0110\u1EB7t lai m\u1EADt kh\u1EA9u</a>\n\n            <p>Xin C\u1EA3m \u01A1n,</p>\n            <p>TraiCayFresh</p>\n          </body>\n        </html>\n        ");
            },
        },
        verify: {
            generateEmailHTML: function (_a) {
                var req = _a.req, token = _a.token, user = _a.user;
                // Use the token provided to allow your user to verify their account
                var url = "".concat(process.env.NEXT_PUBLIC_SERVER_URL, "/verify?token=").concat(token);
                return "\n          <!DOCTYPE html>\n          <html>\n            <body>\n              <h2>Xin ch\u00E0o ".concat(user.email, ",</h2>\n              <p>C\u1EA3m \u01A1n b\u1EA1n \u0111\u00E3 \u0111\u0103ng k\u00ED t\u00E0i kho\u1EA3n t\u1EA1i TraiCayFresh. Vui l\u00F2ng x\u00E1c th\u1EF1c t\u00E0i kho\u1EA3n c\u1EE7a b\u1EA1n b\u1EB1ng c\u00E1ch nh\u1EA5p v\u00E0o link li\u00EAn k\u1EBFt b\u00EAn d\u01B0\u1EDBi.</p>\n              <a href=\"").concat(url, "\" style=\"background-color: #22C55E; color: blalck; padding: 14px 20px; text-align: center; text-decoration: none; display: inline-block;\">X\u00E1c th\u1EF1c Email</a>\n              <p>N\u1EBFu b\u1EA1n kh\u00F4ng th\u1EF1c hi\u1EC7n h\u00E0nh \u0111\u1ED9ng n\u00E0y, b\u1EA1n c\u00F3 th\u1EC3 b\u1ECF qua email n\u00E0y.</p>\n              <p>Xin c\u1EA3m \u01A1n,</p>\n              <p>TraiCayFresh</p>\n            </body>\n          </html>\n        ");
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
