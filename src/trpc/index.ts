import { publicProcedure, router } from "./trpc";
import AuthRouter from "./router/auth.router";
import UserRouter from "./router/user.router";
// import { productRouter } from "./routes/product-router";
// import { PaymentRouter } from "./routes/payment-router";

export const appRouter = router({
  auth: AuthRouter,
  user:UserRouter
//   products: productRouter,
//   payment:PaymentRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
