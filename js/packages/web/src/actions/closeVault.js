"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeVault = void 0;
const web3_js_1 = require("@solana/web3.js");
const common_1 = require("@oyster/common");
const wallet_adapter_base_1 = require("@solana/wallet-adapter-base");
const spl_token_1 = require("@solana/spl-token");
const bn_js_1 = __importDefault(require("bn.js"));
const { createTokenAccount, activateVault, combineVault } = common_1.actions;
const { approve } = common_1.models;
// This command "closes" the vault, by activating & combining it in one go, handing it over to the auction manager
// authority (that may or may not exist yet.)
async function closeVault(connection, wallet, vault, fractionMint, fractionTreasury, redeemTreasury, priceMint, externalPriceAccount) {
    if (!wallet.publicKey)
        throw new wallet_adapter_base_1.WalletNotConnectedError();
    const accountRentExempt = await connection.getMinimumBalanceForRentExemption(spl_token_1.AccountLayout.span);
    let signers = [];
    let instructions = [];
    await activateVault(new bn_js_1.default(0), vault, fractionMint, fractionTreasury, wallet.publicKey.toBase58(), instructions);
    const outstandingShareAccount = createTokenAccount(instructions, wallet.publicKey, accountRentExempt, (0, common_1.toPublicKey)(fractionMint), wallet.publicKey, signers);
    const payingTokenAccount = createTokenAccount(instructions, wallet.publicKey, accountRentExempt, (0, common_1.toPublicKey)(priceMint), wallet.publicKey, signers);
    let transferAuthority = web3_js_1.Keypair.generate();
    // Shouldn't need to pay anything since we activated vault with 0 shares, but we still
    // need this setup anyway.
    approve(instructions, [], payingTokenAccount, wallet.publicKey, 0, false, undefined, transferAuthority);
    approve(instructions, [], outstandingShareAccount, wallet.publicKey, 0, false, undefined, transferAuthority);
    signers.push(transferAuthority);
    await combineVault(vault, outstandingShareAccount.toBase58(), payingTokenAccount.toBase58(), fractionMint, fractionTreasury, redeemTreasury, wallet.publicKey.toBase58(), wallet.publicKey.toBase58(), transferAuthority.publicKey.toBase58(), externalPriceAccount, instructions);
    return { instructions, signers };
}
exports.closeVault = closeVault;
//# sourceMappingURL=closeVault.js.map