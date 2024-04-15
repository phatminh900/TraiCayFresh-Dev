import { TRPCError } from "@trpc/server";
import { GENERAL_ERROR_MESSAGE } from "../../constants/constants.constant";

export const throwTrpcInternalServer = (error: unknown) => {
    console.log(error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: GENERAL_ERROR_MESSAGE,
    });
  };
  