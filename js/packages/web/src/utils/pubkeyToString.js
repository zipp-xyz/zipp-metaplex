"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pubkeyToString = void 0;
const pubkeyToString = (key = '') => {
    return typeof key === 'string' ? key : (key === null || key === void 0 ? void 0 : key.toBase58()) || '';
};
exports.pubkeyToString = pubkeyToString;
//# sourceMappingURL=pubkeyToString.js.map