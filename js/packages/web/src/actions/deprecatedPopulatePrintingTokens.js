"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deprecatedPopulatePrintingTokens = void 0;
const common_1 = require("@oyster/common");
const wallet_adapter_base_1 = require("@solana/wallet-adapter-base");
const bn_js_1 = __importDefault(require("bn.js"));
const BATCH_SIZE = 4;
// Printing tokens are minted on the fly as needed. We need to pre-mint them to give to the vault
// for all relevant NFTs.
async function deprecatedPopulatePrintingTokens(connection, wallet, safetyDepositConfigs) {
    var _a, _b;
    if (!wallet.publicKey)
        throw new wallet_adapter_base_1.WalletNotConnectedError();
    const PROGRAM_IDS = common_1.utils.programIds();
    let batchCounter = 0;
    let signers = [];
    let instructions = [];
    let currSigners = [];
    let currInstructions = [];
    for (let i = 0; i < safetyDepositConfigs.length; i++) {
        let nft = safetyDepositConfigs[i];
        if (((_a = nft.draft.masterEdition) === null || _a === void 0 ? void 0 : _a.info.key) != common_1.MetadataKey.MasterEditionV1) {
            continue;
        }
        const printingMint = (_b = nft.draft.masterEdition) === null || _b === void 0 ? void 0 : _b.info.printingMint;
        if (nft.box.tokenMint === printingMint && !nft.box.tokenAccount) {
            const holdingKey = (await (0, common_1.findProgramAddress)([
                wallet.publicKey.toBuffer(),
                PROGRAM_IDS.token.toBuffer(),
                (0, common_1.toPublicKey)(printingMint).toBuffer(),
            ], PROGRAM_IDS.associatedToken))[0];
            (0, common_1.createAssociatedTokenAccountInstruction)(currInstructions, (0, common_1.toPublicKey)(holdingKey), wallet.publicKey, wallet.publicKey, (0, common_1.toPublicKey)(printingMint));
            console.log('Making atas');
            nft.draft.printingMintHolding = holdingKey;
            nft.box.tokenAccount = holdingKey;
        }
        if (nft.box.tokenAccount && nft.box.tokenMint === printingMint) {
            let balance = 0;
            try {
                balance =
                    (await connection.getTokenAccountBalance((0, common_1.toPublicKey)(nft.box.tokenAccount))).value.uiAmount || 0;
            }
            catch (e) {
                console.error(e);
            }
            if (balance < nft.box.amount.toNumber() && nft.draft.masterEdition)
                await (0, common_1.deprecatedMintPrintingTokens)(nft.box.tokenAccount, nft.box.tokenMint, wallet.publicKey.toBase58(), nft.draft.metadata.pubkey, nft.draft.masterEdition.pubkey, new bn_js_1.default(nft.box.amount.toNumber() - balance), currInstructions);
            batchCounter++;
        }
        if (batchCounter === BATCH_SIZE) {
            signers.push(currSigners);
            instructions.push(currInstructions);
            batchCounter = 0;
            currSigners = [];
            currInstructions = [];
        }
    }
    if (instructions[instructions.length - 1] !== currInstructions) {
        signers.push(currSigners);
        instructions.push(currInstructions);
    }
    return { signers, instructions, safetyDepositConfigs };
}
exports.deprecatedPopulatePrintingTokens = deprecatedPopulatePrintingTokens;
//# sourceMappingURL=deprecatedPopulatePrintingTokens.js.map