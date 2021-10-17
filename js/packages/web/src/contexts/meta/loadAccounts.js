"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadataByMintUpdater = exports.makeSetter = exports.loadAccounts = void 0;
const ids_1 = require("@oyster/common/dist/lib/utils/ids");
const web3_js_1 = require("@solana/web3.js");
const isMetadataPartOfStore_1 = require("./isMetadataPartOfStore");
const processAuctions_1 = require("./processAuctions");
const processMetaplexAccounts_1 = require("./processMetaplexAccounts");
const processMetaData_1 = require("./processMetaData");
const processVaultData_1 = require("./processVaultData");
const common_1 = require("@oyster/common");
const metaplex_1 = require("../../models/metaplex");
async function getProgramAccounts(connection, programId, configOrCommitment) {
    const extra = {};
    let commitment;
    let encoding;
    if (configOrCommitment) {
        if (typeof configOrCommitment === 'string') {
            commitment = configOrCommitment;
        }
        else {
            commitment = configOrCommitment.commitment;
            encoding = configOrCommitment.encoding;
            if (configOrCommitment.dataSlice) {
                extra.dataSlice = configOrCommitment.dataSlice;
            }
            if (configOrCommitment.filters) {
                extra.filters = configOrCommitment.filters;
            }
        }
    }
    const args = connection._buildArgs([programId], commitment, 'base64', extra);
    const unsafeRes = await connection._rpcRequest('getProgramAccounts', args);
    const data = unsafeRes.result.map(item => {
        return {
            account: {
                // TODO: possible delay parsing could be added here
                data: Buffer.from(item.account.data[0], 'base64'),
                executable: item.account.executable,
                lamports: item.account.lamports,
                // TODO: maybe we can do it in lazy way? or just use string
                owner: item.account.owner,
            },
            pubkey: item.pubkey,
        };
    });
    return data;
}
const loadAccounts = async (connection, all) => {
    var _a;
    const tempCache = {
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
    };
    const updateTemp = (0, exports.makeSetter)(tempCache);
    const forEach = (fn) => async (accounts) => {
        for (const account of accounts) {
            await fn(account, updateTemp, all);
        }
    };
    const additionalPromises = [];
    const IS_BIG_STORE = ((_a = process.env.NEXT_PUBLIC_BIG_STORE) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === 'true';
    console.log(`Is big store: ${IS_BIG_STORE}`);
    const promises = [
        getProgramAccounts(connection, ids_1.VAULT_ID).then(forEach(processVaultData_1.processVaultData)),
        getProgramAccounts(connection, ids_1.AUCTION_ID).then(forEach(processAuctions_1.processAuctions)),
        ,
        getProgramAccounts(connection, ids_1.METAPLEX_ID).then(forEach(processMetaplexAccounts_1.processMetaplexAccounts)),
        IS_BIG_STORE
            ? getProgramAccounts(connection, ids_1.METADATA_PROGRAM_ID).then(forEach(processMetaData_1.processMetaData))
            : undefined,
        getProgramAccounts(connection, ids_1.METAPLEX_ID, {
            filters: [
                {
                    dataSize: metaplex_1.MAX_WHITELISTED_CREATOR_SIZE,
                },
            ],
        }).then(async (creators) => {
            const result = await forEach(processMetaplexAccounts_1.processMetaplexAccounts)(creators);
            if (IS_BIG_STORE) {
                return result;
            }
            const whitelistedCreators = Object.values(tempCache.whitelistedCreatorsByCreator);
            if (whitelistedCreators.length > 3) {
                console.log(' too many creators, pulling all nfts in one go');
                additionalPromises.push(getProgramAccounts(connection, ids_1.METADATA_PROGRAM_ID).then(forEach(processMetaData_1.processMetaData)));
            }
            else {
                console.log('pulling optimized nfts');
                for (let i = 0; i < common_1.MAX_CREATOR_LIMIT; i++) {
                    for (let j = 0; j < whitelistedCreators.length; j++) {
                        additionalPromises.push(getProgramAccounts(connection, ids_1.METADATA_PROGRAM_ID, {
                            filters: [
                                {
                                    memcmp: {
                                        offset: 1 + // key
                                            32 + // update auth
                                            32 + // mint
                                            4 + // name string length
                                            common_1.MAX_NAME_LENGTH + // name
                                            4 + // uri string length
                                            common_1.MAX_URI_LENGTH + // uri
                                            4 + // symbol string length
                                            common_1.MAX_SYMBOL_LENGTH + // symbol
                                            2 + // seller fee basis points
                                            1 + // whether or not there is a creators vec
                                            4 + // creators vec length
                                            i * common_1.MAX_CREATOR_LEN,
                                        bytes: whitelistedCreators[j].info.address,
                                    },
                                },
                            ],
                        }).then(forEach(processMetaData_1.processMetaData)));
                    }
                }
            }
        }),
    ];
    await Promise.all(promises);
    await Promise.all(additionalPromises);
    await postProcessMetadata(tempCache, all);
    console.log('Metadata size', tempCache.metadata.length);
    if (additionalPromises.length > 0) {
        console.log('Pulling editions for optimized metadata');
        let setOf100MetadataEditionKeys = [];
        const editionPromises = [];
        for (let i = 0; i < tempCache.metadata.length; i++) {
            let edition;
            if (tempCache.metadata[i].info.editionNonce != null) {
                edition = (await web3_js_1.PublicKey.createProgramAddress([
                    Buffer.from(common_1.METADATA_PREFIX),
                    (0, ids_1.toPublicKey)(ids_1.METADATA_PROGRAM_ID).toBuffer(),
                    (0, ids_1.toPublicKey)(tempCache.metadata[i].info.mint).toBuffer(),
                    new Uint8Array([tempCache.metadata[i].info.editionNonce || 0]),
                ], (0, ids_1.toPublicKey)(ids_1.METADATA_PROGRAM_ID))).toBase58();
            }
            else {
                edition = await (0, common_1.getEdition)(tempCache.metadata[i].info.mint);
            }
            setOf100MetadataEditionKeys.push(edition);
            if (setOf100MetadataEditionKeys.length >= 100) {
                editionPromises.push((0, common_1.getMultipleAccounts)(connection, setOf100MetadataEditionKeys, 'recent'));
                setOf100MetadataEditionKeys = [];
            }
        }
        if (setOf100MetadataEditionKeys.length >= 0) {
            editionPromises.push((0, common_1.getMultipleAccounts)(connection, setOf100MetadataEditionKeys, 'recent'));
            setOf100MetadataEditionKeys = [];
        }
        const responses = await Promise.all(editionPromises);
        for (let i = 0; i < responses.length; i++) {
            const returnedAccounts = responses[i];
            for (let j = 0; j < returnedAccounts.array.length; j++) {
                (0, processMetaData_1.processMetaData)({
                    pubkey: returnedAccounts.keys[j],
                    account: returnedAccounts.array[j],
                }, updateTemp, all);
            }
        }
        console.log('Edition size', Object.keys(tempCache.editions).length, Object.keys(tempCache.masterEditions).length);
    }
    return tempCache;
};
exports.loadAccounts = loadAccounts;
const makeSetter = (state) => (prop, key, value) => {
    if (prop === 'store') {
        state[prop] = value;
    }
    else if (prop !== 'metadata') {
        state[prop][key] = value;
    }
    return state;
};
exports.makeSetter = makeSetter;
const postProcessMetadata = async (tempCache, all) => {
    const values = Object.values(tempCache.metadataByMint);
    for (const metadata of values) {
        await (0, exports.metadataByMintUpdater)(metadata, tempCache, all);
    }
};
const metadataByMintUpdater = async (metadata, state, all) => {
    var _a;
    const key = metadata.info.mint;
    if ((0, isMetadataPartOfStore_1.isMetadataPartOfStore)(metadata, state.store, state.whitelistedCreatorsByCreator, all)) {
        await metadata.info.init();
        const masterEditionKey = (_a = metadata.info) === null || _a === void 0 ? void 0 : _a.masterEdition;
        if (masterEditionKey) {
            state.metadataByMasterEdition[masterEditionKey] = metadata;
        }
        state.metadataByMint[key] = metadata;
        state.metadata.push(metadata);
    }
    else {
        delete state.metadataByMint[key];
    }
    return state;
};
exports.metadataByMintUpdater = metadataByMintUpdater;
//# sourceMappingURL=loadAccounts.js.map