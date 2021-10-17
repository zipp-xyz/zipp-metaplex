import { Keypair, TransactionInstruction } from '@solana/web3.js';
import { WalletSigner } from '@oyster/common';
import { SafetyDepositDraft } from './createAuctionManager';
export declare function markItemsThatArentMineAsSold(wallet: WalletSigner, safetyDepositDrafts: SafetyDepositDraft[]): Promise<{
    instructions: TransactionInstruction[][];
    signers: Keypair[][];
}>;
//# sourceMappingURL=markItemsThatArentMineAsSold.d.ts.map