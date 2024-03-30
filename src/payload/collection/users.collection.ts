import { CollectionConfig } from "payload/types";

export const Users: CollectionConfig = {
  slug: "users",
    auth:true,
  fields: [
    {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
    },
    { name: "role", label: "Role", type: "text", defaultValue: "user" },
    {
      name: "phoneNumber",
      label: "Phone Number",
      type: "array",
      fields: [
        {
          name: "isDefault",
          label: "Is Default Phone Number",
          type: "checkbox",
        },
        {
          name: "phoneNumber",
          label: "Phone Number",
          type: "number",
          required: true,
        },
      ],
    },
    {
      name: "address",
      label: "Address",
      type: "array",
      fields: [
        {
          name: "isDefault",
          label: "Is Default Address",
          type: "checkbox",
        },
        {
          name: "address",
          label: "Address",
          type: "text",
          required: true,
        },
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
            {
              name: "quantity",
              type: "number",
              min: 0,
              max: 20,
              admin: {
                step: 0.5,
              },
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
