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
exports.MAX_FILE_SIZE = void 0;
var zod_1 = require("zod");
var get_client_payload_1 = require("../../payload/get-client-payload");
var get_user_procedure_1 = __importDefault(require("../middlewares/get-user-procedure"));
var trpc_1 = require("../trpc");
var configs_constant_1 = require("../../constants/configs.constant");
var api_messages_constant_1 = require("../../constants/api-messages.constant");
var error_server_util_1 = require("../../utils/server/error-server.util");
exports.MAX_FILE_SIZE = 1024 * 1024 * 5;
var ACCEPTED_IMAGE_MIME_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
];
var ReviewRouter = (0, trpc_1.router)({
    deleteReviewImg: get_user_procedure_1.default
        .input(zod_1.z.object({ imgId: zod_1.z.string(), reviewId: zod_1.z.string() }))
        .mutation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var imgId, reviewId, payload, review, reviewImgs, filterImgs, error_1;
        var input = _b.input;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    imgId = input.imgId, reviewId = input.reviewId;
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 7, , 8]);
                    return [4 /*yield*/, (0, get_client_payload_1.getPayloadClient)()];
                case 2:
                    payload = _c.sent();
                    return [4 /*yield*/, payload.delete({ collection: "media", id: imgId })];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, payload.findByID({
                            collection: "reviews",
                            id: reviewId,
                            depth: 0,
                        })];
                case 4:
                    review = _c.sent();
                    if (!review) return [3 /*break*/, 6];
                    reviewImgs = review.reviewImgs;
                    filterImgs = reviewImgs === null || reviewImgs === void 0 ? void 0 : reviewImgs.filter(function (img) { return img.reviewImg !== imgId; });
                    return [4 /*yield*/, payload.update({
                            collection: "reviews",
                            id: reviewId,
                            data: { reviewImgs: filterImgs },
                        })];
                case 5:
                    _c.sent();
                    _c.label = 6;
                case 6: return [3 /*break*/, 8];
                case 7:
                    error_1 = _c.sent();
                    (0, error_server_util_1.throwTrpcInternalServer)(error_1);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    }); }),
    deleteReview: get_user_procedure_1.default
        .input(zod_1.z.object({ reviewId: zod_1.z.string() }))
        .mutation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var reviewId, payload, error_2;
        var input = _b.input;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    reviewId = input.reviewId;
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, (0, get_client_payload_1.getPayloadClient)()];
                case 2:
                    payload = _c.sent();
                    return [4 /*yield*/, payload.delete({ collection: "reviews", id: reviewId })];
                case 3:
                    _c.sent();
                    return [2 /*return*/, { success: true, message: api_messages_constant_1.REVIEW_MESSAGE.DELETE_SUCCESSFULLY }];
                case 4:
                    error_2 = _c.sent();
                    (0, error_server_util_1.throwTrpcInternalServer)(error_2);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); }),
    getProductReviews: trpc_1.publicProcedure
        .input(zod_1.z.object({ page: zod_1.z.number(), productId: zod_1.z.string() }))
        .query(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var productId, page, payload, result, limit, reviews, totalPages, totalDocs, hasNextPage, pagingCounter, error_3;
        var input = _b.input;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    productId = input.productId, page = input.page;
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, (0, get_client_payload_1.getPayloadClient)()];
                case 2:
                    payload = _c.sent();
                    return [4 /*yield*/, payload.find({
                            collection: "reviews",
                            depth: 1,
                            page: page,
                            where: {
                                product: {
                                    equals: productId,
                                },
                            },
                            limit: configs_constant_1.PRODUCT_REVIEWS_SHOW_LIMIT,
                        })];
                case 3:
                    result = _c.sent();
                    limit = result.limit, reviews = result.docs, totalPages = result.totalPages, totalDocs = result.totalDocs, hasNextPage = result.hasNextPage, pagingCounter = result.pagingCounter;
                    return [2 /*return*/, { success: true, productReviews: reviews, totalPages: totalPages, totalDocs: totalDocs, hasNextPage: hasNextPage, pagingCounter: pagingCounter }];
                case 4:
                    error_3 = _c.sent();
                    (0, error_server_util_1.throwTrpcInternalServer)(error_3);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); }),
});
exports.default = ReviewRouter;
