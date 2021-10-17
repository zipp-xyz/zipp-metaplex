"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeAuction = void 0;
const common_1 = require("@oyster/common");
const wallet_adapter_base_1 = require("@solana/wallet-adapter-base");
const { AUCTION_PREFIX, createAuction } = common_1.actions;
// This command makes an auction
async function makeAuction(wallet, vault, auctionSettings) {
    if (!wallet.publicKey)
        throw new wallet_adapter_base_1.WalletNotConnectedError();
    const PROGRAM_IDS = common_1.utils.programIds();
    let signers = [];
    let instructions = [];
    const auctionKey = (await (0, common_1.findProgramAddress)([
        Buffer.from(AUCTION_PREFIX),
        (0, common_1.toPublicKey)(PROGRAM_IDS.auction).toBuffer(),
        (0, common_1.toPublicKey)(vault).toBuffer(),
    ], (0, common_1.toPublicKey)(PROGRAM_IDS.auction)))[0];
    const fullSettings = new common_1.CreateAuctionArgs({
        ...auctionSettings,
        authority: wallet.publicKey.toBase58(),
        resource: vault,
    });
    createAuction(fullSettings, wallet.publicKey.toBase58(), instructions);
    return { instructions, signers, auction: auctionKey };
}
exports.makeAuction = makeAuction;
//# sourceMappingURL=makeAuction.js.map