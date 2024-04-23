"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmins = void 0;
var isAdmins = function (_a) {
    var user = _a.req.user;
    // only admins collection have role
    if (!(user === null || user === void 0 ? void 0 : user.role))
        return false;
    return true;
};
exports.isAdmins = isAdmins;
