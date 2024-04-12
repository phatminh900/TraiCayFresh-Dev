import { CollectionConfig } from "payload/types";
import { isAdmins } from "../../access/isAdmin";
import { isAdminAndCustomer } from "../../access/adminsOrLoggedIn";
import { anyone } from "../../access/anyone";
import { Customer } from "../../payload-types";

export const Customers: CollectionConfig = {
  slug: "customers",
  access: {
    read: isAdminAndCustomer,
    update: isAdminAndCustomer,
    create: anyone,
    delete: isAdmins,
  },

  auth: {
    // token expires after 30days
    tokenExpiration: 2592000000,
    maxLoginAttempts: 7,
    lockTime: 600 * 1000,
    forgotPassword: {
      generateEmailHTML: (agrs) => {
        const req = agrs?.req;
        const user = agrs?.user as Customer;
        const token = agrs?.token;
        // Use the token provided to allow your user to reset their password
        const resetPasswordURL = `${process.env.NEXT_PUBLIC_SERVER_URL}/reset-password?token=${token}`;

        return `
          <!doctype html>
          <html>
            <body>
              <h1>Here is my custom email template!</h1>
              <p>Hello, ${user.email}!</p>
              <p>Click below to reset your password.</p>
              <p>
                <a href="${resetPasswordURL}">${resetPasswordURL}</a>
              </p>
            </body>
          </html>
        `;
      },
    },
    verify: {
      generateEmailHTML(token) {
        return `<p>Hi please verify your email ${token}</p>`;
      },
    },
  },
  fields: [
    {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
    },
    {
      name: "phoneNumber",
      label: "Phone Number",
      type: "array",
      maxRows: 3,
      fields: [
        {
          name: "isDefault",
          label: "Is Default Phone Number",
          type: "checkbox",
        },
        {
          name: "phoneNumber",
          label: "Phone Number",
          type: "text",
          required: true,
        },
      ],
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
        { name: "district", label: "District", type: "text", required: true },
        { name: "ward", label: "Ward", type: "text", required: true },

        { name: "street", label: "Street", type: "text", required: true },

        // {
        //   name: "address",
        //   label: "Address",
        //   type: "text",
        //   required: true,
        // },
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
