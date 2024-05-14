"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reviews = void 0;
var isAdmin_1 = require("../../access/isAdmin");
var update_product_review_rating_quantity_1 = require("./hooks/update-product-review-rating-quantity");
exports.Reviews = {
    slug: "reviews",
    access: {
        delete: isAdmin_1.isAdmins,
        update: isAdmin_1.isAdmins,
        read: isAdmin_1.isAdmins,
        create: isAdmin_1.isAdmins,
    },
    hooks: {
        afterChange: [update_product_review_rating_quantity_1.updateProductReviewRatingQuantityAfterChange],
        afterDelete: [update_product_review_rating_quantity_1.updateProductReviewRatingQuantityAfterDelete],
    },
    fields: [
        {
            name: "reviewText",
            label: "Review",
            type: "text",
        },
        {
            name: "rating",
            label: "Rating",
            type: "number",
            required: true,
            min: 1,
            max: 5,
        },
        {
            name: "reviewImgs",
            label: "Review's Images",
            type: "array",
            fields: [
                {
                    name: "reviewImg",
                    type: "relationship",
                    relationTo: "media",
                },
            ],
            maxRows: 3,
        },
        {
            name: "product",
            label: "Review's of Product",
            type: "relationship",
            relationTo: "products",
            required: true,
            hasMany: false,
        },
        {
            name: "user",
            label: "Review's of User",
            type: "relationship",
            relationTo: ["customer-phone-number", "customers"],
            hasMany: false,
            required: true,
        },
    ],
};
