import { Keypair, Connection, TransactionInstruction } from '@solana/web3.js';
import { WalletSigner } from '@oyster/common';
import { SafetyDepositInstructionTemplate } from './addTokensToVault';
export declare function deprecatedPopulatePrintingTokens(connection: Connection, wallet: WalletSigner, safetyDepositConfigs: SafetyDepositInstructionTemplate[]): Promise<{
    instructions: Array<TransactionInstruction[]>;
    signers: Array<Keypair[]>;
    safetyDepositConfigs: SafetyDepositInstructionTemplate[];
}>;
//# sourceMappingURL=deprecatedPopulatePrintingTokens.d.ts.map