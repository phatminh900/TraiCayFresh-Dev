"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var catchAsync = function (fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(next);
    };
};
exports.default = catchAsync;
