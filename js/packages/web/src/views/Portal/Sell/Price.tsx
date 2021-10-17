import { AuctionState, AuctionCategory } from './types';
import {
  Button,
  VStack,
  Text,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Box,
} from '@chakra-ui/react';
import { Heading } from 'components';

const Price = (props: {
  attributes: AuctionState;
  setAttributes: (attr: AuctionState) => void;
  confirm: () => void;
}) => {
  return (
    <>
      {props.attributes.saleType === 'auction' ? (
        <PriceAuction {...props} />
      ) : (
        <PriceSale {...props} />
      )}
    </>
  );
};

const PriceSale = (props: {
  attributes: AuctionState;
  setAttributes: (attr: AuctionState) => void;
  confirm: () => void;
}) => {
  return (
    <>
      <VStack>
        <Text>Price</Text>
        <Text>Set the price for your auction.</Text>
      </VStack>
      <VStack>
        <Text>Sale price</Text>
        <Text>This is the starting bid price for your auction.</Text>
        <InputGroup>
          <InputLeftAddon>◎</InputLeftAddon>
          <NumberInput
            bg="white"
            min={0}
            placeholder="Price"
            defaultValue={props.attributes.price}
            onChange={stringValue =>
              props.setAttributes({
                ...props.attributes,
                price: parseFloat(stringValue) || undefined,
              })
            }
          >
            <NumberInputField />
            <InputRightAddon>SOL</InputRightAddon>
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <InputRightAddon>SOL</InputRightAddon>
        </InputGroup>
      </VStack>
      <Button size="lg" onClick={props.confirm}>
        Continue
      </Button>
    </>
  );
};

const PriceAuction = (props: {
  attributes: AuctionState;
  setAttributes: (attr: AuctionState) => void;
  confirm: () => void;
}) => {
  return (
    <>
      <VStack mb={6}>
        <Heading>Price</Heading>
        <Text>Set the price for your auction.</Text>
      </VStack>
      {props.attributes.category === AuctionCategory.Open && (
        <VStack mb={6}>
          <Heading>Price</Heading>
          <Text>
            This is the fixed price that everybody will pay for your
            Participation NFT.
          </Text>
          <NumberInput
            bg="white"
            min={0}
            placeholder="Fixed Price"
            defaultValue={props.attributes.priceFloor}
            onChange={stringValue =>
              props.setAttributes({
                ...props.attributes,
                // Do both, since we know this is the only item being sold.
                participationFixedPrice: parseFloat(stringValue),
                priceFloor: parseFloat(stringValue),
              })
            }
          >
            <InputLeftAddon>◎</InputLeftAddon>
            <NumberInputField />
            <InputRightAddon>SOL</InputRightAddon>
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </VStack>
      )}
      {props.attributes.category !== AuctionCategory.Open && (
        <VStack mb={6}>
          <Heading>Price Floor</Heading>
          <Text>This is the starting bid price for your auction.</Text>
          <Box mb={3}>
            <InputGroup>
              <InputLeftAddon>◎</InputLeftAddon>
              <NumberInput
                bg="white"
                min={0}
                placeholder="Price"
                defaultValue={props.attributes.priceFloor}
                onChange={stringValue =>
                  props.setAttributes({
                    ...props.attributes,
                    priceFloor: parseFloat(stringValue),
                  })
                }
              >
                <NumberInputField />

                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <InputRightAddon>SOL</InputRightAddon>
            </InputGroup>
          </Box>
        </VStack>
      )}
      <VStack mb={6}>
        <Heading>Tick Size</Heading>
        <Text>All bids must fall within this price increment.</Text>
        <Box>
          <InputGroup>
            <InputLeftAddon>◎</InputLeftAddon>
            <NumberInput
              bg="white"
              min={0}
              placeholder="Tick size in SOL"
              defaultValue={props.attributes.priceTick}
              onChange={stringValue =>
                props.setAttributes({
                  ...props.attributes,
                  priceTick: parseFloat(stringValue),
                })
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <InputRightAddon>SOL</InputRightAddon>
          </InputGroup>
        </Box>
      </VStack>
      <Button size="lg" onClick={props.confirm} className="action-btn">
        Continue
      </Button>
    </>
  );
};

export default Price;
