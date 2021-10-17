"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuctionManager = void 0;
const web3_js_1 = require("@solana/web3.js");
const common_1 = require("@oyster/common");
const wallet_adapter_base_1 = require("@solana/wallet-adapter-base");
const spl_token_1 = require("@solana/spl-token");
const bn_js_1 = __importDefault(require("bn.js"));
const metaplex_1 = require("../models/metaplex");
const createVault_1 = require("./createVault");
const closeVault_1 = require("./closeVault");
const addTokensToVault_1 = require("./addTokensToVault");
const makeAuction_1 = require("./makeAuction");
const createExternalPriceAccount_1 = require("./createExternalPriceAccount");
const deprecatedValidateParticipation_1 = require("../models/metaplex/deprecatedValidateParticipation");
const deprecatedCreateReservationListsForTokens_1 = require("./deprecatedCreateReservationListsForTokens");
const deprecatedPopulatePrintingTokens_1 = require("./deprecatedPopulatePrintingTokens");
const setVaultAndAuctionAuthorities_1 = require("./setVaultAndAuctionAuthorities");
const markItemsThatArentMineAsSold_1 = require("./markItemsThatArentMineAsSold");
const validateSafetyDepositBoxV2_1 = require("../models/metaplex/validateSafetyDepositBoxV2");
const initAuctionManagerV2_1 = require("../models/metaplex/initAuctionManagerV2");
const { createTokenAccount } = common_1.actions;
// This is a super command that executes many transactions to create a Vault, Auction, and AuctionManager starting
// from some AuctionManagerSettings.
async function createAuctionManager(connection, wallet, whitelistedCreatorsByCreator, auctionSettings, safetyDepositDrafts, participationSafetyDepositDraft, paymentMint) {
    var _a, _b, _c, _d, _e;
    const accountRentExempt = await connection.getMinimumBalanceForRentExemption(spl_token_1.AccountLayout.span);
    const { externalPriceAccount, priceMint, instructions: epaInstructions, signers: epaSigners, } = await (0, createExternalPriceAccount_1.createExternalPriceAccount)(connection, wallet);
    const { instructions: createVaultInstructions, signers: createVaultSigners, vault, fractionalMint, redeemTreasury, fractionTreasury, } = await (0, createVault_1.createVault)(connection, wallet, priceMint, externalPriceAccount);
    const { instructions: makeAuctionInstructions, signers: makeAuctionSigners, auction, } = await (0, makeAuction_1.makeAuction)(wallet, vault, auctionSettings);
    let safetyDepositConfigsWithPotentiallyUnsetTokens = await buildSafetyDepositArray(wallet, safetyDepositDrafts, participationSafetyDepositDraft);
    // Only creates for PrintingV1 deprecated configs
    const { instructions: populateInstr, signers: populateSigners, safetyDepositConfigs, } = await (0, deprecatedPopulatePrintingTokens_1.deprecatedPopulatePrintingTokens)(connection, wallet, safetyDepositConfigsWithPotentiallyUnsetTokens);
    const { instructions: auctionManagerInstructions, signers: auctionManagerSigners, auctionManager, } = await setupAuctionManagerInstructions(wallet, vault, paymentMint, accountRentExempt, safetyDepositConfigs, auctionSettings);
    const { instructions: addTokenInstructions, signers: addTokenSigners, safetyDepositTokenStores, } = await (0, addTokensToVault_1.addTokensToVault)(connection, wallet, vault, safetyDepositConfigs);
    // Only creates for deprecated PrintingV1 configs
    const { instructions: createReservationInstructions, signers: createReservationSigners, } = await (0, deprecatedCreateReservationListsForTokens_1.deprecatedCreateReservationListForTokens)(wallet, auctionManager, safetyDepositConfigs);
    let lookup = {
        markItemsThatArentMineAsSold: await (0, markItemsThatArentMineAsSold_1.markItemsThatArentMineAsSold)(wallet, safetyDepositDrafts),
        externalPriceAccount: {
            instructions: epaInstructions,
            signers: epaSigners,
        },
        createVault: {
            instructions: createVaultInstructions,
            signers: createVaultSigners,
        },
        closeVault: await (0, closeVault_1.closeVault)(connection, wallet, vault, fractionalMint, fractionTreasury, redeemTreasury, priceMint, externalPriceAccount),
        addTokens: { instructions: addTokenInstructions, signers: addTokenSigners },
        deprecatedCreateReservationList: {
            instructions: createReservationInstructions,
            signers: createReservationSigners,
        },
        makeAuction: {
            instructions: makeAuctionInstructions,
            signers: makeAuctionSigners,
        },
        initAuctionManager: {
            instructions: auctionManagerInstructions,
            signers: auctionManagerSigners,
        },
        setVaultAndAuctionAuthorities: await (0, setVaultAndAuctionAuthorities_1.setVaultAndAuctionAuthorities)(wallet, vault, auction, auctionManager),
        startAuction: await setupStartAuction(wallet, vault),
        deprecatedValidateParticipation: participationSafetyDepositDraft
            ? await deprecatedValidateParticipationHelper(wallet, auctionManager, whitelistedCreatorsByCreator, vault, safetyDepositTokenStores[safetyDepositTokenStores.length - 1], // The last one is always the participation
            participationSafetyDepositDraft, accountRentExempt)
            : undefined,
        deprecatedBuildAndPopulateOneTimeAuthorizationAccount: participationSafetyDepositDraft
            ? await deprecatedBuildAndPopulateOneTimeAuthorizationAccount(connection, wallet, (_a = participationSafetyDepositDraft === null || participationSafetyDepositDraft === void 0 ? void 0 : participationSafetyDepositDraft.masterEdition) === null || _a === void 0 ? void 0 : _a.info.oneTimePrintingAuthorizationMint)
            : undefined,
        validateBoxes: await validateBoxes(wallet, whitelistedCreatorsByCreator, vault, 
        // Participation NFTs validate differently, with above
        safetyDepositConfigs.filter(c => {
            var _a, _b;
            return !participationSafetyDepositDraft ||
                // Only V1s need to skip normal validation and use special endpoint
                (((_a = participationSafetyDepositDraft.masterEdition) === null || _a === void 0 ? void 0 : _a.info.key) ==
                    common_1.MetadataKey.MasterEditionV1 &&
                    c.draft.metadata.pubkey !==
                        participationSafetyDepositDraft.metadata.pubkey) ||
                ((_b = participationSafetyDepositDraft.masterEdition) === null || _b === void 0 ? void 0 : _b.info.key) ==
                    common_1.MetadataKey.MasterEditionV2;
        }), safetyDepositTokenStores),
        deprecatedPopulatePrintingTokens: {
            instructions: populateInstr,
            signers: populateSigners,
        },
    };
    let signers = [
        ...lookup.markItemsThatArentMineAsSold.signers,
        lookup.externalPriceAccount.signers,
        ((_b = lookup.deprecatedBuildAndPopulateOneTimeAuthorizationAccount) === null || _b === void 0 ? void 0 : _b.signers) || [],
        ...lookup.deprecatedPopulatePrintingTokens.signers,
        lookup.createVault.signers,
        ...lookup.addTokens.signers,
        ...lookup.deprecatedCreateReservationList.signers,
        lookup.closeVault.signers,
        lookup.makeAuction.signers,
        lookup.initAuctionManager.signers,
        lookup.setVaultAndAuctionAuthorities.signers,
        ((_c = lookup.deprecatedValidateParticipation) === null || _c === void 0 ? void 0 : _c.signers) || [],
        ...lookup.validateBoxes.signers,
        lookup.startAuction.signers,
    ];
    const toRemoveSigners = {};
    let instructions = [
        ...lookup.markItemsThatArentMineAsSold.instructions,
        lookup.externalPriceAccount.instructions,
        ((_d = lookup.deprecatedBuildAndPopulateOneTimeAuthorizationAccount) === null || _d === void 0 ? void 0 : _d.instructions) || [],
        ...lookup.deprecatedPopulatePrintingTokens.instructions,
        lookup.createVault.instructions,
        ...lookup.addTokens.instructions,
        ...lookup.deprecatedCreateReservationList.instructions,
        lookup.closeVault.instructions,
        lookup.makeAuction.instructions,
        lookup.initAuctionManager.instructions,
        lookup.setVaultAndAuctionAuthorities.instructions,
        ((_e = lookup.deprecatedValidateParticipation) === null || _e === void 0 ? void 0 : _e.instructions) || [],
        ...lookup.validateBoxes.instructions,
        lookup.startAuction.instructions,
    ].filter((instr, i) => {
        if (instr.length > 0) {
            return true;
        }
        else {
            toRemoveSigners[i] = true;
            return false;
        }
    });
    let filteredSigners = signers.filter((_, i) => !toRemoveSigners[i]);
    let stopPoint = 0;
    let tries = 0;
    let lastInstructionsLength = null;
    while (stopPoint < instructions.length && tries < 3) {
        instructions = instructions.slice(stopPoint, instructions.length);
        filteredSigners = filteredSigners.slice(stopPoint, filteredSigners.length);
        if (instructions.length === lastInstructionsLength)
            tries = tries + 1;
        else
            tries = 0;
        try {
            if (instructions.length === 1) {
                await (0, common_1.sendTransactionWithRetry)(connection, wallet, instructions[0], filteredSigners[0], 'single');
                stopPoint = 1;
            }
            else {
                stopPoint = await (0, common_1.sendTransactions)(connection, wallet, instructions, filteredSigners, common_1.SequenceType.StopOnFailure, 'single');
            }
        }
        catch (e) {
            console.error(e);
        }
        console.log('Died on ', stopPoint, 'retrying from instruction', instructions[stopPoint], 'instructions length is', instructions.length);
        lastInstructionsLength = instructions.length;
    }
    if (stopPoint < instructions.length)
        throw new Error('Failed to create');
    return { vault, auction, auctionManager };
}
exports.createAuctionManager = createAuctionManager;
async function buildSafetyDepositArray(wallet, safetyDeposits, participationSafetyDepositDraft) {
    if (!wallet.publicKey)
        throw new wallet_adapter_base_1.WalletNotConnectedError();
    let safetyDepositTemplates = [];
    safetyDeposits.forEach((s, i) => {
        var _a;
        const maxAmount = [...s.amountRanges.map(a => a.amount)]
            .sort()
            .reverse()[0];
        const maxLength = [...s.amountRanges.map(a => a.length)]
            .sort()
            .reverse()[0];
        safetyDepositTemplates.push({
            box: {
                tokenAccount: s.winningConfigType !== metaplex_1.WinningConfigType.PrintingV1
                    ? s.holding
                    : s.printingMintHolding,
                tokenMint: s.winningConfigType !== metaplex_1.WinningConfigType.PrintingV1
                    ? s.metadata.info.mint
                    : (_a = s.masterEdition) === null || _a === void 0 ? void 0 : _a.info.printingMint,
                amount: s.winningConfigType == metaplex_1.WinningConfigType.PrintingV2 ||
                    s.winningConfigType == metaplex_1.WinningConfigType.FullRightsTransfer
                    ? new bn_js_1.default(1)
                    : new bn_js_1.default(s.amountRanges.reduce((acc, r) => acc.add(r.amount.mul(r.length)), new bn_js_1.default(0))),
            },
            config: new metaplex_1.SafetyDepositConfig({
                directArgs: {
                    auctionManager: web3_js_1.SystemProgram.programId.toBase58(),
                    order: new bn_js_1.default(i),
                    amountRanges: s.amountRanges,
                    amountType: maxAmount.gte(new bn_js_1.default(254))
                        ? metaplex_1.TupleNumericType.U16
                        : metaplex_1.TupleNumericType.U8,
                    lengthType: maxLength.gte(new bn_js_1.default(254))
                        ? metaplex_1.TupleNumericType.U16
                        : metaplex_1.TupleNumericType.U8,
                    winningConfigType: s.winningConfigType,
                    participationConfig: null,
                    participationState: null,
                },
            }),
            draft: s,
        });
    });
    if (participationSafetyDepositDraft &&
        participationSafetyDepositDraft.masterEdition) {
        const maxAmount = [
            ...participationSafetyDepositDraft.amountRanges.map(s => s.amount),
        ]
            .sort()
            .reverse()[0];
        const maxLength = [
            ...participationSafetyDepositDraft.amountRanges.map(s => s.length),
        ]
            .sort()
            .reverse()[0];
        const config = new metaplex_1.SafetyDepositConfig({
            directArgs: {
                auctionManager: web3_js_1.SystemProgram.programId.toBase58(),
                order: new bn_js_1.default(safetyDeposits.length),
                amountRanges: participationSafetyDepositDraft.amountRanges,
                amountType: (maxAmount === null || maxAmount === void 0 ? void 0 : maxAmount.gte(new bn_js_1.default(255)))
                    ? metaplex_1.TupleNumericType.U32
                    : metaplex_1.TupleNumericType.U8,
                lengthType: (maxLength === null || maxLength === void 0 ? void 0 : maxLength.gte(new bn_js_1.default(255)))
                    ? metaplex_1.TupleNumericType.U32
                    : metaplex_1.TupleNumericType.U8,
                winningConfigType: metaplex_1.WinningConfigType.Participation,
                participationConfig: participationSafetyDepositDraft.participationConfig || null,
                participationState: new metaplex_1.ParticipationStateV2({
                    collectedToAcceptPayment: new bn_js_1.default(0),
                }),
            },
        });
        if (participationSafetyDepositDraft.masterEdition.info.key ==
            common_1.MetadataKey.MasterEditionV1) {
            const me = participationSafetyDepositDraft.masterEdition;
            safetyDepositTemplates.push({
                box: {
                    tokenAccount: (await (0, common_1.findProgramAddress)([
                        wallet.publicKey.toBuffer(),
                        (0, common_1.programIds)().token.toBuffer(),
                        (0, common_1.toPublicKey)(me === null || me === void 0 ? void 0 : me.info.oneTimePrintingAuthorizationMint).toBuffer(),
                    ], (0, common_1.programIds)().associatedToken))[0],
                    tokenMint: me === null || me === void 0 ? void 0 : me.info.oneTimePrintingAuthorizationMint,
                    amount: new bn_js_1.default(1),
                },
                config,
                draft: participationSafetyDepositDraft,
            });
        }
        else {
            safetyDepositTemplates.push({
                box: {
                    tokenAccount: participationSafetyDepositDraft.holding,
                    tokenMint: participationSafetyDepositDraft.metadata.info.mint,
                    amount: new bn_js_1.default(1),
                },
                config,
                draft: participationSafetyDepositDraft,
            });
        }
    }
    console.log('Temps', safetyDepositTemplates);
    return safetyDepositTemplates;
}
async function setupAuctionManagerInstructions(wallet, vault, paymentMint, accountRentExempt, safetyDeposits, auctionSettings) {
    var _a;
    if (!wallet.publicKey)
        throw new wallet_adapter_base_1.WalletNotConnectedError();
    let store = (_a = (0, common_1.programIds)().store) === null || _a === void 0 ? void 0 : _a.toBase58();
    if (!store) {
        throw new Error('Store not initialized');
    }
    let signers = [];
    let instructions = [];
    const { auctionManagerKey } = await (0, metaplex_1.getAuctionKeys)(vault);
    const acceptPayment = createTokenAccount(instructions, wallet.publicKey, accountRentExempt, (0, common_1.toPublicKey)(paymentMint), (0, common_1.toPublicKey)(auctionManagerKey), signers).toBase58();
    let maxRanges = [
        auctionSettings.winners.usize.toNumber(),
        safetyDeposits.length,
        100,
    ].sort()[0];
    if (maxRanges < 10) {
        maxRanges = 10;
    }
    await (0, initAuctionManagerV2_1.initAuctionManagerV2)(vault, wallet.publicKey.toBase58(), wallet.publicKey.toBase58(), acceptPayment, store, safetyDeposits.length >= 254 ? metaplex_1.TupleNumericType.U16 : metaplex_1.TupleNumericType.U8, auctionSettings.winners.usize.toNumber() >= 254
        ? metaplex_1.TupleNumericType.U16
        : metaplex_1.TupleNumericType.U8, new bn_js_1.default(maxRanges), instructions);
    return { instructions, signers, auctionManager: auctionManagerKey };
}
async function setupStartAuction(wallet, vault) {
    if (!wallet.publicKey)
        throw new wallet_adapter_base_1.WalletNotConnectedError();
    let signers = [];
    let instructions = [];
    await (0, metaplex_1.startAuction)(vault, wallet.publicKey.toBase58(), instructions);
    return { instructions, signers };
}
async function deprecatedValidateParticipationHelper(wallet, auctionManager, whitelistedCreatorsByCreator, vault, tokenStore, participationSafetyDepositDraft, accountRentExempt) {
    var _a, _b;
    if (!wallet.publicKey)
        throw new wallet_adapter_base_1.WalletNotConnectedError();
    const store = (_a = (0, common_1.programIds)().store) === null || _a === void 0 ? void 0 : _a.toBase58();
    if (!store) {
        throw new Error('Store not initialized');
    }
    let instructions = [];
    let signers = [];
    const whitelistedCreator = participationSafetyDepositDraft.metadata.info.data
        .creators
        ? await findValidWhitelistedCreator(whitelistedCreatorsByCreator, 
        //@ts-ignore
        participationSafetyDepositDraft.metadata.info.data.creators)
        : undefined;
    const { auctionManagerKey } = await (0, metaplex_1.getAuctionKeys)(vault);
    // V2s do not need to call this special endpoint.
    if (participationSafetyDepositDraft.masterEdition &&
        participationSafetyDepositDraft.masterEdition.info.key ==
            common_1.MetadataKey.MasterEditionV1) {
        const me = participationSafetyDepositDraft.masterEdition;
        const printingTokenHoldingAccount = createTokenAccount(instructions, wallet.publicKey, accountRentExempt, (0, common_1.toPublicKey)(me.info.printingMint), (0, common_1.toPublicKey)(auctionManagerKey), signers).toBase58();
        await (0, deprecatedValidateParticipation_1.deprecatedValidateParticipation)(auctionManager, participationSafetyDepositDraft.metadata.pubkey, (_b = participationSafetyDepositDraft.masterEdition) === null || _b === void 0 ? void 0 : _b.pubkey, printingTokenHoldingAccount, wallet.publicKey.toBase58(), whitelistedCreator, store, await (0, common_1.getSafetyDepositBoxAddress)(vault, me.info.oneTimePrintingAuthorizationMint), tokenStore, vault, instructions);
    }
    return { instructions, signers };
}
async function findValidWhitelistedCreator(whitelistedCreatorsByCreator, creators) {
    var _a, _b;
    for (let i = 0; i < creators.length; i++) {
        const creator = creators[i];
        if ((_a = whitelistedCreatorsByCreator[creator.address]) === null || _a === void 0 ? void 0 : _a.info.activated)
            return whitelistedCreatorsByCreator[creator.address].pubkey;
    }
    return await (0, metaplex_1.getWhitelistedCreator)((_b = creators[0]) === null || _b === void 0 ? void 0 : _b.address);
}
async function validateBoxes(wallet, whitelistedCreatorsByCreator, vault, safetyDeposits, safetyDepositTokenStores) {
    var _a;
    if (!wallet.publicKey)
        throw new wallet_adapter_base_1.WalletNotConnectedError();
    const store = (_a = (0, common_1.programIds)().store) === null || _a === void 0 ? void 0 : _a.toBase58();
    if (!store) {
        throw new Error('Store not initialized');
    }
    let signers = [];
    let instructions = [];
    for (let i = 0; i < safetyDeposits.length; i++) {
        let tokenSigners = [];
        let tokenInstructions = [];
        let safetyDepositBox;
        const me = safetyDeposits[i].draft
            .masterEdition;
        if (safetyDeposits[i].config.winningConfigType ===
            metaplex_1.WinningConfigType.PrintingV1 &&
            me &&
            me.info.printingMint) {
            safetyDepositBox = await (0, common_1.getSafetyDepositBox)(vault, 
            //@ts-ignore
            safetyDeposits[i].draft.masterEdition.info.printingMint);
        }
        else {
            safetyDepositBox = await (0, common_1.getSafetyDepositBox)(vault, safetyDeposits[i].draft.metadata.info.mint);
        }
        const edition = await (0, common_1.getEdition)(safetyDeposits[i].draft.metadata.info.mint);
        const whitelistedCreator = safetyDeposits[i].draft.metadata.info.data
            .creators
            ? await findValidWhitelistedCreator(whitelistedCreatorsByCreator, 
            //@ts-ignore
            safetyDeposits[i].draft.metadata.info.data.creators)
            : undefined;
        await (0, validateSafetyDepositBoxV2_1.validateSafetyDepositBoxV2)(vault, safetyDeposits[i].draft.metadata.pubkey, safetyDepositBox, safetyDepositTokenStores[i], safetyDeposits[i].config.winningConfigType ===
            metaplex_1.WinningConfigType.PrintingV1
            ? me === null || me === void 0 ? void 0 : me.info.printingMint
            : safetyDeposits[i].draft.metadata.info.mint, wallet.publicKey.toBase58(), wallet.publicKey.toBase58(), wallet.publicKey.toBase58(), tokenInstructions, edition, whitelistedCreator, store, safetyDeposits[i].config);
        signers.push(tokenSigners);
        instructions.push(tokenInstructions);
    }
    return { instructions, signers };
}
async function deprecatedBuildAndPopulateOneTimeAuthorizationAccount(connection, wallet, oneTimePrintingAuthorizationMint) {
    if (!wallet.publicKey)
        throw new wallet_adapter_base_1.WalletNotConnectedError();
    if (!oneTimePrintingAuthorizationMint)
        return { instructions: [], signers: [] };
    let signers = [];
    let instructions = [];
    const recipientKey = (await (0, common_1.findProgramAddress)([
        wallet.publicKey.toBuffer(),
        (0, common_1.programIds)().token.toBuffer(),
        (0, common_1.toPublicKey)(oneTimePrintingAuthorizationMint).toBuffer(),
    ], (0, common_1.programIds)().associatedToken))[0];
    if (!(await connection.getAccountInfo((0, common_1.toPublicKey)(recipientKey)))) {
        (0, common_1.createAssociatedTokenAccountInstruction)(instructions, (0, common_1.toPublicKey)(recipientKey), wallet.publicKey, wallet.publicKey, (0, common_1.toPublicKey)(oneTimePrintingAuthorizationMint));
    }
    instructions.push(spl_token_1.Token.createMintToInstruction((0, common_1.programIds)().token, (0, common_1.toPublicKey)(oneTimePrintingAuthorizationMint), (0, common_1.toPublicKey)(recipientKey), wallet.publicKey, [], 1));
    return { instructions, signers };
}
//# sourceMappingURL=createAuctionManager.js.map