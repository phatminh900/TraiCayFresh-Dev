import { CollectionConfig } from "payload/types";
import { clearUserCart } from "./customers/hooks/clearUserCart";

export const Orders: CollectionConfig = {
  slug: "orders",
  hooks: {
    afterChange: [clearUserCart],
  },
  fields: [
    {
      name: "orderBy",
      label: "Order By User",
      type: "relationship",
      relationTo: ["customers", "customer-phone-number"],
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
        { label: "Pending", value: "failed" },

        // { label: "Delivering", value: "delivering" },
        { label: "Canceled", value: "canceled" },
        { label: "Confirmed", value: "confirmed" },
      ],
    },
    {
      name: "deliveryStatus",
      label: "Delivering's status",
      type: "select",
      options: [
        { label: "Pending", value: "pending" },
        { label: "Delivering", value: "delivering" },
        { label: "Confirmed", value: "delivered" },
        { label: "Canceled", value: "canceled" },
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
