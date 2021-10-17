"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryExtendedMetadata = void 0;
const common_1 = require("@oyster/common");
const queryExtendedMetadata = async (connection, mintToMeta) => {
    const mintToMetadata = { ...mintToMeta };
    const mints = await (0, common_1.getMultipleAccounts)(connection, [...Object.keys(mintToMetadata)].filter(k => !common_1.cache.get(k)), 'single');
    mints.keys.forEach((key, index) => {
        const mintAccount = mints.array[index];
        if (mintAccount) {
            const mint = common_1.cache.add(key, mintAccount, common_1.MintParser, false);
            if (!mint.info.supply.eqn(1) || mint.info.decimals !== 0) {
                // naive not NFT check
                delete mintToMetadata[key];
            }
            else {
                // const metadata = mintToMetadata[key];
            }
        }
    });
    // await Promise.all([...extendedMetadataFetch.values()]);
    const metadata = [...Object.values(mintToMetadata)];
    return {
        metadata,
        mintToMetadata,
    };
};
exports.queryExtendedMetadata = queryExtendedMetadata;
//# sourceMappingURL=queryExtendedMetadata.js.map