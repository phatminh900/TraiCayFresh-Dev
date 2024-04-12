import { CollectionConfig } from "payload/types";
import { isAdmins } from "../access/isAdmin";
import { anyone } from "../access/anyone";

export const CustomerPhoneNumber: CollectionConfig = {
  slug: "customer-phone-number",
  access: {
    read: anyone,
    update: isAdmins,
    delete: isAdmins,
    create: () => true,
  },
  hooks: {},

  fields: [
    {
      name: "phoneNumber",
      type: "text",
    },
    {
      name: "name",
      label: "Name",
      type: "text",
    },

    {
      name: "address",
      label: "Address",
      type: "array",
      maxRows: 3,
      fields: [
        {
          name: "isDefault",
          label: "Is Default Address",
          type: "checkbox",
        },
        {name:"district",label:"District",type:'text',required:true},
        {name:"ward",label:"Ward",type:'text',required:true},

        {name:"street",label:"Street",type:'text',required:true},
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
