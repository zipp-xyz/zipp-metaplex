"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCreatorArts = void 0;
const contexts_1 = require("../contexts");
const useCreatorArts = (id) => {
    const { metadata } = (0, contexts_1.useMeta)();
    const filtered = metadata.filter(m => { var _a; return (_a = m.info.data.creators) === null || _a === void 0 ? void 0 : _a.some(c => c.address === id); });
    return filtered;
};
exports.useCreatorArts = useCreatorArts;
//# sourceMappingURL=useCreatorArts.js.map