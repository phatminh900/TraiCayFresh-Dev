import { CollectionConfig } from "payload/types";
import { isAdmins } from "../access/isAdmin";
import { isAdminAndCustomer } from "../access/adminsOrLoggedIn";

export const Reviews: CollectionConfig = {
  slug: "reviews",
  access:{
    delete:isAdmins,
    update:isAdmins,
    read:isAdmins,
    create:isAdminAndCustomer
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
      type: "relationship",
      relationTo: "media",
      hasMany: true,
      maxRows: 3,
    },
    {
      name: "product",
      label: "Review's of Product",
      type: "relationship",
      relationTo: "products",
      required: true,
      hasMany:false
    },
    {
      name: "user",
      label: "Review's of User",
      type: "relationship",
      relationTo: ["customers", "customer-phone-number"],
      hasMany:false,
      required: true,
    },
  ],
};
