import { CollectionConfig } from "payload/types";

export const Orders: CollectionConfig = {
  slug: "orders",
  fields: [
    {
      name: "orderBy",
      label: "Order By User",
      type: "relationship",
      relationTo: "customers",
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
    { name: "_isPaid", type: "checkbox", defaultValue: false },
    {
      name: "status",
      label: "Order's status",
      type: "select",
      options: [
        { label: "Pending", value: "pending" },
        { label: "Delivering", value: "delivering" },
        { label: "Canceled", value: "canceled" },
        { label: "Confirmed", value: "confirmed" },
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
