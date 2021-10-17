import React, { useEffect, useState, useMemo } from 'react';
import { MusicCard, Title } from 'components';
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
import { Link } from 'react-router-dom';
import { useCreatorArts, useUserArts } from 'hooks';
import { useMeta } from 'contexts';
import { useWallet } from '@solana/wallet-adapter-react';

export enum ArtworkViewState {
  Metaplex = '0',
  Owned = '1',
  Created = '2',
}

export const Artworks = () => {
  const { connected, publicKey } = useWallet();
  const ownedMetadata = useUserArts();
  const createdMetadata = useCreatorArts(publicKey?.toBase58() || '');
  const { metadata, isLoading } = useMeta();
  // const [activeKey, setActiveKey] = useState(ArtworkViewState.Metaplex);

  const [activeIndex, setActiveIndex] = useState(0);

  const items =
    activeIndex === 1
      ? ownedMetadata.map(m => m.metadata)
      : activeIndex === 2
      ? createdMetadata
      : metadata;

  useEffect(() => {
    if (connected) {
      setActiveIndex(0);
    } else {
      setActiveIndex(1);
    }
  }, [connected, setActiveIndex]);

  const artworkGrid = useMemo(
    () => (
      <>
        {!isLoading
          ? items.map((m, idx) => {
              const id = m.pubkey;
              return (
                <MusicCard
                  key={id}
                  pubkey={m.pubkey}
                  to={`/portal/art/${id}`}
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
    ),
    [items],
  );

  return (
    <VStack flexGrow={1} spacing={10}>
      <Title
        fontFamily="JetBrains Mono"
        fontSize={48}
        color="black"
        textAlign="center"
      >
        Audio
      </Title>
      <Tabs onChange={index => setActiveIndex(index)} isFitted width="100%">
        <TabList>
          <Tab>All</Tab>
          {connected && <Tab>Owned</Tab>}
          {connected && <Tab>Created</Tab>}
        </TabList>
        <TabPanels>
          <TabPanel>
            <SimpleGrid columns={3}>{artworkGrid}</SimpleGrid>
          </TabPanel>
          {connected && (
            <TabPanel>
              <SimpleGrid columns={3}>{artworkGrid}</SimpleGrid>
            </TabPanel>
          )}
          {connected && (
            <TabPanel>
              <SimpleGrid columns={3}>{artworkGrid}</SimpleGrid>
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
    </VStack>
  );
};
