import { Keypair, Connection, TransactionInstruction } from '@solana/web3.js';
import { StringPublicKey, WalletSigner } from '@oyster/common';
export declare function closeVault(connection: Connection, wallet: WalletSigner, vault: StringPublicKey, fractionMint: StringPublicKey, fractionTreasury: StringPublicKey, redeemTreasury: StringPublicKey, priceMint: StringPublicKey, externalPriceAccount: StringPublicKey): Promise<{
    instructions: TransactionInstruction[];
    signers: Keypair[];
}>;
//# sourceMappingURL=closeVault.d.ts.map