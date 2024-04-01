import { GENERAL_ERROR_MESSAGE } from "@/constants/constants.constant";
import type { TRPCClientErrorLike } from "@trpc/client";
import { AnyTRPCClientTypes } from "@trpc/server";
import { toast } from "sonner";
import { ZodError } from "zod";

export const handleTrpcErrors = (
  error: TRPCClientErrorLike<AnyTRPCClientTypes>
) => {
  if (
    error.data?.code === "CONFLICT" ||
    error.data?.code === "BAD_REQUEST" ||
    error.data?.code === "NOT_FOUND"
  ) {
    toast.error(error.message);
console.log(error.message)
    return;
  }
  if (error instanceof ZodError) {
    toast.error(error.issues[0].message);
    return;
  }
  if (error.message) {
    toast.error(error.message);
    return;
  }

  toast.error(GENERAL_ERROR_MESSAGE);
};
