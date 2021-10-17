"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addTokensToVault = void 0;
const common_1 = require("@oyster/common");
const spl_token_1 = require("@solana/spl-token");
const bn_js_1 = __importDefault(require("bn.js"));
const wallet_adapter_base_1 = require("@solana/wallet-adapter-base");
const { createTokenAccount, addTokenToInactiveVault, VAULT_PREFIX } = common_1.actions;
const { approve } = common_1.models;
const BATCH_SIZE = 1;
// This command batches out adding tokens to a vault using a prefilled payer account, and then activates and combines
// the vault for use. It issues a series of transaction instructions and signers for the sendTransactions batch.
async function addTokensToVault(connection, wallet, vault, nfts) {
    if (!wallet.publicKey)
        throw new wallet_adapter_base_1.WalletNotConnectedError();
    const PROGRAM_IDS = common_1.utils.programIds();
    const accountRentExempt = await connection.getMinimumBalanceForRentExemption(spl_token_1.AccountLayout.span);
    const vaultAuthority = (await (0, common_1.findProgramAddress)([
        Buffer.from(VAULT_PREFIX),
        (0, common_1.toPublicKey)(PROGRAM_IDS.vault).toBuffer(),
        (0, common_1.toPublicKey)(vault).toBuffer(),
    ], (0, common_1.toPublicKey)(PROGRAM_IDS.vault)))[0];
    let batchCounter = 0;
    let signers = [];
    let instructions = [];
    let newStores = [];
    let currSigners = [];
    let currInstructions = [];
    for (let i = 0; i < nfts.length; i++) {
        let nft = nfts[i];
        if (nft.box.tokenAccount) {
            const newStoreAccount = createTokenAccount(currInstructions, wallet.publicKey, accountRentExempt, (0, common_1.toPublicKey)(nft.box.tokenMint), (0, common_1.toPublicKey)(vaultAuthority), currSigners);
            newStores.push(newStoreAccount.toBase58());
            const transferAuthority = approve(currInstructions, [], (0, common_1.toPublicKey)(nft.box.tokenAccount), wallet.publicKey, nft.box.amount.toNumber());
            currSigners.push(transferAuthority);
            await addTokenToInactiveVault(nft.draft.masterEdition &&
                nft.draft.masterEdition.info.key === common_1.MetadataKey.MasterEditionV2
                ? new bn_js_1.default(1)
                : nft.box.amount, nft.box.tokenMint, nft.box.tokenAccount, newStoreAccount.toBase58(), vault, wallet.publicKey.toBase58(), wallet.publicKey.toBase58(), transferAuthority.publicKey.toBase58(), currInstructions);
            if (batchCounter === BATCH_SIZE) {
                signers.push(currSigners);
                instructions.push(currInstructions);
                batchCounter = 0;
                currSigners = [];
                currInstructions = [];
            }
            batchCounter++;
        }
    }
    if (instructions[instructions.length - 1] !== currInstructions) {
        signers.push(currSigners);
        instructions.push(currInstructions);
    }
    return { signers, instructions, safetyDepositTokenStores: newStores };
}
exports.addTokensToVault = addTokensToVault;
//# sourceMappingURL=addTokensToVault.js.map