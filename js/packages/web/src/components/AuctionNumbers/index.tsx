import React, { useEffect, useState } from 'react';
import { Row, Col } from 'antd';
import { VStack, HStack, Flex, Text } from '@chakra-ui/react';

import {
  formatTokenAmount,
  useMint,
  fromLamports,
  CountdownState,
  PriceFloorType,
} from '@oyster/common';
import { AuctionView, AuctionViewState, useBidsForAuction } from '../../hooks';
import { AmountLabel } from 'components';

export const AuctionNumbers = (props: { auctionView: AuctionView }) => {
  const { auctionView } = props;
  const bids = useBidsForAuction(auctionView.auction.pubkey);
  const mintInfo = useMint(auctionView.auction.info.tokenMint);

  const participationFixedPrice =
    auctionView.auctionManager.participationConfig?.fixedPrice || 0;
  const participationOnly =
    auctionView.auctionManager.numWinners.toNumber() === 0;
  const priceFloor =
    auctionView.auction.info.priceFloor.type === PriceFloorType.Minimum
      ? auctionView.auction.info.priceFloor.minPrice?.toNumber() || 0
      : 0;
  const isUpcoming = auctionView.state === AuctionViewState.Upcoming;
  const isStarted = auctionView.state === AuctionViewState.Live;

  const [state, setState] = useState<CountdownState>();

  const auction = auctionView.auction.info;
  useEffect(() => {
    const calc = () => {
      const newState = auction.timeToEnd();

      setState(newState);
    };

    const interval = setInterval(() => {
      calc();
    }, 1000);

    calc();
    return () => clearInterval(interval);
  }, [auction]);

  const ended = isEnded(state);

  return (
    <Flex flexDirection="column" width="100%">
      {!ended && (
        <>
          {(isUpcoming || bids.length === 0) && (
            <AmountLabel
              containerStyle={{ flexDirection: 'column' }}
              title="Starting bid"
              amount={fromLamports(
                participationOnly ? participationFixedPrice : priceFloor,
                mintInfo,
              )}
            />
          )}
          {isStarted && bids.length > 0 && (
            <AmountLabel
              containerStyle={{ flexDirection: 'column' }}
              title="Highest bid"
              amount={formatTokenAmount(bids[0].info.lastBid, mintInfo)}
            />
          )}
        </>
      )}
      <Countdown state={state} />
    </Flex>
  );
};

const isEnded = (state?: CountdownState) =>
  state?.days === 0 &&
  state?.hours === 0 &&
  state?.minutes === 0 &&
  state?.seconds === 0;

const Countdown = ({ state }: { state?: CountdownState }) => {
  return (
    <HStack p={2} spacing={0}>
      <VStack flex={1} alignItems="flex-start">
        <Text fontSize="lg">Time left</Text>
      </VStack>
      <HStack>
        {state &&
          (isEnded(state) ? (
            <Text fontSize="lg">This auction has ended</Text>
          ) : (
            <>
              {state && state.days > 0 && (
                <VStack alignItems="center" spacing={0}>
                  <Text fontSize={42}>
                    {state.days < 10 && <span style={{ opacity: 0.2 }}>0</span>}
                    {state.days}
                    <span style={{ opacity: 0.2 }}>:</span>
                  </Text>
                  <Text>days</Text>
                </VStack>
              )}
              <VStack alignItems="center" spacing={0}>
                <Text fontSize={42}>
                  {state.hours < 10 && <span style={{ opacity: 0.2 }}>0</span>}
                  {state.hours}
                  <span style={{ opacity: 0.2 }}>:</span>
                </Text>
                <Text>hours</Text>
              </VStack>
              <VStack alignItems="center" spacing={0}>
                <Text fontSize={42}>
                  {state.minutes < 10 && (
                    <span style={{ opacity: 0.2 }}>0</span>
                  )}
                  {state.minutes}
                  {state.days === 0 && <span style={{ opacity: 0.2 }}>:</span>}
                </Text>
                <Text>mins</Text>
              </VStack>
              {!state.days && (
                <VStack alignItems="center" spacing={0}>
                  <Text fontSize={42}>
                    {state.seconds < 10 && (
                      <span style={{ opacity: 0.2 }}>0</span>
                    )}
                    {state.seconds}
                  </Text>
                  <Text>secs</Text>
                </VStack>
              )}
            </>
          ))}
      </HStack>
    </HStack>
  );
};
