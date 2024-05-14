"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Feedback = void 0;
var isAdmin_1 = require("../access/isAdmin");
exports.Feedback = {
    slug: "feedback",
    access: {
        read: isAdmin_1.isAdmins,
        update: isAdmin_1.isAdmins,
        delete: isAdmin_1.isAdmins,
        create: isAdmin_1.isAdmins,
    },
    hooks: {},
    fields: [
        {
            name: "feedback",
            type: "textarea",
            required: false,
        },
        {
            name: "feedbackOptions",
            label: "FeedBack Options",
            type: 'array',
            fields: [
                {
                    type: 'radio',
                    name: 'options',
                    label: 'Options',
                    options: [
                        { label: "Delivery Faster", value: 'delivery-faster' }, { label: "Need better serve attitude", value: 'better-serve-attitude' }
                    ],
                },
            ],
            // type:'select',
            //   options:[{label:"Delivery Faster",value:'delivery-faster'},{label:"Need better serve attitude",value:'better-serve-attitude'}]
        },
        {
            name: "user",
            label: "User",
            type: "relationship",
            relationTo: ["customers", "customer-phone-number"],
            hasMany: false,
            required: true,
        },
    ],
};
