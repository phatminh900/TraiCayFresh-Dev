"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admins = void 0;
exports.Admins = {
    slug: "admins",
    auth: true,
    fields: [
        {
            name: "name",
            label: "Name",
            type: "text",
            required: true,
        },
        { name: "role", label: "Role", type: "text", defaultValue: "admin" },
    ],
};
