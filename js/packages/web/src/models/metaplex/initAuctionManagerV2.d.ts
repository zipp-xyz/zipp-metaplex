import { StringPublicKey } from '@oyster/common';
import { TransactionInstruction } from '@solana/web3.js';
import BN from 'bn.js';
import { TupleNumericType } from '.';
export declare function initAuctionManagerV2(vault: StringPublicKey, auctionManagerAuthority: StringPublicKey, payer: StringPublicKey, acceptPaymentAccount: StringPublicKey, store: StringPublicKey, amountType: TupleNumericType, lengthType: TupleNumericType, maxRanges: BN, instructions: TransactionInstruction[]): Promise<void>;
//# sourceMappingURL=initAuctionManagerV2.d.ts.map