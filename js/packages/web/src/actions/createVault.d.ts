import { Keypair, Connection, TransactionInstruction } from '@solana/web3.js';
import { StringPublicKey, WalletSigner } from '@oyster/common';
export declare function createVault(connection: Connection, wallet: WalletSigner, priceMint: StringPublicKey, externalPriceAccount: StringPublicKey): Promise<{
    vault: StringPublicKey;
    fractionalMint: StringPublicKey;
    redeemTreasury: StringPublicKey;
    fractionTreasury: StringPublicKey;
    instructions: TransactionInstruction[];
    signers: Keypair[];
}>;
//# sourceMappingURL=createVault.d.ts.map