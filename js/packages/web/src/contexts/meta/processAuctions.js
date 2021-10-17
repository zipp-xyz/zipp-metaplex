"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processAuctions = void 0;
const common_1 = require("@oyster/common");
const processAuctions = ({ account, pubkey }, setter) => {
    if (!isAuctionAccount(account))
        return;
    try {
        const parsedAccount = common_1.cache.add(pubkey, account, common_1.AuctionParser, false);
        setter('auctions', pubkey, parsedAccount);
    }
    catch (e) {
        // ignore errors
        // add type as first byte for easier deserialization
    }
    try {
        if (isExtendedAuctionAccount(account)) {
            const parsedAccount = common_1.cache.add(pubkey, account, common_1.AuctionDataExtendedParser, false);
            setter('auctionDataExtended', pubkey, parsedAccount);
        }
    }
    catch {
        // ignore errors
        // add type as first byte for easier deserialization
    }
    try {
        if (isBidderMetadataAccount(account)) {
            const parsedAccount = common_1.cache.add(pubkey, account, common_1.BidderMetadataParser, false);
            setter('bidderMetadataByAuctionAndBidder', parsedAccount.info.auctionPubkey +
                '-' +
                parsedAccount.info.bidderPubkey, parsedAccount);
        }
    }
    catch {
        // ignore errors
        // add type as first byte for easier deserialization
    }
    try {
        if (isBidderPotAccount(account)) {
            const parsedAccount = common_1.cache.add(pubkey, account, common_1.BidderPotParser, false);
            setter('bidderPotsByAuctionAndBidder', parsedAccount.info.auctionAct + '-' + parsedAccount.info.bidderAct, parsedAccount);
        }
    }
    catch {
        // ignore errors
        // add type as first byte for easier deserialization
    }
};
exports.processAuctions = processAuctions;
const isAuctionAccount = account => account.owner === common_1.AUCTION_ID;
const isExtendedAuctionAccount = account => account.data.length === common_1.MAX_AUCTION_DATA_EXTENDED_SIZE;
const isBidderMetadataAccount = account => account.data.length === common_1.BIDDER_METADATA_LEN;
const isBidderPotAccount = account => account.data.length === common_1.BIDDER_POT_LEN;
//# sourceMappingURL=processAuctions.js.map