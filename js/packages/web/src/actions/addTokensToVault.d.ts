import { Keypair, Connection, TransactionInstruction } from '@solana/web3.js';
import { StringPublicKey, WalletSigner } from '@oyster/common';
import BN from 'bn.js';
import { SafetyDepositDraft } from './createAuctionManager';
import { SafetyDepositConfig } from '../models/metaplex';
export interface SafetyDepositInstructionTemplate {
    box: {
        tokenAccount?: StringPublicKey;
        tokenMint: StringPublicKey;
        amount: BN;
    };
    draft: SafetyDepositDraft;
    config: SafetyDepositConfig;
}
export declare function addTokensToVault(connection: Connection, wallet: WalletSigner, vault: StringPublicKey, nfts: SafetyDepositInstructionTemplate[]): Promise<{
    instructions: Array<TransactionInstruction[]>;
    signers: Array<Keypair[]>;
    safetyDepositTokenStores: StringPublicKey[];
}>;
//# sourceMappingURL=addTokensToVault.d.ts.map