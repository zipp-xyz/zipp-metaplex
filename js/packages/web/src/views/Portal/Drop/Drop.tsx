import React, { useState, useCallback } from 'react';

import { useHistory } from 'react-router-dom';

import { Title, Step } from 'components';
import { mintNFT } from 'actions';
import { Button, Flex, HStack, VStack, Box } from '@chakra-ui/react';

import Name from './Name';
import AudioUpload from './AudioUpload';
import CoverArt from './CoverArt';
import Royalties from './Royalties';
// import Bidding from './Bidding';
import Review from './Review';
import Waiting from './Waiting';
import Congrats from './Congrats';

import {
  useConnection,
  useConnectionConfig,
  MetadataCategory,
  StringPublicKey,
  IMetadataExtension,
} from '@oyster/common';
import { useWallet } from '@solana/wallet-adapter-react';

const contents = [
  CoverArt,
  AudioUpload,
  Name,
  Royalties,
  Review,
  Waiting,
  Congrats,
];

const Drop = () => {
  const connection = useConnection();
  const { env } = useConnectionConfig();
  const wallet = useWallet();
  const history = useHistory();

  const [step, setStep] = useState<number>(0);
  // const [stepsVisible, setStepsVisible] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [nft, setNft] = useState<
    { metadataAccount: StringPublicKey } | undefined
  >(undefined);
  const [files, setFiles] = useState<File[]>([]);
  const [attributes, setAttributes] = useState<IMetadataExtension>({
    name: '',
    symbol: '',
    description: '',
    external_url: '',
    image: '',
    animation_url: undefined,
    attributes: undefined,
    seller_fee_basis_points: 0,
    creators: [],
    properties: {
      files: [],
      category: MetadataCategory.Audio,
      maxSupply: 1,
    },
  });

  const mint = async () => {
    const metadata = {
      name: attributes.name,
      symbol: attributes.symbol,
      creators: attributes.creators,
      description: attributes.description,
      sellerFeeBasisPoints: attributes.seller_fee_basis_points,
      image: attributes.image,
      animation_url: attributes.animation_url,
      attributes: attributes.attributes,
      external_url: attributes.external_url,
      properties: {
        files: attributes.properties.files,
        category: attributes.properties?.category,
      },
    };
    const inte = setInterval(
      () => setProgress(prog => Math.min(prog + 1, 99)),
      600,
    );
    // Update progress inside mintNFT
    const _nft = await mintNFT(
      connection,
      wallet,
      env,
      files,
      metadata,
      attributes.properties?.maxSupply,
    );
    if (_nft) setNft(_nft);
    clearInterval(inte);
  };

  const gotoStep = useCallback(
    (_step: number) => {
      setStep(_step);
    },
    [step],
  );

  const getStepContent = useCallback(
    step => {
      const Component = contents[step];
      // refactor to pass only components that use these
      return (
        <Component
          attributes={attributes}
          setAttributes={setAttributes}
          files={files}
          setFiles={setFiles}
          connection={connection}
          mint={mint}
          progress={progress}
          nft={nft}
          confirm={() => gotoStep(step + 1)}
        />
      );
    },
    [step, progress, attributes],
  );

  return (
    <VStack flexGrow={1} spacing={10}>
      <Title>Create NFT</Title>
      <Box width="100%">
        <HStack as="ol" listStyleType="none" spacing="0" mb={6}>
          {contents.map((component, index) => (
            <Step isCurrent={step === index}>{component.name}</Step>
          ))}
        </HStack>
        <Flex mb={3} flexDirection="column" minHeight={400}>
          {getStepContent(step)}
          {0 < step && step < 5 && (
            <Button my={3} variant="outline" onClick={() => gotoStep(step - 1)}>
              Back
            </Button>
          )}
        </Flex>
      </Box>
    </VStack>
  );
};

export default Drop;
