"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formUserAddress = exports.sortIsDefaultFirst = exports.isEmailUser = exports.validateNumericInput = exports.getImgUrlMedia = exports.formatPriceToVND = void 0;
function formatPriceToVND(price) {
    var formatter = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    });
    return formatter.format(price);
}
exports.formatPriceToVND = formatPriceToVND;
var getImgUrlMedia = function (img) {
    return typeof img === "string" ? img : img.url;
};
exports.getImgUrlMedia = getImgUrlMedia;
var validateNumericInput = function (value) {
    // Regular expression to match only numeric characters
    var numericRegex = /^[0-9]*$/;
    return numericRegex.test(value);
};
exports.validateNumericInput = validateNumericInput;
var isEmailUser = function (user) {
    if ("email" in user)
        return true;
    return false;
};
exports.isEmailUser = isEmailUser;
var sortIsDefaultFirst = function (value) {
    if (Array.isArray(value))
        return value === null || value === void 0 ? void 0 : value.slice().sort(function (a, b) {
            var _a, _b;
            var isADefault = (_a = a.isDefault) !== null && _a !== void 0 ? _a : false; // If isDefault is undefined, consider it false
            var isBDefault = (_b = b.isDefault) !== null && _b !== void 0 ? _b : false; // If isDefault is undefined, consider it false
            if (isADefault && !isBDefault) {
                return -1;
            }
            else if (!isADefault && isBDefault) {
                return 1;
            }
            else {
                return 0;
            }
        });
};
exports.sortIsDefaultFirst = sortIsDefaultFirst;
var formUserAddress = function (address) {
    return "".concat(address.street, " , ").concat(address.ward, " , ").concat(address.district);
};
exports.formUserAddress = formUserAddress;
