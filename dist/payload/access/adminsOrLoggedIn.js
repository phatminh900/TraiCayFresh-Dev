"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdminAndCustomer = void 0;
var isAdminAndCustomer = function (_a) {
    var req = _a.req;
    var user = req.user;
    if (!user)
        return false;
    if ((user === null || user === void 0 ? void 0 : user.role) || user.role === "admin")
        return true;
    return {
        id: {
            equals: user.id,
        },
    };
};
exports.isAdminAndCustomer = isAdminAndCustomer;
