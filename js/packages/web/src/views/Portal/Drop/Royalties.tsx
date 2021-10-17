import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Heading, UserSearch } from 'components';

import { shortenAddress, Creator, IMetadataExtension } from '@oyster/common';
import {
  Box,
  NumberInput,
  Flex,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Text,
  VStack,
  HStack,
  Button,
  Modal,
  ModalHeader,
  ModalContent,
  ModalCloseButton,
} from '@chakra-ui/react';

import { UserValue } from 'types';
import { FaPlusCircle } from 'react-icons/fa';

interface Royalty {
  creatorKey: string;
  amount: number;
}

const RoyaltiesSplitter = (props: {
  creators: Array<UserValue>;
  royalties: Array<Royalty>;
  setRoyalties: Function;
  isShowErrors?: boolean;
}) => {
  return (
    <>
      {props.creators.map((creator, idx) => {
        const royalty = props.royalties.find(
          royalty => royalty.creatorKey === creator.key,
        );
        if (!royalty) return null;

        const amt = royalty.amount;

        const handleChangeShare = (numberValue: number) => {
          props.setRoyalties(
            props.royalties.map(_royalty => {
              return {
                ..._royalty,
                amount:
                  _royalty.creatorKey === royalty.creatorKey
                    ? numberValue
                    : _royalty.amount,
              };
            }),
          );
        };

        return (
          <HStack key={idx} width="100%">
            <Text>{creator.label}</Text>
            <NumberInput
              bg="white"
              maxW="100px"
              mr="2rem"
              value={amt}
              onChange={(_, numberValue) => handleChangeShare(numberValue)}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Slider
              flex="1"
              focusThumbOnChange={false}
              value={amt}
              onChange={handleChangeShare}
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb fontSize="sm" boxSize="32px" children={amt} />
            </Slider>

            {props.isShowErrors && amt === 0 && (
              <VStack style={{ paddingLeft: 12 }}>
                <Text type="danger">
                  The split percentage for this creator cannot be 0%.
                </Text>
              </VStack>
            )}
          </HStack>
        );
      })}
    </>
  );
};

const Royalties = (props: {
  attributes: IMetadataExtension;
  setAttributes: (attr: IMetadataExtension) => void;
  confirm: () => void;
}) => {
  const { publicKey, connected } = useWallet();
  const [creators, setCreators] = useState<Array<UserValue>>([]);
  const [fixedCreators, setFixedCreators] = useState<Array<UserValue>>([]);
  const [royalties, setRoyalties] = useState<Array<Royalty>>([]);
  const [totalRoyaltyShares, setTotalRoyaltiesShare] = useState<number>(0);
  const [showCreatorsModal, setShowCreatorsModal] = useState<boolean>(false);
  const [isShowErrors, setIsShowErrors] = useState<boolean>(false);

  const { attributes, setAttributes } = props;

  useEffect(() => {
    if (publicKey) {
      const key = publicKey.toBase58();
      setFixedCreators([
        {
          key,
          label: shortenAddress(key),
          value: key,
        },
      ]);
    }
  }, [connected, setCreators]);

  useEffect(() => {
    setRoyalties(
      [...fixedCreators, ...creators].map(creator => ({
        creatorKey: creator.key,
        amount: Math.trunc(100 / [...fixedCreators, ...creators].length),
      })),
    );
  }, [creators, fixedCreators]);

  useEffect(() => {
    // When royalties changes, sum up all the amounts.
    const total = royalties.reduce((totalShares, royalty) => {
      return totalShares + royalty.amount;
    }, 0);

    setTotalRoyaltiesShare(total);
  }, [royalties]);

  return (
    <>
      <VStack mb={6}>
        <Heading>Set royalties and creator splits</Heading>
        <Text>
          Royalties ensure that you continue to get compensated for your work
          after its initial sale.
        </Text>
      </VStack>
      <VStack mb={6}>
        <Heading>Royalty Percentage</Heading>
        <Text>
          This is how much of each secondary sale will be paid out to the
          creators.
        </Text>
        <NumberInput
          bg="white"
          min={0}
          max={100}
          placeholder="Between 0 and 100"
          defaultValue={attributes.seller_fee_basis_points / 100}
          onChange={(_, val: number) => {
            setAttributes({
              ...attributes,
              seller_fee_basis_points: val * 100,
            });
          }}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </VStack>
      {[...fixedCreators, ...creators].length > 0 && (
        <VStack mb={6}>
          <Heading>Creators Split</Heading>
          <Text>
            This is how much of the proceeds from the initial sale and any
            royalties will be split out amongst the creators.
          </Text>
          <Box width="600px">
            <RoyaltiesSplitter
              creators={[...fixedCreators, ...creators]}
              royalties={royalties}
              setRoyalties={setRoyalties}
              isShowErrors={isShowErrors}
            />
          </Box>
        </VStack>
      )}
      <HStack mb={3}>
        <Button
          size="sm"
          variant="outline"
          leftIcon={<FaPlusCircle />}
          onClick={() => setShowCreatorsModal(true)}
        >
          Add another creator
        </Button>
        <Modal
          isOpen={showCreatorsModal}
          onClose={() => setShowCreatorsModal(false)}
        >
          <ModalContent>
            <ModalHeader>Creators</ModalHeader>
            <ModalCloseButton />
            <UserSearch setCreators={setCreators} />
          </ModalContent>
        </Modal>
      </HStack>
      {isShowErrors && totalRoyaltyShares !== 100 && (
        <HStack>
          <Text type="danger" style={{ paddingBottom: 14 }}>
            The split percentages for each creator must add up to 100%. Current
            total split percentage is {totalRoyaltyShares}%.
          </Text>
        </HStack>
      )}
      <Button
        size="lg"
        onClick={() => {
          // Find all royalties that are invalid (0)
          const zeroedRoyalties = royalties.filter(
            royalty => royalty.amount === 0,
          );

          if (zeroedRoyalties.length !== 0 || totalRoyaltyShares !== 100) {
            // Contains a share that is 0 or total shares does not equal 100, show errors.
            setIsShowErrors(true);
            return;
          }

          const creatorStructs: Creator[] = [...fixedCreators, ...creators].map(
            c =>
              new Creator({
                address: c.value,
                verified: c.value === publicKey?.toBase58(),
                share:
                  royalties.find(r => r.creatorKey === c.value)?.amount ||
                  Math.round(100 / royalties.length),
              }),
          );

          const share = creatorStructs.reduce(
            (acc, el) => (acc += el.share),
            0,
          );
          if (share > 100 && creatorStructs.length) {
            creatorStructs[0].share -= share - 100;
          }
          props.setAttributes({
            ...props.attributes,
            creators: creatorStructs,
          });
          props.confirm();
        }}
      >
        Continue to review
      </Button>
    </>
  );
};

export default Royalties;
