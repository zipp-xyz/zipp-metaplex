"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markItemsThatArentMineAsSold = void 0;
const common_1 = require("@oyster/common");
const wallet_adapter_base_1 = require("@solana/wallet-adapter-base");
const SALE_TRANSACTION_SIZE = 10;
async function markItemsThatArentMineAsSold(wallet, safetyDepositDrafts) {
    var _a;
    if (!wallet.publicKey)
        throw new wallet_adapter_base_1.WalletNotConnectedError();
    const publicKey = wallet.publicKey.toBase58();
    let signers = [];
    let instructions = [];
    let markSigners = [];
    let markInstructions = [];
    // TODO replace all this with payer account so user doesnt need to click approve several times.
    for (let i = 0; i < safetyDepositDrafts.length; i++) {
        const item = safetyDepositDrafts[i].metadata;
        if (!((_a = item.info.data.creators) === null || _a === void 0 ? void 0 : _a.find(c => c.address === publicKey)) &&
            !item.info.primarySaleHappened) {
            console.log('For token', item.info.data.name, 'marking it sold because i didnt make it but i want to keep proceeds');
            await (0, common_1.updatePrimarySaleHappenedViaToken)(item.pubkey, publicKey, safetyDepositDrafts[i].holding, markInstructions);
            if (markInstructions.length === SALE_TRANSACTION_SIZE) {
                signers.push(markSigners);
                instructions.push(markInstructions);
                markSigners = [];
                markInstructions = [];
            }
        }
    }
    if (markInstructions.length < SALE_TRANSACTION_SIZE &&
        markInstructions.length > 0) {
        signers.push(markSigners);
        instructions.push(markInstructions);
    }
    return { instructions, signers };
}
exports.markItemsThatArentMineAsSold = markItemsThatArentMineAsSold;
//# sourceMappingURL=markItemsThatArentMineAsSold.js.map