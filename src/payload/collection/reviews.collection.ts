import { CollectionConfig } from "payload/types";

export const Reviews: CollectionConfig = {
  slug: "reviews",
  fields: [
    {
      name: "text",
      label: "Review",
      type: "text",
      minLength: 1,
      required: true,
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
      maxRows: 2,
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
      relationTo: "customers",
      hasMany:false,
      required: true,
    },
  ],
};
