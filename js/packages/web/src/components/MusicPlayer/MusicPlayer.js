import { useMemo } from 'react';
import {
  Box,
  CircularProgress,
  Image,
  Flex,
  Text,
  HStack,
  Button,
} from '@chakra-ui/react';
import { useArt, useExtendedArt } from 'hooks';
import { pubkeyToString } from 'utils/pubkeyToString';
import { Waveform, MetaAvatar } from 'components';
import { shortenAddress } from '@oyster/common';

export const MusicPlayer = ({ pubkey }) => {
  const id = pubkeyToString(pubkey);
  const art = useArt(pubkey);
  const { ref, data } = useExtendedArt(id);
  const isLoading = useMemo(() => !data || !art, [art, data]);

  const imageFile = useMemo(() => data && data.properties.files[0].uri, [data]);
  const audioFile = useMemo(() => data && data.properties.files[1].uri, [data]);
  const audioTitle = useMemo(() => data && data.name, [data]);

  return (
    <Box ref={ref} width="100%" bg="offblack" p={6} borderRadius={12}>
      {isLoading ? (
        <Flex justifyContent="center" minHeight="250px" alignItems="center">
          <CircularProgress isIndeterminate color="neonGreen" />
        </Flex>
      ) : (
        <Flex flexGrow={1}>
          <Image
            src={imageFile}
            width="250px"
            height="250px"
            objectFit="cover"
            borderRadius={6}
            fallbackSrc="https://stefan-kovac-random.s3.us-east-2.amazonaws.com/fallback-image.png"
            transition="0.3s ease-in-out"
            boxShadow="rgb(0, 0, 0) 0px 4px 12px;"
            _hover={{
              // opacity: 0.75,
              transform: 'translateY(-1px)',
              boxShadow: 'rgb(0, 0, 0) 0px 6px 16px;',
            }}
          />
          <Flex flexDirection="column" alignItems="center" flex={1}>
            <Text
              as="h1"
              fontSize="4xl"
              textTransform="capitalize"
              fontFamily="JetBrains Mono"
            >
              {audioTitle}
            </Text>
            <Waveform
              url={audioFile}
              creatorBadge={(art.creators || []).map((creator, idx) => {
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
            />
          </Flex>
        </Flex>
      )}
    </Box>
  );
};
