import { Keypair, Connection, TransactionInstruction } from '@solana/web3.js';
import { StringPublicKey, WalletSigner } from '@oyster/common';
export declare function createExternalPriceAccount(connection: Connection, wallet: WalletSigner): Promise<{
    priceMint: StringPublicKey;
    externalPriceAccount: StringPublicKey;
    instructions: TransactionInstruction[];
    signers: Keypair[];
}>;
//# sourceMappingURL=createExternalPriceAccount.d.ts.map