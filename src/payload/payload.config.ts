import { webpackBundler } from "@payloadcms/bundler-webpack";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
// import nestedDocs from '@payloadcms/plugin-nested-docs'
// import redirects from '@payloadcms/plugin-redirects'
// import seo from '@payloadcms/plugin-seo'
// import type { GenerateTitle } from '@payloadcms/plugin-seo/types'
import { slateEditor } from "@payloadcms/richtext-slate";
import dotenv from "dotenv";
import path from "path";
import { buildConfig } from "payload/config";
import { Admins } from "./collection/admins.collection";
import { Users } from "./collection/users.collection";
import { Products } from "./collection/products.collection";
import { Media } from "./collection/media.collection";

const mockModulePath = path.resolve(__dirname, "./emptyModuleMock.js");

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

export default buildConfig({
  admin: {
    user: Admins.slug,
    bundler: webpackBundler(),
    meta: {
      titleSuffix: "- TraiCayFresh",
      favicon: "/favicon.ico",
      ogImage: "/thumbnail.jpg",
    },
    webpack: (config) => {
      return {
        ...config,
        resolve: {
          ...config.resolve,
          alias: {
            ...config.resolve?.alias,
            dotenv: path.resolve(__dirname, "./dotenv.js"),
            [path.resolve(
              __dirname,
              "collections/Products/hooks/beforeChange"
            )]: mockModulePath,
            [path.resolve(
              __dirname,
              "collections/Users/hooks/createStripeCustomer"
            )]: mockModulePath,
            [path.resolve(__dirname, "collections/Users/endpoints/customer")]:
              mockModulePath,
            [path.resolve(__dirname, "endpoints/create-payment-intent")]:
              mockModulePath,
            [path.resolve(__dirname, "endpoints/customers")]: mockModulePath,
            [path.resolve(__dirname, "endpoints/products")]: mockModulePath,
            [path.resolve(__dirname, "endpoints/seed")]: mockModulePath,
            stripe: mockModulePath,
            express: mockModulePath,
          },
        },
      };
    },
  },
  rateLimit: {
    max: 3000,
  },
  editor: slateEditor({}),
  db: mongooseAdapter({
    url: process.env.DATABASE_URI!,
  }),
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL,
  collections: [Admins, Users, Products, Media],
  typescript: {
    outputFile: path.resolve(__dirname, "payload-types.ts"),
  },

  plugins: [],
});
