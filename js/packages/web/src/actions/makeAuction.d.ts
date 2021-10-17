import { Keypair, TransactionInstruction } from '@solana/web3.js';
import { IPartialCreateAuctionArgs, StringPublicKey, WalletSigner } from '@oyster/common';
export declare function makeAuction(wallet: WalletSigner, vault: StringPublicKey, auctionSettings: IPartialCreateAuctionArgs): Promise<{
    auction: StringPublicKey;
    instructions: TransactionInstruction[];
    signers: Keypair[];
}>;
//# sourceMappingURL=makeAuction.d.ts.map