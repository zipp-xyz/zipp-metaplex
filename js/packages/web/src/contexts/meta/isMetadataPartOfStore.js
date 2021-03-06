"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMetadataPartOfStore = void 0;
const isMetadataPartOfStore = (m, store, whitelistedCreatorsByCreator, useAll) => {
    var _a, _b;
    if (useAll) {
        return true;
    }
    if (!((_b = (_a = m === null || m === void 0 ? void 0 : m.info) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.creators) || !(store === null || store === void 0 ? void 0 : store.info)) {
        return false;
    }
    return m.info.data.creators.some(c => {
        var _a, _b;
        return c.verified &&
            (store.info.public ||
                ((_b = (_a = whitelistedCreatorsByCreator[c.address]) === null || _a === void 0 ? void 0 : _a.info) === null || _b === void 0 ? void 0 : _b.activated));
    });
};
exports.isMetadataPartOfStore = isMetadataPartOfStore;
//# sourceMappingURL=isMetadataPartOfStore.js.map