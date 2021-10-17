import { AuctionCategory } from './types';
import { Heading } from 'components';
import { Button, SimpleGrid, Box, Flex } from '@chakra-ui/react';

const contents = [
  {
    heading: 'Limited Edition',
    label: 'Sell a limited copy or copies of a single Master NFT',
    category: AuctionCategory.Limited,
  },
  {
    heading: 'Open Edition',
    label: 'Sell unlimited copies of a single Master NFT',
    category: AuctionCategory.Open,
  },
  {
    heading: 'Tiered Auction',
    label: 'Participants get unique rewards based on their leaderboard rank',
    category: AuctionCategory.Tiered,
  },
  {
    heading: 'Sell an Existing Item',
    label:
      'Sell an existing item in your NFT collection, including Master NFTs',
    category: AuctionCategory.Single,
  },
];

const Category = (props: { confirm: (category: AuctionCategory) => void }) => {
  return (
    <>
      <SimpleGrid columns={2} spacing={6}>
        {contents.map((item, i) => {
          return (
            <Flex
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              border="1px"
              borderRadius="10px"
              cursor="pointer"
              key={i}
              my={3}
              height={100}
              variant="outline"
              size="lg"
              onClick={() => props.confirm(item.category)}
            >
              <Heading>{item.heading}</Heading>
              {item.label}
            </Flex>
          );
        })}
      </SimpleGrid>
    </>
  );
};

export default Category;
