"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var server_1 = require("@trpc/server");
var cookie_1 = __importDefault(require("cookie"));
var api_messages_constant_1 = require("../../constants/api-messages.constant");
var configs_constant_1 = require("../../constants/configs.constant");
var get_client_payload_1 = require("../../payload/get-client-payload");
var auth_util_1 = require("../../utils/auth.util");
var trpc_1 = require("../trpc");
var getUserProcedure = trpc_1.publicProcedure.use(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var request, user_1, headerCookie, parsedCookie, token, decodedToken, userId, payload, user;
    var ctx = _b.ctx, next = _b.next;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                request = ctx.req;
                console.log('goinhere');
                console.log(request.user);
                console.log('--end-- user');
                if (request.user) {
                    user_1 = request.user;
                    console.log('user---customer');
                    console.log(user_1);
                    return [2 /*return*/, next({ ctx: { user: user_1 } })];
                }
                headerCookie = ctx.req.headers.cookie;
                parsedCookie = cookie_1.default.parse(headerCookie || "");
                token = parsedCookie[configs_constant_1.COOKIE_USER_PHONE_NUMBER_TOKEN];
                if (!token)
                    throw new server_1.TRPCError({
                        code: "UNAUTHORIZED",
                        message: api_messages_constant_1.AUTH_MESSAGE.EXPIRED,
                    });
                console.log('---token');
                console.log(token);
                return [4 /*yield*/, (0, auth_util_1.verifyToken)(token)];
            case 1:
                decodedToken = _c.sent();
                if (decodedToken.code === auth_util_1.ERROR_JWT_CODE.ERR_JWS_INVALID) {
                    throw new server_1.TRPCError({
                        code: "BAD_REQUEST",
                        message: api_messages_constant_1.AUTH_MESSAGE.INVALID_OTP,
                    });
                }
                if (decodedToken.code === auth_util_1.ERROR_JWT_CODE.ERR_JWT_EXPIRED) {
                    throw new server_1.TRPCError({ code: "BAD_REQUEST", message: api_messages_constant_1.AUTH_MESSAGE.EXPIRED });
                }
                userId = decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.userId;
                return [4 /*yield*/, (0, get_client_payload_1.getPayloadClient)()];
            case 2:
                payload = _c.sent();
                return [4 /*yield*/, payload.findByID({
                        collection: "customer-phone-number",
                        id: userId || "",
                    })];
            case 3:
                user = _c.sent();
                if (!user)
                    throw new server_1.TRPCError({
                        code: "NOT_FOUND",
                        message: api_messages_constant_1.USER_MESSAGE.NOT_FOUND,
                    });
                return [2 /*return*/, next({ ctx: { user: user } })];
        }
    });
}); });
exports.default = getUserProcedure;
