import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Text,
  Box,
  Flex,
  CircularProgress,
  SimpleGrid,
  Button,
  HStack,
} from '@chakra-ui/react';
import { AuctionCard } from 'components/AuctionCard';
import { ArtContentNew, MetaAvatar } from 'components';
import { shortenAddress } from '@oyster/common';
import { sendSignMetadata } from 'actions/sendSignMetadata';
import { useArt, useExtendedArt } from 'hooks';

export const FeaturedAuction = ({ auction }) => {
  const isLoading = useMemo(() => !auction, [auction]);
  const art = useArt(auction.thumbnail.metadata.pubkey);
  const { ref, data } = useExtendedArt(auction.thumbnail.metadata.pubkey);

  return (
    <Box width="100%" bg="offblack" p={6} borderRadius={12} ref={ref}>
      {isLoading ? (
        <Flex justifyContent="center" minHeight="250px" alignItems="center">
          <CircularProgress isIndeterminate color="neonGreen" />
        </Flex>
      ) : (
        <Flex>
          <SimpleGrid columns={3} spacing={6}>
            <Flex
              width="300px"
              height="300px"
              backgroundPosition="center"
              backgroundSize="cover"
              overflow="hidden"
              position="relative"
              justifyContent="center"
              alignItems="center"
              flexGrow={1}
              borderRadius={6}
            >
              <ArtContentNew pubkey={auction.thumbnail.metadata.pubkey} />
            </Flex>
            <Flex
              flexDirection="column"
              flex={1}
              px={3}
              as={Link}
              to={`/portal/auction/${auction.auction.pubkey}`}
            >
              <Flex flex={1} flexDir="column" justifyContent="center" pb={8}>
                <Text color="white" fontSize="2xl" fontFamily="JetBrains Mono">
                  {art && art.title}
                </Text>
                <Text noOfLines={8}>{data && data.description}</Text>
              </Flex>

              {(art.creators || []).map((creator, idx) => {
                return (
                  <HStack m={1}>
                    <MetaAvatar creators={[creator]} />
                    <Text>
                      {creator.name || shortenAddress(creator.address || '')}
                    </Text>
                    {!creator.verified &&
                      (creator.address === pubkey ? (
                        <Button
                          onClick={async () => {
                            try {
                              await sendSignMetadata(connection, wallet, id);
                            } catch (e) {
                              console.error(e);
                              return false;
                            }
                            return true;
                          }}
                        >
                          Approve
                        </Button>
                      ) : (
                        tag
                      ))}
                  </HStack>
                );
              })}
            </Flex>
            <Box>
              <AuctionCard auctionView={auction} />
            </Box>
          </SimpleGrid>
          <Flex flexDirection="column" alignItems="center" flex={1}></Flex>
        </Flex>
      )}
    </Box>
  );
};
