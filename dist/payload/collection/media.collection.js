"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Media = void 0;
var dotenv_1 = __importDefault(require("dotenv"));
var path_1 = __importDefault(require("path"));
var isAdmin_1 = require("../access/isAdmin");
dotenv_1.default.config({
    path: path_1.default.resolve(__dirname, "../../../.env"),
});
exports.Media = {
    slug: "media",
    access: {
        read: function () { return true; },
        update: isAdmin_1.isAdmins,
        delete: isAdmin_1.isAdmins,
        create: function () { return true; },
    },
    hooks: {},
    upload: {
        staticURL: '/media',
        staticDir: 'media',
        disableLocalStorage: true,
        imageSizes: [
            {
                name: 'thumbnail',
                width: 400,
                height: 300,
                crop: 'center'
            },
            {
                name: 'card',
                width: 768,
                height: 1024,
                crop: 'center'
            },
            {
                name: 'tablet',
                width: 1024,
                height: undefined,
                crop: 'center'
            }
        ],
        adminThumbnail: function (_a) {
            var doc = _a.doc;
            return "https://my-app-buckets.s3.ap-southeast-2.amazonaws.com/".concat(doc.filename);
        },
        mimeTypes: ["image/*"],
    },
    fields: [
        {
            name: "alt",
            label: "Alt",
            type: "text",
            required: true,
        },
        {
            name: 'url',
            type: 'text',
            access: {
                create: function () { return false; },
            },
            hooks: {
                afterRead: [
                    function (_a) {
                        var doc = _a.data;
                        if (doc) {
                            return "".concat(process.env.NEXT_PUBLIC_AWS_S3_ENDPOINT, "/").concat(doc.filename);
                        }
                    }
                ],
            },
        },
    ],
};
