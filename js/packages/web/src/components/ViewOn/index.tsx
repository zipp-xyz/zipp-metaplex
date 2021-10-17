import React from 'react';
import { Flex, VStack, Text, Button } from '@chakra-ui/react';
import { useArt } from '../../hooks';
import { useConnectionConfig } from '@oyster/common';

export const ViewOn = ({ id }: { id: string }) => {
  const { env } = useConnectionConfig();
  const art = useArt(id);

  return (
    <Flex>
      <Button
        mr={2}
        my={0}
        size="sm"
        variant="outline"
        colorScheme="black"
        onClick={() => window.open(art.uri || '', '_blank')}
      >
        Arweave
      </Button>
      <Button
        my={0}
        size="sm"
        colorScheme="black"
        variant="outline"
        onClick={() =>
          window.open(
            `https://explorer.solana.com/account/${art?.mint || ''}${
              env.indexOf('main') >= 0 ? '' : `?cluster=${env}`
            }`,
            '_blank',
          )
        }
      >
        Solana
      </Button>
    </Flex>
  );
};
