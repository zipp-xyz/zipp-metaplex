import { useEffect, useState } from 'react';
import { MAX_METADATA_LEN } from '@oyster/common';
import { AuctionState } from './types';
import { Connection } from '@solana/web3.js';
import { MintLayout } from '@solana/spl-token';
import { Statistic, Spin } from 'antd';
import { MusicCard, AmountLabel, Heading } from 'components';
import moment from 'moment';
import { Button, Text, Spinner, VStack, Divider } from '@chakra-ui/react';

const Review = (props: {
  confirm: () => void;
  attributes: AuctionState;
  setAttributes: Function;
  connection: Connection;
}) => {
  const [cost, setCost] = useState(0);
  useEffect(() => {
    const rentCall = Promise.all([
      props.connection.getMinimumBalanceForRentExemption(MintLayout.span),
      props.connection.getMinimumBalanceForRentExemption(MAX_METADATA_LEN),
    ]);

    // TODO: add
  }, [setCost]);

  let item = props.attributes.items?.[0];

  return (
    <>
      <VStack mb={6}>
        <Heading>Review and list</Heading>
        <Text>Review your listing before publishing.</Text>
      </VStack>
      <VStack mb={6}>
        {item?.metadata.info && (
          <MusicCard pubkey={item.metadata.pubkey} small={true} />
        )}
      </VStack>
      <VStack mb={6}>
        <Heading>Copies</Heading>
        <Heading>
          {props.attributes.editions === undefined
            ? 'Unique'
            : props.attributes.editions}
        </Heading>
        {cost ? (
          <AmountLabel title="Cost to Create" amount={cost} />
        ) : (
          <></>
          // <Spinner
          //   thickness="4px"
          //   speed="0.65s"
          //   emptyColor="gray.200"
          //   color="blue.500"
          //   size="xl"
          // />
        )}
      </VStack>
      <VStack mb={6}>
        <Heading>Start date</Heading>
        <Text>
          {props.attributes.startSaleTS
            ? moment
                .unix(props.attributes.startSaleTS as number)
                .format('dddd, MMMM Do YYYY, h:mm a')
            : 'Right after successfully published'}
        </Text>
      </VStack>
      {props.attributes.startListTS && (
        <VStack mb={6}>
          <Heading>Listing go live date</Heading>
          <Text>
            {moment
              .unix(props.attributes.startListTS as number)
              .format('dddd, MMMM Do YYYY, h:mm a')}
          </Text>
        </VStack>
      )}
      <VStack mb={6}>
        <Heading>Sale Ends</Heading>
        <Text>
          {props.attributes.endTS
            ? moment
                .unix(props.attributes.endTS as number)
                .format('dddd, MMMM Do YYYY, h:mm a')
            : 'Until sold'}
        </Text>
      </VStack>
      <Button
        my={3}
        size="lg"
        onClick={() => {
          props.setAttributes({
            ...props.attributes,
            startListTS: props.attributes.startListTS || moment().unix(),
            startSaleTS: props.attributes.startSaleTS || moment().unix(),
          });
          props.confirm();
        }}
      >
        Publish Auction
      </Button>
    </>
  );
};

export default Review;
