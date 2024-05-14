"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringify = exports.formUserAddress = exports.sortArrayById = exports.sortIsDefaultFirst = exports.isEmailUser = exports.validateNumericInput = exports.sliceOrderId = exports.getImgUrlMedia = exports.formatPriceToVND = void 0;
var configs_constant_1 = require("../constants/configs.constant");
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
var sliceOrderId = function (id) {
    return "#".concat(id.slice(-configs_constant_1.ORDER_ID_LENGTH));
};
exports.sliceOrderId = sliceOrderId;
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
var sortArrayById = function (array, currentId) {
    return array.slice().sort(function (a, b) {
        if (a.id === currentId) {
            return -1; // `a` comes first
        }
        else if (b.id === currentId) {
            return 1; // `b` comes first
        }
        else {
            return 0; // Maintain the original order
        }
    });
};
exports.sortArrayById = sortArrayById;
var formUserAddress = function (address) {
    return "".concat(address.street, " , ").concat(address.ward, " , ").concat(address.district);
};
exports.formUserAddress = formUserAddress;
var stringify = function (obj) {
    var replacer = [];
    for (var key in obj) {
        replacer.push(key);
    }
    return JSON.stringify(obj, replacer);
};
exports.stringify = stringify;
