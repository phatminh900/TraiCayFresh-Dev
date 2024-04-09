import { z } from "zod";
import { getPayloadClient } from "../../payload/get-client-payload";
import { publicProcedure, router } from "../trpc";

export const ProductRouter = router({
  getProductsPrice: publicProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .query(async ({ input }) => {
      const payload = await getPayloadClient();
      const { ids } = input;
      const { docs: products } = await payload.find({
        collection: "products",
        where: {
          id: { in: ids },
        },

      });
      return products;
    }),
  getProducts: publicProcedure.query(async () => {
    const payload = await getPayloadClient();
    const { docs: products } = await payload.find({ collection: "products" });
    return { products };
  }),
});
