"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redeemFullRightsTransferBid = void 0;
const common_1 = require("@oyster/common");
const web3_js_1 = require("@solana/web3.js");
const borsh_1 = require("borsh");
const _1 = require(".");
async function redeemFullRightsTransferBid(vault, safetyDepositTokenStore, destination, safetyDeposit, fractionMint, bidder, payer, instructions, masterMetadata, newAuthority, 
// If this is an auctioneer trying to reclaim a specific winning index, pass it here,
// and this will instead call the proxy route instead of the real one, wrapping the original
// redemption call in an override call that forces the winning index if the auctioneer is authorized.
auctioneerReclaimIndex) {
    const PROGRAM_IDS = (0, common_1.programIds)();
    const store = PROGRAM_IDS.store;
    if (!store) {
        throw new Error('Store not initialized');
    }
    const { auctionKey, auctionManagerKey } = await (0, _1.getAuctionKeys)(vault);
    const { bidRedemption, bidMetadata } = await (0, _1.getBidderKeys)(auctionKey, bidder);
    const transferAuthority = (await (0, common_1.findProgramAddress)([
        Buffer.from(common_1.VAULT_PREFIX),
        (0, common_1.toPublicKey)(PROGRAM_IDS.vault).toBuffer(),
        (0, common_1.toPublicKey)(vault).toBuffer(),
    ], (0, common_1.toPublicKey)(PROGRAM_IDS.vault)))[0];
    const safetyDepositConfig = await (0, _1.getSafetyDepositConfig)(auctionManagerKey, safetyDeposit);
    const value = auctioneerReclaimIndex !== undefined
        ? new _1.RedeemUnusedWinningConfigItemsAsAuctioneerArgs({
            winningConfigItemIndex: auctioneerReclaimIndex,
            proxyCall: _1.ProxyCallAddress.RedeemFullRightsTransferBid,
        })
        : new _1.RedeemFullRightsTransferBidArgs();
    const data = Buffer.from((0, borsh_1.serialize)(_1.SCHEMA, value));
    const keys = [
        {
            pubkey: (0, common_1.toPublicKey)(auctionManagerKey),
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: (0, common_1.toPublicKey)(safetyDepositTokenStore),
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: (0, common_1.toPublicKey)(destination),
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: (0, common_1.toPublicKey)(bidRedemption),
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: (0, common_1.toPublicKey)(safetyDeposit),
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: (0, common_1.toPublicKey)(vault),
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: (0, common_1.toPublicKey)(fractionMint),
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: (0, common_1.toPublicKey)(auctionKey),
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: (0, common_1.toPublicKey)(bidMetadata),
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: (0, common_1.toPublicKey)(bidder),
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: (0, common_1.toPublicKey)(payer),
            isSigner: true,
            isWritable: false,
        },
        {
            pubkey: PROGRAM_IDS.token,
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: (0, common_1.toPublicKey)(PROGRAM_IDS.vault),
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: (0, common_1.toPublicKey)(PROGRAM_IDS.metadata),
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: store,
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: web3_js_1.SystemProgram.programId,
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: web3_js_1.SYSVAR_RENT_PUBKEY,
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: (0, common_1.toPublicKey)(masterMetadata),
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: (0, common_1.toPublicKey)(newAuthority),
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: (0, common_1.toPublicKey)(transferAuthority),
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: (0, common_1.toPublicKey)(safetyDepositConfig),
            isSigner: false,
            isWritable: false,
        },
    ];
    instructions.push(new web3_js_1.TransactionInstruction({
        keys,
        programId: (0, common_1.toPublicKey)(PROGRAM_IDS.metaplex),
        data,
    }));
}
exports.redeemFullRightsTransferBid = redeemFullRightsTransferBid;
//# sourceMappingURL=redeemFullRightsTransferBid.js.map