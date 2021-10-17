"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMeta = exports.MetaProvider = void 0;
const common_1 = require("@oyster/common");
const react_1 = __importStar(require("react"));
const queryExtendedMetadata_1 = require("./queryExtendedMetadata");
const processAuctions_1 = require("./processAuctions");
const processMetaplexAccounts_1 = require("./processMetaplexAccounts");
const processMetaData_1 = require("./processMetaData");
const processVaultData_1 = require("./processVaultData");
const loadAccounts_1 = require("./loadAccounts");
const onChangeAccount_1 = require("./onChangeAccount");
const MetaContext = react_1.default.createContext({
    metadata: [],
    metadataByMint: {},
    masterEditions: {},
    masterEditionsByPrintingMint: {},
    masterEditionsByOneTimeAuthMint: {},
    metadataByMasterEdition: {},
    editions: {},
    auctionManagersByAuction: {},
    auctions: {},
    auctionDataExtended: {},
    vaults: {},
    store: null,
    isLoading: false,
    bidderMetadataByAuctionAndBidder: {},
    safetyDepositBoxesByVaultAndIndex: {},
    safetyDepositConfigsByAuctionManagerAndIndex: {},
    bidRedemptionV2sByAuctionManagerAndWinningIndex: {},
    bidderPotsByAuctionAndBidder: {},
    bidRedemptions: {},
    whitelistedCreatorsByCreator: {},
    payoutTickets: {},
    prizeTrackingTickets: {},
    stores: {},
});
function MetaProvider({ children = null }) {
    const connection = (0, common_1.useConnection)();
    const { isReady, storeAddress } = (0, common_1.useStore)();
    const searchParams = (0, common_1.useQuerySearch)();
    const all = searchParams.get('all') == 'true';
    const [state, setState] = (0, react_1.useState)({
        metadata: [],
        metadataByMint: {},
        masterEditions: {},
        masterEditionsByPrintingMint: {},
        masterEditionsByOneTimeAuthMint: {},
        metadataByMasterEdition: {},
        editions: {},
        auctionManagersByAuction: {},
        bidRedemptions: {},
        auctions: {},
        auctionDataExtended: {},
        vaults: {},
        payoutTickets: {},
        store: null,
        whitelistedCreatorsByCreator: {},
        bidderMetadataByAuctionAndBidder: {},
        bidderPotsByAuctionAndBidder: {},
        safetyDepositBoxesByVaultAndIndex: {},
        prizeTrackingTickets: {},
        safetyDepositConfigsByAuctionManagerAndIndex: {},
        bidRedemptionV2sByAuctionManagerAndWinningIndex: {},
        stores: {},
    });
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    const updateMints = (0, react_1.useCallback)(async (metadataByMint) => {
        try {
            if (!all) {
                const { metadata, mintToMetadata } = await (0, queryExtendedMetadata_1.queryExtendedMetadata)(connection, metadataByMint);
                setState(current => ({
                    ...current,
                    metadata,
                    metadataByMint: mintToMetadata,
                }));
            }
        }
        catch (er) {
            console.error(er);
        }
    }, [setState]);
    (0, react_1.useEffect)(() => {
        (async () => {
            if (!storeAddress) {
                if (isReady) {
                    setIsLoading(false);
                }
                return;
            }
            else if (!state.store) {
                setIsLoading(true);
            }
            console.log('-----> Query started');
            const nextState = await (0, loadAccounts_1.loadAccounts)(connection, all);
            console.log('------->Query finished');
            setState(nextState);
            setIsLoading(false);
            console.log('------->set finished');
            updateMints(nextState.metadataByMint);
        })();
    }, [connection, setState, updateMints, storeAddress, isReady]);
    const updateStateValue = (0, react_1.useMemo)(() => (prop, key, value) => {
        setState(current => (0, loadAccounts_1.makeSetter)({ ...current })(prop, key, value));
    }, [setState]);
    const store = state.store;
    const whitelistedCreatorsByCreator = state.whitelistedCreatorsByCreator;
    (0, react_1.useEffect)(() => {
        if (isLoading) {
            return;
        }
        const vaultSubId = connection.onProgramAccountChange((0, common_1.toPublicKey)(common_1.VAULT_ID), (0, onChangeAccount_1.onChangeAccount)(processVaultData_1.processVaultData, updateStateValue, all));
        const auctionSubId = connection.onProgramAccountChange((0, common_1.toPublicKey)(common_1.AUCTION_ID), (0, onChangeAccount_1.onChangeAccount)(processAuctions_1.processAuctions, updateStateValue, all));
        const metaplexSubId = connection.onProgramAccountChange((0, common_1.toPublicKey)(common_1.METAPLEX_ID), (0, onChangeAccount_1.onChangeAccount)(processMetaplexAccounts_1.processMetaplexAccounts, updateStateValue, all));
        const metaSubId = connection.onProgramAccountChange((0, common_1.toPublicKey)(common_1.METADATA_PROGRAM_ID), (0, onChangeAccount_1.onChangeAccount)(processMetaData_1.processMetaData, async (prop, key, value) => {
            if (prop === 'metadataByMint') {
                const nextState = await (0, loadAccounts_1.metadataByMintUpdater)(value, state, all);
                setState(nextState);
            }
            else {
                updateStateValue(prop, key, value);
            }
        }, all));
        return () => {
            connection.removeProgramAccountChangeListener(vaultSubId);
            connection.removeProgramAccountChangeListener(metaplexSubId);
            connection.removeProgramAccountChangeListener(metaSubId);
            connection.removeProgramAccountChangeListener(auctionSubId);
        };
    }, [
        connection,
        updateStateValue,
        setState,
        store,
        whitelistedCreatorsByCreator,
        isLoading,
    ]);
    // TODO: fetch names dynamically
    // TODO: get names for creators
    // useEffect(() => {
    //   (async () => {
    //     const twitterHandles = await connection.getProgramAccounts(NAME_PROGRAM_ID, {
    //      filters: [
    //        {
    //           dataSize: TWITTER_ACCOUNT_LENGTH,
    //        },
    //        {
    //          memcmp: {
    //           offset: VERIFICATION_AUTHORITY_OFFSET,
    //           bytes: TWITTER_VERIFICATION_AUTHORITY.toBase58()
    //          }
    //        }
    //      ]
    //     });
    //     const handles = twitterHandles.map(t => {
    //       const owner = new PublicKey(t.account.data.slice(32, 64));
    //       const name = t.account.data.slice(96, 114).toString();
    //     });
    //     console.log(handles);
    //   })();
    // }, [whitelistedCreatorsByCreator]);
    return (react_1.default.createElement(MetaContext.Provider, { value: {
            ...state,
            isLoading,
        } }, children));
}
exports.MetaProvider = MetaProvider;
const useMeta = () => {
    const context = (0, react_1.useContext)(MetaContext);
    return context;
};
exports.useMeta = useMeta;
//# sourceMappingURL=meta.js.map