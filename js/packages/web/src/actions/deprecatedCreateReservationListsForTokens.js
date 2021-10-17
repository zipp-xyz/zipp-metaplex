"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deprecatedCreateReservationListForTokens = void 0;
const common_1 = require("@oyster/common");
const wallet_adapter_base_1 = require("@solana/wallet-adapter-base");
const metaplex_1 = require("../models/metaplex");
const BATCH_SIZE = 10;
// This command batches out creating reservation lists for those tokens who are being sold in PrintingV1 mode.
// Reservation lists are used to insure printing order among limited editions.
async function deprecatedCreateReservationListForTokens(wallet, auctionManager, safetyDepositInstructionTemplates) {
    if (!wallet.publicKey)
        throw new wallet_adapter_base_1.WalletNotConnectedError();
    let batchCounter = 0;
    let signers = [];
    let instructions = [];
    let currSigners = [];
    let currInstructions = [];
    for (let i = 0; i < safetyDepositInstructionTemplates.length; i++) {
        const safetyDeposit = safetyDepositInstructionTemplates[i];
        if (safetyDeposit.config.winningConfigType === metaplex_1.WinningConfigType.PrintingV1 &&
            safetyDeposit.draft.masterEdition)
            await (0, common_1.deprecatedCreateReservationList)(safetyDeposit.draft.metadata.pubkey, safetyDeposit.draft.masterEdition.pubkey, auctionManager, wallet.publicKey.toBase58(), wallet.publicKey.toBase58(), currInstructions);
        if (batchCounter === BATCH_SIZE) {
            signers.push(currSigners);
            instructions.push(currInstructions);
            batchCounter = 0;
            currSigners = [];
            currInstructions = [];
        }
        batchCounter++;
    }
    if (instructions[instructions.length - 1] !== currInstructions) {
        signers.push(currSigners);
        instructions.push(currInstructions);
    }
    return { signers, instructions };
}
exports.deprecatedCreateReservationListForTokens = deprecatedCreateReservationListForTokens;
//# sourceMappingURL=deprecatedCreateReservationListsForTokens.js.map