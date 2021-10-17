import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  formatTokenAmount,
  CountdownState,
  PriceFloorType,
  fromLamports,
  useMint,
} from '@oyster/common';
import {
  AuctionView,
  AuctionViewState,
  useArt,
  useBidsForAuction,
} from 'hooks';
import { AmountLabel, ArtContentNew, HoverCard } from 'components';
import { useHighestBidForAuction } from 'hooks';
import { BN } from 'bn.js';
import { Flex } from '@chakra-ui/react';

export interface AuctionCardNew {
  auctionView: AuctionView;
  to?: string;
  onClick?: () => void;
}

export const AuctionRenderCardNew = (props: AuctionCardNew, ...otherProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const { auctionView, onClick, to } = props;
  const id = auctionView.thumbnail.metadata.pubkey;
  const art = useArt(id);
  const name = art?.title || ' ';
  const [state, setState] = useState<CountdownState>();
  const bids = useBidsForAuction(auctionView.auction.pubkey);
  const mintInfo = useMint(auctionView.auction.info.tokenMint);

  const participationFixedPrice =
    auctionView.auctionManager.participationConfig?.fixedPrice || 0;
  const participationOnly = auctionView.auctionManager.numWinners.eq(new BN(0));
  const priceFloor =
    auctionView.auction.info.priceFloor.type === PriceFloorType.Minimum
      ? auctionView.auction.info.priceFloor.minPrice?.toNumber() || 0
      : 0;
  const isUpcoming = auctionView.state === AuctionViewState.Upcoming;

  const winningBid = useHighestBidForAuction(auctionView.auction.pubkey);
  const ended =
    state?.hours === 0 && state?.minutes === 0 && state?.seconds === 0;

  let currentBid: number | string = 0;
  let label = '';
  if (isUpcoming || bids) {
    label = ended ? 'Ended' : 'Starting bid';
    currentBid = fromLamports(
      participationOnly ? participationFixedPrice : priceFloor,
      mintInfo,
    );
  }

  if (!isUpcoming && bids.length > 0) {
    label = ended ? 'Winning bid' : 'Current bid';
    currentBid =
      winningBid && Number.isFinite(winningBid.info.lastBid?.toNumber())
        ? formatTokenAmount(winningBid.info.lastBid)
        : 'No Bid';
  }

  const auction = auctionView.auction.info;
  useEffect(() => {
    const calc = () => {
      setState(auction.timeToEnd());
    };

    const interval = setInterval(() => {
      calc();
    }, 5000);

    calc();
    return () => clearInterval(interval);
  }, [auction, setState]);

  const card = (
    <HoverCard
      width={300}
      height={300}
      m={2}
      p={0}
      borderRadius={10}
      overflow="hidden"
      dropShadow="3px"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      isHovering={isHovering}
      {...otherProps}
    >
      <Flex
        width="100%"
        height="75%"
        // backgroundImage={`url(${image})`}
        backgroundPosition="center"
        backgroundSize="cover"
        overflow="hidden"
        position="relative"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        flexGrow={1}
      >
        <ArtContentNew
          pubkey={id}
          // uri={image}
          // animationURL={animationURL}
          // category={category}
          // preview={preview}
          // height={height}
          // width={width}
        />
      </Flex>
      <Link to={to || ''}>
        <AmountLabel
          bg="offblack"
          fontStyle={{ color: 'white' }}
          title={name && name.length > 0 && name}
          label={label}
          amount={currentBid}
        />
      </Link>
    </HoverCard>
  );

  return card;
};
