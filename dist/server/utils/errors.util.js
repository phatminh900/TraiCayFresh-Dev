"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConflictError = exports.NotFoundError = exports.ForbiddenError = exports.UnAuthorizedError = exports.BadRequestError = void 0;
var AppError = /** @class */ (function (_super) {
    __extends(AppError, _super);
    function AppError(message) {
        var _this = _super.call(this, message) || this;
        _this.message = message;
        _this.isOperationalError = true;
        return _this;
    }
    return AppError;
}(Error));
var BadRequestError = /** @class */ (function (_super) {
    __extends(BadRequestError, _super);
    function BadRequestError() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.statusCode = 400;
        return _this;
    }
    return BadRequestError;
}(AppError));
exports.BadRequestError = BadRequestError;
var UnAuthorizedError = /** @class */ (function (_super) {
    __extends(UnAuthorizedError, _super);
    function UnAuthorizedError() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.statusCode = 401;
        return _this;
    }
    return UnAuthorizedError;
}(AppError));
exports.UnAuthorizedError = UnAuthorizedError;
var ForbiddenError = /** @class */ (function (_super) {
    __extends(ForbiddenError, _super);
    function ForbiddenError() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.statusCode = 403;
        return _this;
    }
    return ForbiddenError;
}(AppError));
exports.ForbiddenError = ForbiddenError;
var NotFoundError = /** @class */ (function (_super) {
    __extends(NotFoundError, _super);
    function NotFoundError() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.statusCode = 404;
        return _this;
    }
    return NotFoundError;
}(AppError));
exports.NotFoundError = NotFoundError;
var ConflictError = /** @class */ (function (_super) {
    __extends(ConflictError, _super);
    function ConflictError() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.statusCode = 409;
        return _this;
    }
    return ConflictError;
}(AppError));
exports.ConflictError = ConflictError;
