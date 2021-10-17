import { Keypair, TransactionInstruction } from '@solana/web3.js';
import { StringPublicKey, WalletSigner } from '@oyster/common';
export declare function setVaultAndAuctionAuthorities(wallet: WalletSigner, vault: StringPublicKey, auction: StringPublicKey, auctionManager: StringPublicKey): Promise<{
    instructions: TransactionInstruction[];
    signers: Keypair[];
}>;
//# sourceMappingURL=setVaultAndAuctionAuthorities.d.ts.map