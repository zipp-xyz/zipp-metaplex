import { Connection } from '@solana/web3.js';
import { Metadata, ParsedAccount, MasterEditionV1, MasterEditionV2, Edition, IPartialCreateAuctionArgs, StringPublicKey, WalletSigner } from '@oyster/common';
import { WinningConfigType, WhitelistedCreator, AmountRange, ParticipationConfigV2 } from '../models/metaplex';
export interface SafetyDepositDraft {
    metadata: ParsedAccount<Metadata>;
    masterEdition?: ParsedAccount<MasterEditionV1 | MasterEditionV2>;
    edition?: ParsedAccount<Edition>;
    holding: StringPublicKey;
    printingMintHolding?: StringPublicKey;
    winningConfigType: WinningConfigType;
    amountRanges: AmountRange[];
    participationConfig?: ParticipationConfigV2;
}
export declare function createAuctionManager(connection: Connection, wallet: WalletSigner, whitelistedCreatorsByCreator: Record<string, ParsedAccount<WhitelistedCreator>>, auctionSettings: IPartialCreateAuctionArgs, safetyDepositDrafts: SafetyDepositDraft[], participationSafetyDepositDraft: SafetyDepositDraft | undefined, paymentMint: StringPublicKey): Promise<{
    vault: StringPublicKey;
    auction: StringPublicKey;
    auctionManager: StringPublicKey;
}>;
//# sourceMappingURL=createAuctionManager.d.ts.map