import { initTRPC, TRPCError } from "@trpc/server";
import { Context } from "./context";
import { PayloadRequest } from "payload/types";
import { Customer } from "../payload/payload-types";

const t = initTRPC.context<Context>().create();

// Base router and procedure helpers
const middleware = t.middleware;
const authMiddleWare = middleware(async ({ ctx, next }) => {
  const req = ctx.req as PayloadRequest;
  const user = req.user as Customer | null;
  if (!user) {
    throw new TRPCError({ code: "UNAUTHORIZED",message:"Vui lòng đăng nhập" });
  }
  return next({
    ctx: {
      user,
    },
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(authMiddleWare);
