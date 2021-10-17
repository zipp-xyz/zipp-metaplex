"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createExternalPriceAccount = void 0;
const web3_js_1 = require("@solana/web3.js");
const common_1 = require("@oyster/common");
const wallet_adapter_base_1 = require("@solana/wallet-adapter-base");
const bn_js_1 = __importDefault(require("bn.js"));
const constants_1 = require("../constants");
const { updateExternalPriceAccount, ExternalPriceAccount, MAX_EXTERNAL_ACCOUNT_SIZE, } = common_1.actions;
// This command creates the external pricing oracle
async function createExternalPriceAccount(connection, wallet) {
    if (!wallet.publicKey)
        throw new wallet_adapter_base_1.WalletNotConnectedError();
    const PROGRAM_IDS = common_1.utils.programIds();
    let signers = [];
    let instructions = [];
    const epaRentExempt = await connection.getMinimumBalanceForRentExemption(MAX_EXTERNAL_ACCOUNT_SIZE);
    let externalPriceAccount = web3_js_1.Keypair.generate();
    let key = externalPriceAccount.publicKey.toBase58();
    let epaStruct = new ExternalPriceAccount({
        pricePerShare: new bn_js_1.default(0),
        priceMint: constants_1.QUOTE_MINT.toBase58(),
        allowedToCombine: true,
    });
    const uninitializedEPA = web3_js_1.SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: externalPriceAccount.publicKey,
        lamports: epaRentExempt,
        space: MAX_EXTERNAL_ACCOUNT_SIZE,
        programId: (0, common_1.toPublicKey)(PROGRAM_IDS.vault),
    });
    instructions.push(uninitializedEPA);
    signers.push(externalPriceAccount);
    await updateExternalPriceAccount(key, epaStruct, instructions);
    return {
        externalPriceAccount: key,
        priceMint: constants_1.QUOTE_MINT.toBase58(),
        instructions,
        signers,
    };
}
exports.createExternalPriceAccount = createExternalPriceAccount;
//# sourceMappingURL=createExternalPriceAccount.js.map