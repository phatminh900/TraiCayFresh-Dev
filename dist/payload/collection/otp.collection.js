"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Otp = void 0;
var isAdmin_1 = require("../access/isAdmin");
exports.Otp = {
    slug: "otp",
    access: {
        read: isAdmin_1.isAdmins,
        update: isAdmin_1.isAdmins,
        delete: isAdmin_1.isAdmins,
        create: isAdmin_1.isAdmins
    },
    hooks: {},
    fields: [
        {
            name: "otp",
            type: "text",
        },
        {
            name: "phoneNumber",
            type: "text",
        },
    ],
};
