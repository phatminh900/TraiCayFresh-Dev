"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var dotenv_1 = __importDefault(require("dotenv"));
var next_1 = __importDefault(require("next"));
var trpcExpress = __importStar(require("@trpc/server/adapters/express"));
var build_1 = __importDefault(require("next/dist/build"));
var path_1 = __importDefault(require("path"));
dotenv_1.default.config({
    path: path_1.default.resolve(__dirname, "../../.env"),
});
var express_1 = __importDefault(require("express"));
var payload_1 = __importDefault(require("payload"));
var trpc_1 = require("../trpc");
var context_1 = require("../trpc/context");
var vn_pay_router_1 = __importDefault(require("./routers/vn-pay.router"));
var refresh_token_router_1 = __importDefault(require("./routers/refresh-token.router"));
var app = (0, express_1.default)();
var PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
var start = function () { return __awaiter(void 0, void 0, void 0, function () {
    var nextApp, nextHandler;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, payload_1.default.init({
                    secret: process.env.PAYLOAD_SECRET || "",
                    express: app,
                    onInit: function () {
                        payload_1.default.logger.info("Payload Admin URL: ".concat(payload_1.default.getAdminURL()));
                    },
                })];
            case 1:
                _a.sent();
                if (process.env.NEXT_BUILD) {
                    app.listen(PORT, function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    payload_1.default.logger.info("Next.js is now building...");
                                    // @ts-expect-error
                                    return [4 /*yield*/, (0, build_1.default)(path_1.default.join(__dirname, "../"))];
                                case 1:
                                    // @ts-expect-error
                                    _a.sent();
                                    process.exit();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [2 /*return*/];
                }
                nextApp = (0, next_1.default)({
                    dev: process.env.NODE_ENV !== "production",
                });
                nextHandler = nextApp.getRequestHandler();
                // const limiter = rateLimit({
                //   windowMs:  30 * 1000, // 15 minutes
                //   max: 3, // limit each IP to 100 requests per window
                //   handler:(req,res)=>{
                //     res.status(429).json({
                //       message:"Too many requests try again later"
                //     })
                //   }
                // });
                // limit the rate limit for applying coupon
                // TODO: add auth for refresh token
                app.use("/api", refresh_token_router_1.default);
                app.use("/verify-momo-payment-success", function (req, res) {
                    var transactionInfo = req.body;
                    console.log("--------");
                    console.log(transactionInfo);
                    // TODO: Xác minh thông tin giao dịch tại đây
                    // Phản hồi Momo với status code 200
                    res.sendStatus(200);
                });
                // TODO: helmet xss
                app.use(vn_pay_router_1.default);
                app.use("/api/trpc", trpcExpress.createExpressMiddleware({
                    router: trpc_1.appRouter,
                    createContext: context_1.createContext,
                }));
                app.use(function (req, res) { return nextHandler(req, res); });
                // app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
                //   return res.status(500).json({
                //     status: "fail",
                //     message: GENERAL_ERROR_MESSAGE,
                //   });
                // });
                nextApp.prepare().then(function () {
                    payload_1.default.logger.info("Starting Next.js...");
                    app.listen(PORT, function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            payload_1.default.logger.info("Next.js App URL: ".concat(process.env.NEXT_PUBLIC_SERVER_URL));
                            return [2 /*return*/];
                        });
                    }); });
                });
                return [2 /*return*/];
        }
    });
}); };
start();