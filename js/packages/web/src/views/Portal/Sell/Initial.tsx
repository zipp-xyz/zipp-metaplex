import { useState, useEffect } from 'react';
import moment from 'moment';
import { capitalize } from 'lodash';
import { AuctionState } from './types';
import { Button, VStack, Text, Radio, RadioGroup } from '@chakra-ui/react';
import { DateTimePicker, Heading } from 'components';

const InitialPhase = (props: {
  attributes: AuctionState;
  setAttributes: (attr: AuctionState) => void;
  confirm: () => void;
}) => {
  const [startNow, setStartNow] = useState<boolean>(true);
  const [listNow, setListNow] = useState<boolean>(true);

  const [saleMoment, setSaleMoment] = useState<moment.Moment | undefined>(
    props.attributes.startSaleTS
      ? moment.unix(props.attributes.startSaleTS)
      : undefined,
  );
  const [listMoment, setListMoment] = useState<moment.Moment | undefined>(
    props.attributes.startListTS
      ? moment.unix(props.attributes.startListTS)
      : undefined,
  );

  useEffect(() => {
    props.setAttributes({
      ...props.attributes,
      startSaleTS: saleMoment && saleMoment.unix(),
    });
  }, [saleMoment]);

  useEffect(() => {
    props.setAttributes({
      ...props.attributes,
      startListTS: listMoment && listMoment.unix(),
    });
  }, [listMoment]);

  useEffect(() => {
    if (startNow) {
      setSaleMoment(undefined);
      setListNow(true);
    } else {
      setSaleMoment(moment());
    }
  }, [startNow]);

  useEffect(() => {
    if (listNow) setListMoment(undefined);
    else setListMoment(moment());
  }, [listNow]);

  return (
    <>
      <VStack mb={6}>
        <Heading>Initial Phase</Heading>
        <Text>Set the terms for your {props.attributes.saleType}.</Text>
        <Text>When do you want the {props.attributes.saleType} to begin?</Text>
        <RadioGroup
          defaultValue="now"
          onChange={stringValue => setStartNow(stringValue === 'now')}
        >
          <VStack mb={2}>
            <Radio value="now">Immediately</Radio>
            <Text>
              Participants can buy the NFT as soon as you finish setting up the
              auction.
            </Text>
          </VStack>

          <VStack mb={2}>
            <Radio value="later">At a specified date</Radio>
            <Text>
              Participants can start buying the NFT at a specified date.
            </Text>
          </VStack>
        </RadioGroup>
      </VStack>

      {!startNow && (
        <>
          <VStack mb={6}>
            <Text>{capitalize(props.attributes.saleType)} Start Date</Text>
            {saleMoment && (
              <DateTimePicker
                momentObj={saleMoment}
                setMomentObj={setSaleMoment}
                datePickerProps={{
                  disabledDate: (current: moment.Moment) =>
                    current && current < moment().endOf('day'),
                }}
              />
            )}
          </VStack>

          <VStack mb={6}>
            <Heading>When do you want the listing to go live?</Heading>
            <RadioGroup
              defaultValue="now"
              onChange={stringValue => setListNow(stringValue === 'now')}
            >
              <VStack mb={2}>
                <Radio value="now" defaultChecked>
                  Immediately
                </Radio>
                <Text>
                  Participants will be able to view the listing with a countdown
                  to the start date as soon as you finish setting up the sale.
                </Text>
              </VStack>
              <VStack mb={2}>
                <Radio value="later">At a specified date</Radio>
                <Text>
                  Participants will be able to view the listing with a countdown
                  to the start date at the specified date.
                </Text>
              </VStack>
            </RadioGroup>
          </VStack>

          {!listNow && (
            <VStack mb={6}>
              <Heading>Preview Start Date</Heading>
              {listMoment && (
                <DateTimePicker
                  momentObj={listMoment}
                  setMomentObj={setListMoment}
                  datePickerProps={{
                    disabledDate: (current: moment.Moment) =>
                      current &&
                      saleMoment &&
                      (current < moment().endOf('day') || current > saleMoment),
                  }}
                />
              )}
            </VStack>
          )}
        </>
      )}
      <Button my={3} size="lg" onClick={props.confirm}>
        Continue
      </Button>
    </>
  );
};

export default InitialPhase;
