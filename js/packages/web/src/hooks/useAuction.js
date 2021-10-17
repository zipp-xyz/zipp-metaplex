"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuction = void 0;
const wallet_adapter_react_1 = require("@solana/wallet-adapter-react");
const react_1 = require("react");
const _1 = require(".");
const contexts_1 = require("../contexts");
const useAuction = (id) => {
    const { publicKey } = (0, wallet_adapter_react_1.useWallet)();
    const cachedRedemptionKeys = (0, _1.useCachedRedemptionKeysByWallet)();
    const [existingAuctionView, setAuctionView] = (0, react_1.useState)(undefined);
    const walletPubkey = publicKey === null || publicKey === void 0 ? void 0 : publicKey.toBase58();
    const { auctions, auctionManagersByAuction, safetyDepositBoxesByVaultAndIndex, metadataByMint, bidderMetadataByAuctionAndBidder, bidderPotsByAuctionAndBidder, masterEditions, vaults, safetyDepositConfigsByAuctionManagerAndIndex, masterEditionsByOneTimeAuthMint, masterEditionsByPrintingMint, metadataByMasterEdition, bidRedemptionV2sByAuctionManagerAndWinningIndex, } = (0, contexts_1.useMeta)();
    (0, react_1.useEffect)(() => {
        const auction = auctions[id];
        if (auction) {
            const auctionView = (0, _1.processAccountsIntoAuctionView)(walletPubkey, auction, auctionManagersByAuction, safetyDepositBoxesByVaultAndIndex, metadataByMint, bidderMetadataByAuctionAndBidder, bidderPotsByAuctionAndBidder, bidRedemptionV2sByAuctionManagerAndWinningIndex, masterEditions, vaults, safetyDepositConfigsByAuctionManagerAndIndex, masterEditionsByPrintingMint, masterEditionsByOneTimeAuthMint, metadataByMasterEdition, cachedRedemptionKeys, undefined, existingAuctionView || undefined);
            if (auctionView)
                setAuctionView(auctionView);
        }
    }, [
        auctions,
        walletPubkey,
        auctionManagersByAuction,
        safetyDepositBoxesByVaultAndIndex,
        metadataByMint,
        bidderMetadataByAuctionAndBidder,
        bidderPotsByAuctionAndBidder,
        bidRedemptionV2sByAuctionManagerAndWinningIndex,
        vaults,
        safetyDepositConfigsByAuctionManagerAndIndex,
        masterEditions,
        masterEditionsByPrintingMint,
        masterEditionsByOneTimeAuthMint,
        metadataByMasterEdition,
        cachedRedemptionKeys,
    ]);
    return existingAuctionView;
};
exports.useAuction = useAuction;
//# sourceMappingURL=useAuction.js.map