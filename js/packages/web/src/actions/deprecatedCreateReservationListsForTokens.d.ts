import { Keypair, TransactionInstruction } from '@solana/web3.js';
import { StringPublicKey, WalletSigner } from '@oyster/common';
import { SafetyDepositInstructionTemplate } from './addTokensToVault';
export declare function deprecatedCreateReservationListForTokens(wallet: WalletSigner, auctionManager: StringPublicKey, safetyDepositInstructionTemplates: SafetyDepositInstructionTemplate[]): Promise<{
    instructions: Array<TransactionInstruction[]>;
    signers: Array<Keypair[]>;
}>;
//# sourceMappingURL=deprecatedCreateReservationListsForTokens.d.ts.map