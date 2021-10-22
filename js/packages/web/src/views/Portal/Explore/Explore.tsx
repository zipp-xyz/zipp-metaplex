import { useWallet } from '@solana/wallet-adapter-react';
import BN from 'bn.js';
import React, { useMemo, useState } from 'react';
import {
  AuctionRenderCardNew,
  CardLoader,
  FeaturedAuction,
  Title,
} from 'components';
// import { PreSaleBanner } from 'components/PreSaleBanner';
import { useMeta } from 'contexts';
import { AuctionView, AuctionViewState, useAuctions } from 'hooks';
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
  Text,
  SimpleGrid,
  Flex,
  CircularProgress,
} from '@chakra-ui/react';
import { constants } from 'node:buffer';

export enum LiveAuctionViewState {
  All = '0',
  Participated = '1',
  Ended = '2',
  Resale = '3',
}

export const Explore = () => {
  const auctions = useAuctions(AuctionViewState.Live);
  const auctionsEnded = useAuctions(AuctionViewState.Ended);
  // const [activeKey, setActiveKey] = useState(LiveAuctionViewState.All);
  const [activeIndex, setActiveIndex] = useState(2);
  const { isLoading } = useMeta();
  const { connected, publicKey } = useWallet();
  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  // Check if the auction is primary sale or not
  const checkPrimarySale = (auc: AuctionView) => {
    var flag = 0;
    auc.items.forEach(i => {
      i.forEach(j => {
        if (j.metadata.info.primarySaleHappened == true) {
          flag = 1;
          return true;
        }
      });
      if (flag == 1) return true;
    });
    if (flag == 1) return true;
    else return false;
  };

  const resaleAuctions = auctions
    .sort(
      (a, b) =>
        a.auction.info.endedAt
          ?.sub(b.auction.info.endedAt || new BN(0))
          .toNumber() || 0,
    )
    .filter(m => checkPrimarySale(m) == true);

  // Removed resales from live auctions
  const liveAuctions = auctions
    .sort(
      (a, b) =>
        a.auction.info.endedAt
          ?.sub(b.auction.info.endedAt || new BN(0))
          .toNumber() || 0,
    )
    .filter(a => !resaleAuctions.includes(a));

  const items = liveAuctions;

  const heroAuction = useMemo(
    () =>
      auctions.filter(a => {
        // const now = moment().unix();
        return !a.auction.info.ended() && !resaleAuctions.includes(a);
        // filter out auction for banner that are further than 30 days in the future
        // return Math.floor(delta / 86400) <= 30;
      })?.[0],
    [auctions],
  );

  const liveAuctionsView = (
    <>
      {!isLoading
        ? items.map((m, idx) => {
            // ENABLE HERO AUCTION HERE
            if (m === heroAuction) {
              return;
            }

            const id = m.auction.pubkey;
            return (
              <AuctionRenderCardNew
                key={id}
                auctionView={m}
                to={`/portal/auction/${id}`}
              />
            );
          })
        : [...Array(9)].map((_, idx) => (
            <Flex
              height={300}
              width={300}
              justifyContent="center"
              alignItems="center"
              key={idx}
            >
              <CircularProgress isIndeterminate color="grey" />
            </Flex>
          ))}
    </>
  );
  const endedAuctions = (
    <>
      {!isLoading
        ? auctionsEnded.map((m, idx) => {
            if (m === heroAuction) {
              return;
            }

            const id = m.auction.pubkey;
            return (
              <AuctionRenderCardNew
                key={id}
                auctionView={m}
                to={`/portal/auction/${id}`}
              />
            );
          })
        : [...Array(10)].map((_, idx) => <CardLoader key={idx} />)}
    </>
  );

  return (
    <VStack flexGrow={1} spacing={10}>
      {heroAuction && (
        <>
          <Title>Featured</Title>
          <FeaturedAuction auction={heroAuction} />
        </>
      )}
      <Title>Explore</Title>
      {liveAuctions.length >= 0 && (
        <Tabs
          // activeKey={activeKey}
          isFitted
          index={activeIndex}
          onChange={index => setActiveIndex(index)}
          width="100%"
        >
          <TabList>
            <Tab>Live Auctions</Tab>
            <Tab>Secondary Marketplace</Tab>
            <Tab>Ended Auctions</Tab>
            {connected && <Tab>Participated</Tab>}
          </TabList>
          <TabPanels>
            <TabPanel>
              <SimpleGrid columns={3}>{liveAuctionsView}</SimpleGrid>
            </TabPanel>
            {auctionsEnded.length > 0 && (
              <TabPanel>
                <SimpleGrid columns={3}>{liveAuctionsView}</SimpleGrid>
              </TabPanel>
            )}
            {auctionsEnded.length > 0 && (
              <TabPanel>
                <SimpleGrid columns={3}>{endedAuctions}</SimpleGrid>
              </TabPanel>
            )}
            {
              // Show all participated live and ended auctions except hero auction
            }
            {connected && (
              <TabPanel
              // key={LiveAuctionViewState.Participated}
              >
                <SimpleGrid columns={3}>{liveAuctionsView}</SimpleGrid>
              </TabPanel>
            )}
          </TabPanels>
        </Tabs>
      )}
    </VStack>
  );
};
