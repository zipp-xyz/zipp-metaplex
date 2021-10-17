import { Col } from 'antd';
import { AuctionState } from './types';
import { Heading } from 'components';
import { VStack, Text, Button, Radio, RadioGroup } from '@chakra-ui/react';

const Type = (props: {
  attributes: AuctionState;
  setAttributes: (attr: AuctionState) => void;
  confirm: () => void;
}) => {
  return (
    <>
      <VStack>
        <Heading>Sale Type</Heading>
        <Text>Sell a limited copy or copies of a single Master NFT.</Text>
      </VStack>
      <VStack>
        <Text>How do you want to sell your NFT(s)?</Text>
        <RadioGroup
          defaultValue={props.attributes.saleType}
          onChange={(stringValue: AuctionState['saleType']) =>
            props.setAttributes({
              ...props.attributes,
              saleType: stringValue,
            })
          }
        >
          <Radio value="auction">
            <Heading>Auction</Heading>
            <Text>Allow bidding on your NFT(s).</Text>
          </Radio>
        </RadioGroup>
      </VStack>
      <Button my={3} size="lg" onClick={props.confirm}>
        Continue
      </Button>
    </>
  );
};

export default Type;
