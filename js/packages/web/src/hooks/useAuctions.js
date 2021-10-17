"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processAccountsIntoAuctionView = exports.useAuctions = exports.useCachedRedemptionKeysByWallet = exports.AuctionViewState = void 0;
const common_1 = require("@oyster/common");
const wallet_adapter_react_1 = require("@solana/wallet-adapter-react");
const bn_js_1 = __importDefault(require("bn.js"));
const react_1 = require("react");
const contexts_1 = require("../contexts");
const metaplex_1 = require("../models/metaplex");
var AuctionViewState;
(function (AuctionViewState) {
    AuctionViewState["Live"] = "0";
    AuctionViewState["Upcoming"] = "1";
    AuctionViewState["Ended"] = "2";
    AuctionViewState["BuyNow"] = "3";
    AuctionViewState["Defective"] = "-1";
})(AuctionViewState = exports.AuctionViewState || (exports.AuctionViewState = {}));
function useCachedRedemptionKeysByWallet() {
    const { auctions, bidRedemptions } = (0, contexts_1.useMeta)();
    const { publicKey } = (0, wallet_adapter_react_1.useWallet)();
    const [cachedRedemptionKeys, setCachedRedemptionKeys] = (0, react_1.useState)({});
    (0, react_1.useEffect)(() => {
        (async () => {
            if (publicKey) {
                const temp = {};
                const keys = Object.keys(auctions);
                const tasks = [];
                for (let i = 0; i < keys.length; i++) {
                    const a = keys[i];
                    if (!cachedRedemptionKeys[a])
                        tasks.push((0, metaplex_1.getBidderKeys)(auctions[a].pubkey, publicKey.toBase58()).then(key => {
                            temp[a] = bidRedemptions[key.bidRedemption]
                                ? bidRedemptions[key.bidRedemption]
                                : { pubkey: key.bidRedemption, info: null };
                        }));
                    else if (!cachedRedemptionKeys[a].info) {
                        temp[a] =
                            bidRedemptions[cachedRedemptionKeys[a].pubkey] ||
                                cachedRedemptionKeys[a];
                    }
                }
                await Promise.all(tasks);
                setCachedRedemptionKeys(temp);
            }
        })();
    }, [auctions, bidRedemptions, publicKey]);
    return cachedRedemptionKeys;
}
exports.useCachedRedemptionKeysByWallet = useCachedRedemptionKeysByWallet;
const useAuctions = (state) => {
    const [auctionViews, setAuctionViews] = (0, react_1.useState)([]);
    const { publicKey } = (0, wallet_adapter_react_1.useWallet)();
    const cachedRedemptionKeys = useCachedRedemptionKeysByWallet();
    const { auctions, auctionManagersByAuction, safetyDepositBoxesByVaultAndIndex, metadataByMint, bidderMetadataByAuctionAndBidder, bidderPotsByAuctionAndBidder, vaults, masterEditions, masterEditionsByPrintingMint, masterEditionsByOneTimeAuthMint, metadataByMasterEdition, safetyDepositConfigsByAuctionManagerAndIndex, bidRedemptionV2sByAuctionManagerAndWinningIndex, } = (0, contexts_1.useMeta)();
    (0, react_1.useEffect)(() => {
        const map = Object.keys(auctions).reduce((agg, a) => {
            const auction = auctions[a];
            const nextAuctionView = processAccountsIntoAuctionView(publicKey === null || publicKey === void 0 ? void 0 : publicKey.toBase58(), auction, auctionManagersByAuction, safetyDepositBoxesByVaultAndIndex, metadataByMint, bidderMetadataByAuctionAndBidder, bidderPotsByAuctionAndBidder, bidRedemptionV2sByAuctionManagerAndWinningIndex, masterEditions, vaults, safetyDepositConfigsByAuctionManagerAndIndex, masterEditionsByPrintingMint, masterEditionsByOneTimeAuthMint, metadataByMasterEdition, cachedRedemptionKeys, state);
            agg[a] = nextAuctionView;
            return agg;
        }, {});
        setAuctionViews(Object.values(map).filter(v => v).sort((a, b) => {
            var _a;
            return (((_a = b === null || b === void 0 ? void 0 : b.auction.info.endedAt) === null || _a === void 0 ? void 0 : _a.sub((a === null || a === void 0 ? void 0 : a.auction.info.endedAt) || new bn_js_1.default(0)).toNumber()) || 0);
        }));
    }, [
        state,
        auctions,
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
        publicKey,
        cachedRedemptionKeys,
        setAuctionViews,
    ]);
    return auctionViews;
};
exports.useAuctions = useAuctions;
function buildListWhileNonZero(hash, key) {
    const list = [];
    let ticket = hash[key + '-0'];
    if (ticket) {
        list.push(ticket);
        let i = 1;
        while (ticket) {
            ticket = hash[key + '-' + i.toString()];
            if (ticket)
                list.push(ticket);
            i++;
        }
    }
    return list;
}
function processAccountsIntoAuctionView(walletPubkey, auction, auctionManagersByAuction, safetyDepositBoxesByVaultAndIndex, metadataByMint, bidderMetadataByAuctionAndBidder, bidderPotsByAuctionAndBidder, bidRedemptionV2sByAuctionManagerAndWinningIndex, masterEditions, vaults, safetyDepositConfigsByAuctionManagerAndIndex, masterEditionsByPrintingMint, masterEditionsByOneTimeAuthMint, metadataByMasterEdition, cachedRedemptionKeysByWallet, desiredState, existingAuctionView) {
    var _a, _b, _c;
    let state;
    if (auction.info.ended()) {
        state = AuctionViewState.Ended;
    }
    else if (auction.info.state === common_1.AuctionState.Started) {
        state = AuctionViewState.Live;
    }
    else if (auction.info.state === common_1.AuctionState.Created) {
        state = AuctionViewState.Upcoming;
    }
    else {
        state = AuctionViewState.BuyNow;
    }
    const auctionManagerInstance = auctionManagersByAuction[auction.pubkey || ''];
    // The defective auction view state really applies to auction managers, not auctions, so we ignore it here
    if (desiredState &&
        desiredState !== AuctionViewState.Defective &&
        desiredState !== state)
        return undefined;
    if (auctionManagerInstance) {
        // instead we apply defective state to auction managers
        if (desiredState === AuctionViewState.Defective &&
            auctionManagerInstance.info.state.status !==
                metaplex_1.AuctionManagerStatus.Initialized)
            return undefined;
        // Generally the only way an initialized auction manager can get through is if you are asking for defective ones.
        else if (desiredState !== AuctionViewState.Defective &&
            auctionManagerInstance.info.state.status ===
                metaplex_1.AuctionManagerStatus.Initialized)
            return undefined;
        const vault = vaults[auctionManagerInstance.info.vault];
        const auctionManagerKey = auctionManagerInstance.pubkey;
        let safetyDepositConfigs = buildListWhileNonZero(safetyDepositConfigsByAuctionManagerAndIndex, auctionManagerKey);
        let bidRedemptions = buildListWhileNonZero(bidRedemptionV2sByAuctionManagerAndWinningIndex, auctionManagerKey);
        const auctionManager = new metaplex_1.AuctionManager({
            instance: auctionManagerInstance,
            auction,
            vault,
            safetyDepositConfigs,
            bidRedemptions,
        });
        const boxesExpected = auctionManager.safetyDepositBoxesExpected.toNumber();
        let bidRedemption = ((_a = cachedRedemptionKeysByWallet[auction.pubkey]) === null || _a === void 0 ? void 0 : _a.info)
            ? cachedRedemptionKeysByWallet[auction.pubkey]
            : undefined;
        const bidderMetadata = bidderMetadataByAuctionAndBidder[auction.pubkey + '-' + walletPubkey];
        const bidderPot = bidderPotsByAuctionAndBidder[auction.pubkey + '-' + walletPubkey];
        if (existingAuctionView && existingAuctionView.totallyComplete) {
            // If totally complete, we know we arent updating anythign else, let's speed things up
            // and only update the two things that could possibly change
            existingAuctionView.myBidderPot = bidderPot;
            existingAuctionView.myBidderMetadata = bidderMetadata;
            existingAuctionView.myBidRedemption = bidRedemption;
            for (let i = 0; i < existingAuctionView.items.length; i++) {
                const winningSet = existingAuctionView.items[i];
                for (let j = 0; j < winningSet.length; j++) {
                    const curr = winningSet[j];
                    if (!curr.metadata) {
                        let foundMetadata = metadataByMint[curr.safetyDeposit.info.tokenMint];
                        if (!foundMetadata) {
                            // Means is a limited edition, so the tokenMint is the printingMint
                            let masterEdition = masterEditionsByPrintingMint[curr.safetyDeposit.info.tokenMint];
                            if (masterEdition) {
                                foundMetadata = metadataByMasterEdition[masterEdition.pubkey];
                            }
                        }
                        curr.metadata = foundMetadata;
                    }
                    if (curr.metadata &&
                        !curr.masterEdition &&
                        curr.metadata.info.masterEdition) {
                        let foundMaster = masterEditions[curr.metadata.info.masterEdition];
                        curr.masterEdition = foundMaster;
                    }
                }
            }
            return existingAuctionView;
        }
        const vaultKey = auctionManager.vault;
        let boxes = buildListWhileNonZero(safetyDepositBoxesByVaultAndIndex, vaultKey);
        if (boxes.length > 0) {
            let participationMetadata = undefined;
            let participationBox = undefined;
            let participationMaster = undefined;
            if (auctionManager.participationConfig !== null &&
                auctionManager.participationConfig !== undefined) {
                participationBox =
                    boxes[(_b = auctionManager.participationConfig) === null || _b === void 0 ? void 0 : _b.safetyDepositBoxIndex];
                // Cover case of V1 master edition (where we're using one time auth mint in storage)
                // and case of v2 master edition where the edition itself is stored
                participationMetadata =
                    metadataByMasterEdition[(_c = masterEditionsByOneTimeAuthMint[participationBox.info.tokenMint]) === null || _c === void 0 ? void 0 : _c.pubkey] || metadataByMint[participationBox.info.tokenMint];
                if (participationMetadata) {
                    participationMaster =
                        masterEditionsByOneTimeAuthMint[participationBox.info.tokenMint] ||
                            (participationMetadata.info.masterEdition &&
                                masterEditions[participationMetadata.info.masterEdition]);
                }
            }
            let view = {
                auction,
                auctionManager,
                state,
                vault,
                safetyDepositBoxes: boxes,
                items: auctionManager.getItemsFromSafetyDepositBoxes(metadataByMint, masterEditionsByPrintingMint, metadataByMasterEdition, masterEditions, boxes),
                participationItem: participationMetadata && participationBox
                    ? {
                        metadata: participationMetadata,
                        safetyDeposit: participationBox,
                        masterEdition: participationMaster,
                        amount: new bn_js_1.default(1),
                        winningConfigType: metaplex_1.WinningConfigType.Participation,
                    }
                    : undefined,
                myBidderMetadata: bidderMetadata,
                myBidderPot: bidderPot,
                myBidRedemption: bidRedemption,
            };
            view.thumbnail =
                ((view.items || [])[0] || [])[0] || view.participationItem;
            view.totallyComplete = !!(view.thumbnail &&
                boxesExpected ===
                    (view.items || []).length +
                        (auctionManager.participationConfig === null ||
                            auctionManager.participationConfig === undefined
                            ? 0
                            : 1) &&
                (auctionManager.participationConfig === null ||
                    auctionManager.participationConfig === undefined ||
                    (auctionManager.participationConfig !== null &&
                        view.participationItem)) &&
                view.vault);
            if ((!view.thumbnail || !view.thumbnail.metadata) &&
                desiredState != AuctionViewState.Defective)
                return undefined;
            return view;
        }
    }
    return undefined;
}
exports.processAccountsIntoAuctionView = processAccountsIntoAuctionView;
//# sourceMappingURL=useAuctions.js.map