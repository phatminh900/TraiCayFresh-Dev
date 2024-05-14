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
var crypto_1 = __importDefault(require("crypto"));
var path_1 = __importDefault(require("path"));
var express_1 = __importDefault(require("express"));
var dotenv_1 = __importDefault(require("dotenv"));
var qs_1 = __importDefault(require("qs"));
var get_client_payload_1 = require("../../payload/get-client-payload");
var app_message_constant_1 = require("../../constants/app-message.constant");
var router = express_1.default.Router();
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../../../.env") });
router.get("/vnpay_return", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var vnp_Params, secureHash, orderIdResponse, amount, orderId, tmnCode, secretKey, signData, hmac, signed;
    return __generator(this, function (_a) {
        vnp_Params = req.query;
        secureHash = vnp_Params["vnp_SecureHash"];
        orderIdResponse = vnp_Params["vnp_TxnRef"];
        amount = vnp_Params["vnp_Amount"];
        orderId = orderIdResponse && typeof orderIdResponse === "string"
            ? orderIdResponse
            : "";
        delete vnp_Params["vnp_SecureHash"];
        delete vnp_Params["vnp_SecureHashType"];
        vnp_Params = sortObject(vnp_Params);
        tmnCode = process.env.VN_PAY_TMN_CODE;
        secretKey = process.env.VN_PAY_SECRET_KEY;
        console.log("------------ vnp Params");
        console.log(vnp_Params);
        signData = qs_1.default.stringify(vnp_Params, { encode: false });
        hmac = crypto_1.default.createHmac("sha512", secretKey);
        signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
        if (secureHash === signed) {
            res.render("success", { code: vnp_Params["vnp_ResponseCode"] });
        }
        else {
            res.render("success", { code: "97" });
        }
        return [2 /*return*/];
    });
}); });
router.get("/vnpay_ipn", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var vnp_Params, secureHash, orderIdResponse, rspCode, amount, orderId, tmnCode, secretKey, signData, hmac, signed, paymentStatus, payload, order, checkOrderId, checkAmount, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 15, , 16]);
                vnp_Params = req.query;
                secureHash = vnp_Params["vnp_SecureHash"];
                orderIdResponse = vnp_Params["vnp_TxnRef"];
                rspCode = vnp_Params["vnp_ResponseCode"];
                amount = vnp_Params["vnp_Amount"];
                delete vnp_Params["vnp_SecureHash"];
                delete vnp_Params["vnp_SecureHashType"];
                vnp_Params = sortObject(vnp_Params);
                orderId = orderIdResponse && typeof orderIdResponse === "string"
                    ? orderIdResponse
                    : "";
                tmnCode = process.env.VN_PAY_TMN_CODE;
                secretKey = process.env.VN_PAY_SECRET_KEY;
                console.log("000---");
                console.log("ipn url");
                signData = qs_1.default.stringify(vnp_Params, { encode: false });
                hmac = crypto_1.default.createHmac("sha512", secretKey);
                signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
                paymentStatus = "0";
                return [4 /*yield*/, (0, get_client_payload_1.getPayloadClient)()];
            case 1:
                payload = _a.sent();
                return [4 /*yield*/, payload.findByID({
                        collection: "orders",
                        id: orderId,
                    })];
            case 2:
                order = _a.sent();
                checkOrderId = Boolean(order);
                checkAmount = order
                    ? (order.totalAfterCoupon || order.total) / 100 ===
                        (amount && (typeof amount === "string" || typeof amount === "number")
                            ? +amount
                            : 0)
                    : false;
                if (!(secureHash === signed)) return [3 /*break*/, 13];
                if (!checkOrderId) return [3 /*break*/, 11];
                if (!checkAmount) return [3 /*break*/, 9];
                if (!(paymentStatus == "0")) return [3 /*break*/, 7];
                if (!(rspCode == "00")) return [3 /*break*/, 4];
                //thanh cong
                //paymentStatus = '1'
                // Ở đây cập nhật trạng thái giao dịch thanh toán thành công vào CSDL của bạn
                return [4 /*yield*/, payload.update({
                        collection: "orders",
                        data: { _isPaid: true, status: "confirmed" },
                        id: orderId,
                    })];
            case 3:
                //thanh cong
                //paymentStatus = '1'
                // Ở đây cập nhật trạng thái giao dịch thanh toán thành công vào CSDL của bạn
                _a.sent();
                res.status(200).json({ RspCode: "00", Message: "Success" });
                return [3 /*break*/, 6];
            case 4: 
            //that bai
            //paymentStatus = '2'
            // Ở đây cập nhật trạng thái giao dịch thanh toán thất bại vào CSDL của bạn
            return [4 /*yield*/, payload.update({
                    collection: "orders",
                    data: { _isPaid: false, status: "failed" },
                    id: orderId,
                })];
            case 5:
                //that bai
                //paymentStatus = '2'
                // Ở đây cập nhật trạng thái giao dịch thanh toán thất bại vào CSDL của bạn
                _a.sent();
                res.status(200).json({ RspCode: "00", Message: "Success" });
                _a.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                res.status(200).json({
                    RspCode: "02",
                    Message: "This order has been updated to the payment status",
                });
                _a.label = 8;
            case 8: return [3 /*break*/, 10];
            case 9:
                res.status(200).json({ RspCode: "04", Message: "Amount invalid" });
                _a.label = 10;
            case 10: return [3 /*break*/, 12];
            case 11:
                res.status(200).json({ RspCode: "01", Message: "Order not found" });
                _a.label = 12;
            case 12: return [3 /*break*/, 14];
            case 13:
                res.status(200).json({ RspCode: "97", Message: "Checksum failed" });
                _a.label = 14;
            case 14: return [3 /*break*/, 16];
            case 15:
                error_1 = _a.sent();
                console.log(error_1);
                throw new Error(app_message_constant_1.GENERAL_ERROR_MESSAGE);
            case 16: return [2 /*return*/];
        }
    });
}); });
function sortObject(obj) {
    var sorted = {};
    var str = [];
    var key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        // @ts-ignore
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}
exports.default = router;
