"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContext = void 0;
var createContext = function (_a) {
    var req = _a.req, res = _a.res;
    return ({ req: req, res: res });
}; // no context
exports.createContext = createContext;
