import { CollectionConfig } from "payload/types";
import { isAdmins } from "../access/isAdmin";

export const Products: CollectionConfig = {
  slug: "products",
  access: {
    read: isAdmins,
    update: isAdmins,
    create: isAdmins,
    delete: isAdmins,
  },
  fields: [
    { name: "title", label: "Title", type: "text", required: true },
    {
      name: "_inStock",
      label: "In Stock",
      type: "checkbox",
      defaultValue: true,
    },
    {
      name: "priority",
      type: "checkbox",
      label: "Priority",
      defaultValue: false,
      required: true,
    },
    {
      name: "originalPrice",
      label: "OriginalPrice",
      type: "number",
      min: 0,
      required: true,
    },
    { name: "discount", label: "Discount", type: "number", min: 0 },
    {
      name: "priceAfterDiscount",
      label: "Price After Discount",
      type: "number",
      min: 0,
    },
    {
      name: "quantityOptions",
      label: "Quantity Options",
      type: "array",
      fields: [
        {
          name: "kg",
          type: "number",
          required: true,
        },
      ],
    },
    {
      name: "estimateQuantityFor1Kg",
      label: "Estimate Quantity For 1Kg",
      type: "text",
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      required: true,
    },
    {
      name: "thumbnailImg",
      label: "Thumbnail Img",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: "productImgs",
      label: "Product Imgs",
      type: "relationship",
      relationTo: "media",
      required: true,
      hasMany: true,
      minRows: 2,
    },
    {
      name: "benefitImg",
      label: "Benefit Img",
      type: "relationship",
      relationTo: "media",
      required: true,
    },

    {
      name: "discountCode",
      label: "Discount Code",
      type: "text",
      required: false,
    },
    {
      name: "reviewQuantity",
      label: "Review Quantity",
      type: "number",
      required: false,
    },
    {
      name: "ratingAvarage",
      label: "Review's ratings",
      type: "number",
      required: false,
    },
    {
      name: "relativeProducts",
      label: "Relative Products",
      type: "relationship",
      relationTo: "products",
      hasMany: true,
    },
  ],
};
