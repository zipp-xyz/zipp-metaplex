import { useState, useEffect } from 'react';
import moment from 'moment';
import { AuctionState } from './types';
import {
  Button,
  VStack,
  HStack,
  Text,
  Radio,
  RadioGroup,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { Select } from 'antd';
import { DateTimePicker, Heading } from 'components';

const { Option } = Select;

const EndingPhaseStep = (props: {
  attributes: AuctionState;
  setAttributes: (attr: AuctionState) => void;
  confirm: () => void;
}) => {
  return (
    <>
      {props.attributes.saleType === 'auction' ? (
        <EndingPhaseAuction {...props} />
      ) : (
        <EndingPhaseSale {...props} />
      )}
    </>
  );
};

const EndingPhaseAuction = (props: {
  attributes: AuctionState;
  setAttributes: (attr: AuctionState) => void;
  confirm: () => void;
}) => {
  return (
    <>
      <VStack mb={6}>
        <Heading>Ending Phase</Heading>
        <Text>Set the terms for your auction.</Text>
      </VStack>

      <VStack mb={6}>
        <Heading>Auction Duration</Heading>
        <Text>This is how long the auction will last for.</Text>
        <HStack>
          <NumberInput
            bg="white"
            placeholder="Set the auction duration"
            value={props.attributes.auctionDuration}
            onChange={stringValue =>
              props.setAttributes({
                ...props.attributes,
                auctionDuration: parseInt(stringValue),
              })
            }
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Select
            defaultValue={props.attributes.auctionDurationType}
            onChange={value =>
              props.setAttributes({
                ...props.attributes,
                auctionDurationType: value,
              })
            }
          >
            <Option value="minutes">Minutes</Option>
            <Option value="hours">Hours</Option>
            <Option value="days">Days</Option>
          </Select>
        </HStack>
      </VStack>

      <VStack mb={6}>
        <Heading>Gap Time</Heading>
        <Text>
          The final phase of the auction will begin when there is this much time
          left on the countdown. Any bids placed during the final phase will
          extend the end time by this same duration.
        </Text>
        <HStack>
          <NumberInput
            bg="white"
            placeholder="Set the gap time"
            value={props.attributes.gapTime}
            onChange={stringValue =>
              props.setAttributes({
                ...props.attributes,
                gapTime: parseInt(stringValue),
              })
            }
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Select
            defaultValue={props.attributes.gapTimeType}
            onChange={value =>
              props.setAttributes({
                ...props.attributes,
                gapTimeType: value,
              })
            }
          >
            <Option value="minutes">Minutes</Option>
            <Option value="hours">Hours</Option>
            <Option value="days">Days</Option>
          </Select>
        </HStack>
      </VStack>

      <VStack mb={6}>
        <Heading>Tick Size for Ending Phase</Heading>
        <Text>
          In order for winners to move up in the auction, they must place a bid
          that’s at least this percentage higher than the next highest bid.
        </Text>
        <NumberInput
          bg="white"
          placeholder="Percentage"
          suffix="%"
          value={props.attributes.tickSizeEndingPhase}
          onChange={stringValue =>
            props.setAttributes({
              ...props.attributes,
              tickSizeEndingPhase: parseInt(stringValue),
            })
          }
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </VStack>
      <Button my={3} size="lg" onClick={props.confirm}>
        Continue
      </Button>
    </>
  );
};

const EndingPhaseSale = (props: {
  attributes: AuctionState;
  setAttributes: (attr: AuctionState) => void;
  confirm: () => void;
}) => {
  const startMoment = props.attributes.startSaleTS
    ? moment.unix(props.attributes.startSaleTS)
    : moment();
  const [untilSold, setUntilSold] = useState<boolean>(true);
  const [endMoment, setEndMoment] = useState<moment.Moment | undefined>(
    props.attributes.endTS ? moment.unix(props.attributes.endTS) : undefined,
  );

  useEffect(() => {
    props.setAttributes({
      ...props.attributes,
      endTS: endMoment && endMoment.unix(),
    });
  }, [endMoment]);

  useEffect(() => {
    if (untilSold) setEndMoment(undefined);
    else setEndMoment(startMoment);
  }, [untilSold]);

  return (
    <>
      <Heading>Ending Phase</Heading>
      <Text>Set the terms for your sale.</Text>
      <VStack>
        <Heading>When do you want the sale to end?</Heading>
        <RadioGroup
          defaultValue="now"
          onChange={stringValue => setUntilSold(stringValue === 'now')}
        >
          <VStack>
            <Radio value="now">Until sold</Radio>
            <Text>The sale will end once the supply goes to zero.</Text>
          </VStack>
          <VStack>
            <Radio value="later">At a specified date</Radio>
            <Text>
              The sale will end at this date, regardless if there is remaining
              supply.
            </Text>
          </VStack>
        </RadioGroup>
      </VStack>

      {!untilSold && (
        <VStack>
          <Heading>End Date</Heading>
          {endMoment && (
            <DateTimePicker
              momentObj={endMoment}
              setMomentObj={setEndMoment}
              datePickerProps={{
                disabledDate: (current: moment.Moment) =>
                  current && current < startMoment,
              }}
            />
          )}
        </VStack>
      )}
      <Button size="lg" onClick={props.confirm}>
        Continue
      </Button>
    </>
  );
};

export default EndingPhaseStep;
