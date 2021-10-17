"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCreators = void 0;
const react_1 = require("react");
const contexts_1 = require("../contexts");
const useCreators = (auction) => {
    const { whitelistedCreatorsByCreator } = (0, contexts_1.useMeta)();
    const creators = (0, react_1.useMemo)(() => {
        var _a;
        return [
            ...([
                ...((auction === null || auction === void 0 ? void 0 : auction.items) || []).flat().map(item => item === null || item === void 0 ? void 0 : item.metadata),
                (_a = auction === null || auction === void 0 ? void 0 : auction.participationItem) === null || _a === void 0 ? void 0 : _a.metadata,
            ]
                .filter(item => item && item.info)
                .map(item => (item === null || item === void 0 ? void 0 : item.info.data.creators) || [])
                .flat() || [])
                .filter(creator => creator.verified)
                .reduce((agg, item) => {
                agg.add(item.address);
                return agg;
            }, new Set())
                .values(),
        ].map((creator, index, arr) => {
            const knownCreator = whitelistedCreatorsByCreator[creator];
            return {
                address: creator,
                verified: true,
                // not exact share of royalties
                share: (1 / arr.length) * 100,
                image: (knownCreator === null || knownCreator === void 0 ? void 0 : knownCreator.info.image) || '',
                name: (knownCreator === null || knownCreator === void 0 ? void 0 : knownCreator.info.name) || '',
                link: (knownCreator === null || knownCreator === void 0 ? void 0 : knownCreator.info.twitter) || '',
            };
        });
    }, [auction, whitelistedCreatorsByCreator]);
    return creators;
};
exports.useCreators = useCreators;
//# sourceMappingURL=useCreators.js.map