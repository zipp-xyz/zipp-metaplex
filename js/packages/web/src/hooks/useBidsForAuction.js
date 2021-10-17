"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBidsForAuction = exports.useHighestBidForAuction = void 0;
const react_1 = require("react");
const common_1 = require("@oyster/common");
const useHighestBidForAuction = (auctionPubkey) => {
    const bids = (0, exports.useBidsForAuction)(auctionPubkey);
    const winner = (0, react_1.useMemo)(() => {
        return bids === null || bids === void 0 ? void 0 : bids[0];
    }, [bids]);
    return winner;
};
exports.useHighestBidForAuction = useHighestBidForAuction;
const useBidsForAuction = (auctionPubkey) => {
    const id = (0, react_1.useMemo)(() => typeof auctionPubkey === 'string'
        ? auctionPubkey !== ''
            ? auctionPubkey
            : undefined
        : auctionPubkey, [auctionPubkey]);
    const [bids, setBids] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => {
        const dispose = common_1.cache.emitter.onCache(args => {
            if (args.parser === common_1.BidderMetadataParser) {
                setBids(getBids(id));
            }
        });
        setBids(getBids(id));
        return () => {
            dispose();
        };
    }, [id]);
    return bids;
};
exports.useBidsForAuction = useBidsForAuction;
const getBids = (id) => {
    return common_1.cache
        .byParser(common_1.BidderMetadataParser)
        .filter(key => {
        const bidder = common_1.cache.get(key);
        if (!bidder) {
            return false;
        }
        return id === bidder.info.auctionPubkey;
    })
        .map(key => {
        const bidder = common_1.cache.get(key);
        return bidder;
    })
        .sort((a, b) => {
        const lastBidDiff = b.info.lastBid.sub(a.info.lastBid).toNumber();
        if (lastBidDiff === 0) {
            return a.info.lastBidTimestamp.sub(b.info.lastBidTimestamp).toNumber();
        }
        return lastBidDiff;
    })
        .map(item => {
        return item;
    });
};
//# sourceMappingURL=useBidsForAuction.js.map