"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setVaultAndAuctionAuthorities = void 0;
const common_1 = require("@oyster/common");
const wallet_adapter_base_1 = require("@solana/wallet-adapter-base");
// This command sets the authorities on the vault and auction to be the newly created auction manager.
async function setVaultAndAuctionAuthorities(wallet, vault, auction, auctionManager) {
    if (!wallet.publicKey)
        throw new wallet_adapter_base_1.WalletNotConnectedError();
    let signers = [];
    let instructions = [];
    await (0, common_1.setAuctionAuthority)(auction, wallet.publicKey.toBase58(), auctionManager, instructions);
    await (0, common_1.setVaultAuthority)(vault, wallet.publicKey.toBase58(), auctionManager, instructions);
    return { instructions, signers };
}
exports.setVaultAndAuctionAuthorities = setVaultAndAuctionAuthorities;
//# sourceMappingURL=setVaultAndAuctionAuthorities.js.map