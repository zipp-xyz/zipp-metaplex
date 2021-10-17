import { StringPublicKey } from '@oyster/common';
import { TransactionInstruction } from '@solana/web3.js';
export declare function redeemBid(vault: StringPublicKey, safetyDepositTokenStore: StringPublicKey, destination: StringPublicKey, safetyDeposit: StringPublicKey, fractionMint: StringPublicKey, bidder: StringPublicKey, payer: StringPublicKey, masterEdition: StringPublicKey | undefined, reservationList: StringPublicKey | undefined, isPrintingType: boolean, instructions: TransactionInstruction[], auctioneerReclaimIndex?: number): Promise<void>;
//# sourceMappingURL=redeemBid.d.ts.map