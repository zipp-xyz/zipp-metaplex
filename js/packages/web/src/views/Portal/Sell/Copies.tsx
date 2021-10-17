import { SafetyDepositDraft } from 'actions';
import { AuctionState, AuctionCategory } from './types';
import { Heading } from 'components';
import { ArtSelector } from './artSelector';
import {
  VStack,
  Button,
  Text,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { Creator } from '@oyster/common';

const Copies = (props: {
  attributes: AuctionState;
  setAttributes: (attr: AuctionState) => void;
  confirm: () => void;
}) => {
  let artistFilter = (i: SafetyDepositDraft) =>
    !(i.metadata.info.data.creators || []).find((c: Creator) => !c.verified);
  let filter: (i: SafetyDepositDraft) => boolean = (i: SafetyDepositDraft) =>
    true;
  if (props.attributes.category === AuctionCategory.Limited) {
    filter = (i: SafetyDepositDraft) =>
      !!i.masterEdition && !!i.masterEdition.info.maxSupply;
  } else if (props.attributes.category === AuctionCategory.Open) {
    filter = (i: SafetyDepositDraft) =>
      !!(
        i.masterEdition &&
        (i.masterEdition.info.maxSupply === undefined ||
          i.masterEdition.info.maxSupply === null)
      );
  }

  let overallFilter = (i: SafetyDepositDraft) => filter(i) && artistFilter(i);

  return (
    <>
      <VStack mb={6}>
        <Heading>Select which item to sell</Heading>
        <ArtSelector
          filter={overallFilter}
          selected={props.attributes.items}
          setSelected={items => {
            props.setAttributes({ ...props.attributes, items });
          }}
          allowMultiple={false}
        >
          Select NFT
        </ArtSelector>

        {props.attributes.category === AuctionCategory.Limited && (
          <>
            <Text>How many copies do you want to create?</Text>
            <Text>
              Each copy will be given unique edition number e.g. 1 of 30
            </Text>

            <NumberInput
              bg="white"
              defaultValue={props.attributes.editions}
              onChange={info =>
                props.setAttributes({
                  ...props.attributes,
                  editions: parseInt(info),
                })
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </>
        )}
      </VStack>
      <Button
        my={3}
        onClick={() => {
          props.confirm();
        }}
      >
        Continue to Terms
      </Button>
    </>
  );
};

export default Copies;
