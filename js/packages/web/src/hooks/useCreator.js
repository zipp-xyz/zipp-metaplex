"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCreator = void 0;
const contexts_1 = require("../contexts");
const pubkeyToString_1 = require("../utils/pubkeyToString");
const useCreator = (id) => {
    const { whitelistedCreatorsByCreator } = (0, contexts_1.useMeta)();
    const key = (0, pubkeyToString_1.pubkeyToString)(id);
    const creator = Object.values(whitelistedCreatorsByCreator).find(creator => creator.info.address === key);
    return creator;
};
exports.useCreator = useCreator;
//# sourceMappingURL=useCreator.js.map