"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throwTrpcInternalServer = void 0;
var server_1 = require("@trpc/server");
var app_message_constant_1 = require("../../constants/app-message.constant");
var throwTrpcInternalServer = function (error) {
    console.log(error);
    throw new server_1.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: app_message_constant_1.GENERAL_ERROR_MESSAGE,
    });
};
exports.throwTrpcInternalServer = throwTrpcInternalServer;
