import { CollectionConfig } from "payload/types";
import { isAdmins } from "../access/isAdmin";

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true,
    update: isAdmins,
    delete: isAdmins,
    create: isAdmins,
  },
  hooks: {},
  upload: {
    staticURL: "/media",
    staticDir: "media",
    imageSizes: [
      {
        name: "thumbnail",
        width: 400,
        height: 300,
        position: "centre",
      },
      {
        name: "card",
        width: 768,
        height: 1024,
        position: "centre",
      },
      {
        name: "tablet",
        width: 1024,
        height: undefined,
        position: "centre",
      },
    ],
    mimeTypes: ["image/*"],
  },
  fields: [
    {
      name: "alt",
      label: "Alt",
      type: "text",
      required: true,
    },
  ],
};
