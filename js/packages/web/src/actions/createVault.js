"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVault = void 0;
const web3_js_1 = require("@solana/web3.js");
const common_1 = require("@oyster/common");
const spl_token_1 = require("@solana/spl-token");
const wallet_adapter_base_1 = require("@solana/wallet-adapter-base");
const { createTokenAccount, initVault, MAX_VAULT_SIZE, VAULT_PREFIX } = common_1.actions;
// This command creates the external pricing oracle a vault
// This gets the vault ready for adding the tokens.
async function createVault(connection, wallet, priceMint, externalPriceAccount) {
    if (!wallet.publicKey)
        throw new wallet_adapter_base_1.WalletNotConnectedError();
    const PROGRAM_IDS = common_1.utils.programIds();
    let signers = [];
    let instructions = [];
    const accountRentExempt = await connection.getMinimumBalanceForRentExemption(spl_token_1.AccountLayout.span);
    const mintRentExempt = await connection.getMinimumBalanceForRentExemption(spl_token_1.MintLayout.span);
    const vaultRentExempt = await connection.getMinimumBalanceForRentExemption(MAX_VAULT_SIZE);
    let vault = web3_js_1.Keypair.generate();
    const vaultAuthority = (await (0, common_1.findProgramAddress)([
        Buffer.from(VAULT_PREFIX),
        (0, common_1.toPublicKey)(PROGRAM_IDS.vault).toBuffer(),
        vault.publicKey.toBuffer(),
    ], (0, common_1.toPublicKey)(PROGRAM_IDS.vault)))[0];
    const fractionalMint = (0, common_1.createMint)(instructions, wallet.publicKey, mintRentExempt, 0, (0, common_1.toPublicKey)(vaultAuthority), (0, common_1.toPublicKey)(vaultAuthority), signers).toBase58();
    const redeemTreasury = createTokenAccount(instructions, wallet.publicKey, accountRentExempt, (0, common_1.toPublicKey)(priceMint), (0, common_1.toPublicKey)(vaultAuthority), signers).toBase58();
    const fractionTreasury = createTokenAccount(instructions, wallet.publicKey, accountRentExempt, (0, common_1.toPublicKey)(fractionalMint), (0, common_1.toPublicKey)(vaultAuthority), signers).toBase58();
    const uninitializedVault = web3_js_1.SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: vault.publicKey,
        lamports: vaultRentExempt,
        space: MAX_VAULT_SIZE,
        programId: (0, common_1.toPublicKey)(PROGRAM_IDS.vault),
    });
    instructions.push(uninitializedVault);
    signers.push(vault);
    await initVault(true, fractionalMint, redeemTreasury, fractionTreasury, vault.publicKey.toBase58(), wallet.publicKey.toBase58(), externalPriceAccount, instructions);
    return {
        vault: vault.publicKey.toBase58(),
        fractionalMint,
        redeemTreasury,
        fractionTreasury,
        signers,
        instructions,
    };
}
exports.createVault = createVault;
//# sourceMappingURL=createVault.js.map