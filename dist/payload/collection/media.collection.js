"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Media = void 0;
var isAdmin_1 = require("../access/isAdmin");
exports.Media = {
    slug: "media",
    access: {
        read: function () { return true; },
        update: isAdmin_1.isAdmins,
        delete: isAdmin_1.isAdmins,
        create: isAdmin_1.isAdmins,
    },
    hooks: {},
    upload: {
        staticURL: "/media",
        staticDir: "media",
        imageSizes: [
            {
                name: "thumbnail",
                width: 400,
                height: 300,
                position: "centre",
            },
            {
                name: "card",
                width: 768,
                height: 1024,
                position: "centre",
            },
            {
                name: "tablet",
                width: 1024,
                height: undefined,
                position: "centre",
            },
        ],
        mimeTypes: ["image/*"],
    },
    fields: [
        {
            name: "alt",
            label: "Alt",
            type: "text",
            required: true,
        },
    ],
};
