import { useState, useEffect } from 'react';

import { Connection } from '@solana/web3.js';
import { MintLayout } from '@solana/spl-token';

import { Button, Flex, Text, VStack, HStack, Spinner } from '@chakra-ui/react';

import { IMetadataExtension, MAX_METADATA_LEN } from '@oyster/common';
import { Heading, MusicCard, AmountLabel } from 'components';
import { getAssetCostToStore, LAMPORT_MULTIPLIER } from 'utils/assets';

import { useArtworkFiles } from './useArtworkFiles';

const Review = (props: {
  confirm: () => void;
  attributes: IMetadataExtension;
  files: File[];
  connection: Connection;
}) => {
  const [cost, setCost] = useState(0);
  const { image, animation_url } = useArtworkFiles(
    props.files,
    props.attributes,
  );
  const files = props.files;
  const metadata = props.attributes;

  console.log(metadata);
  useEffect(() => {
    const rentCall = Promise.all([
      props.connection.getMinimumBalanceForRentExemption(MintLayout.span),
      props.connection.getMinimumBalanceForRentExemption(MAX_METADATA_LEN),
    ]);
    if (files.length)
      getAssetCostToStore([
        ...files,
        new File([JSON.stringify(metadata)], 'metadata.json'),
      ]).then(async lamports => {
        const sol = lamports / LAMPORT_MULTIPLIER;

        // TODO: cache this and batch in one call
        const [mintRent, metadataRent] = await rentCall;

        // const uriStr = 'x';
        // let uriBuilder = '';
        // for (let i = 0; i < MAX_URI_LENGTH; i++) {
        //   uriBuilder += uriStr;
        // }

        const additionalSol = (metadataRent + mintRent) / LAMPORT_MULTIPLIER;

        // TODO: add fees based on number of transactions and signers
        setCost(sol + additionalSol);
      });
  }, [files, metadata, setCost]);

  return (
    <>
      <>
        <VStack>
          <Heading fontSize={2} mb={2}>
            Launch your creation
          </Heading>
          <Text>
            Provide detailed description of your creative process to engage with
            your audience.
          </Text>
        </VStack>
        <HStack justify="space-around">
          {/* <VStack>
           {props.attributes.image && (
              <ArtCard
                image={image}
                animationURL={animation_url}
                category={props.attributes.properties?.category}
                name={props.attributes.name}
                symbol={props.attributes.symbol}
                small={true}
               />
             )}
          </VStack> */}
          <VStack minWidth={300}>
            <Heading>Royalty Percentage</Heading>
            <Text>
              {(props.attributes.seller_fee_basis_points / 100).toFixed(2)}%
            </Text>
            {cost ? (
              <AmountLabel title="Cost to Create" amount={cost.toFixed(5)} />
            ) : (
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="xl"
              />
            )}
          </VStack>
        </HStack>
        <Button size="lg" onClick={props.confirm}>
          Pay with SOL
        </Button>
        {/* <Button disabled={true} size="lg" onClick={props.confirm}>
            Pay with Credit Card
          </Button> */}
      </>

      {/* <Heading fontSize={2} mb={2}>
        Review your NFT for submission
      </Heading>
      <Flex justifyContent="center" alignItems="center" minHeight={400}>
        <MusicCard {...songDetails} />
      </Flex>
      <Button
        onClick={handleSubmit}
        to={{ pathname: "/portal/balances", state: { showNotification: true } }}
        as={Link}
      >
        Submit
      </Button> */}
    </>
  );
};

export default Review;
