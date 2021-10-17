import { StringPublicKey } from '@oyster/common';
import { TransactionInstruction } from '@solana/web3.js';
export declare function redeemFullRightsTransferBid(vault: StringPublicKey, safetyDepositTokenStore: StringPublicKey, destination: StringPublicKey, safetyDeposit: StringPublicKey, fractionMint: StringPublicKey, bidder: StringPublicKey, payer: StringPublicKey, instructions: TransactionInstruction[], masterMetadata: StringPublicKey, newAuthority: StringPublicKey, auctioneerReclaimIndex?: number): Promise<void>;
//# sourceMappingURL=redeemFullRightsTransferBid.d.ts.map