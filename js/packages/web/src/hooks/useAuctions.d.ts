import { ParsedAccount, Metadata, SafetyDepositBox, AuctionData, BidderMetadata, BidderPot, Vault, MasterEditionV1, MasterEditionV2, StringPublicKey } from '@oyster/common';
import BN from 'bn.js';
import { AuctionManager, AuctionManagerV2, BidRedemptionTicket, BidRedemptionTicketV2, SafetyDepositConfig, WinningConfigType } from '../models/metaplex';
import { AuctionManagerV1 } from '../models/metaplex/deprecatedStates';
export declare enum AuctionViewState {
    Live = "0",
    Upcoming = "1",
    Ended = "2",
    BuyNow = "3",
    Defective = "-1"
}
export interface AuctionViewItem {
    winningConfigType: WinningConfigType;
    amount: BN;
    metadata: ParsedAccount<Metadata>;
    safetyDeposit: ParsedAccount<SafetyDepositBox>;
    masterEdition?: ParsedAccount<MasterEditionV1 | MasterEditionV2>;
}
export interface AuctionView {
    items: AuctionViewItem[][];
    safetyDepositBoxes: ParsedAccount<SafetyDepositBox>[];
    auction: ParsedAccount<AuctionData>;
    auctionManager: AuctionManager;
    participationItem?: AuctionViewItem;
    state: AuctionViewState;
    thumbnail: AuctionViewItem;
    myBidderMetadata?: ParsedAccount<BidderMetadata>;
    myBidderPot?: ParsedAccount<BidderPot>;
    myBidRedemption?: ParsedAccount<BidRedemptionTicket>;
    vault: ParsedAccount<Vault>;
    totallyComplete: boolean;
}
export declare function useCachedRedemptionKeysByWallet(): Record<string, ParsedAccount<BidRedemptionTicket> | {
    pubkey: StringPublicKey;
    info: null;
}>;
export declare const useAuctions: (state?: AuctionViewState | undefined) => AuctionView[];
export declare function processAccountsIntoAuctionView(walletPubkey: StringPublicKey | null | undefined, auction: ParsedAccount<AuctionData>, auctionManagersByAuction: Record<string, ParsedAccount<AuctionManagerV1 | AuctionManagerV2>>, safetyDepositBoxesByVaultAndIndex: Record<string, ParsedAccount<SafetyDepositBox>>, metadataByMint: Record<string, ParsedAccount<Metadata>>, bidderMetadataByAuctionAndBidder: Record<string, ParsedAccount<BidderMetadata>>, bidderPotsByAuctionAndBidder: Record<string, ParsedAccount<BidderPot>>, bidRedemptionV2sByAuctionManagerAndWinningIndex: Record<string, ParsedAccount<BidRedemptionTicketV2>>, masterEditions: Record<string, ParsedAccount<MasterEditionV1 | MasterEditionV2>>, vaults: Record<string, ParsedAccount<Vault>>, safetyDepositConfigsByAuctionManagerAndIndex: Record<string, ParsedAccount<SafetyDepositConfig>>, masterEditionsByPrintingMint: Record<string, ParsedAccount<MasterEditionV1>>, masterEditionsByOneTimeAuthMint: Record<string, ParsedAccount<MasterEditionV1>>, metadataByMasterEdition: Record<string, ParsedAccount<Metadata>>, cachedRedemptionKeysByWallet: Record<string, ParsedAccount<BidRedemptionTicket> | {
    pubkey: StringPublicKey;
    info: null;
}>, desiredState: AuctionViewState | undefined, existingAuctionView?: AuctionView): AuctionView | undefined;
//# sourceMappingURL=useAuctions.d.ts.map