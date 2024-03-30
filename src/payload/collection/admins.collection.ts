import { CollectionConfig } from "payload/types";

export const Admins: CollectionConfig = {
  slug: "admin",
  auth:true,
  fields: [
    {
      name: "name",
      label:"Name",
      type: "text",
      required: true,
    },
    { name: "role", label: "Role", type: "text", defaultValue: "admin" },
  ],
};
