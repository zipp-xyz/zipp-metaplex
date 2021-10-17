import { MetadataKey, Creator } from '@oyster/common';
import { SafetyDepositDraft } from 'actions/createAuctionManager';
import { TierDummyEntry, TieredAuctionState, Tier } from './types';
import { WinningConfigType } from 'models/metaplex';
import { ArtSelector } from './artSelector';
import {
  VStack,
  CheckboxGroup,
  Checkbox,
  Button,
  Text,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { Select } from 'antd';
import { Heading, Card } from 'components';
import { FaPlusCircle } from 'react-icons/fa';

const { Option } = Select;

const TierTable = (props: {
  attributes: TieredAuctionState;
  setAttributes: (attr: TieredAuctionState) => void;
  maxWinners: number;
  confirm: () => void;
}) => {
  const newImmutableTiers = (tiers: Tier[]) => {
    return tiers.map(wc => ({
      items: [...wc.items.map(it => ({ ...it }))],
      winningSpots: [...wc.winningSpots],
    }));
  };
  let artistFilter = (i: SafetyDepositDraft) =>
    !(i.metadata.info.data.creators || []).find((c: Creator) => !c.verified);
  const options: { label: string; value: number }[] = [];
  for (let i = 0; i < props.maxWinners; i++) {
    options.push({ label: `Winner ${i + 1}`, value: i });
  }
  return (
    <>
      <VStack>
        <Heading>Add Winning Tiers and Their Prizes</Heading>
        <Text>
          Each row represents a tier. You can choose which winning spots get
          which tiers.
        </Text>
      </VStack>
      {props.attributes.tiers.map((wcg, configIndex) => (
        <VStack>
          <VStack>
            <Heading>Tier #{configIndex + 1} Basket</Heading>
          </VStack>
          <CheckboxGroup
            onChange={value => {
              const newTiers = newImmutableTiers(props.attributes.tiers);
              const myNewTier = newTiers[configIndex];
              myNewTier.winningSpots = value.map(i => i.valueOf() as number);
              props.setAttributes({
                ...props.attributes,
                tiers: newTiers,
              });
            }}
          >
            {options.map(checkbox => (
              <Checkbox key={checkbox.value} label={checkbox.value}>
                {checkbox.value}
              </Checkbox>
            ))}
          </CheckboxGroup>
          {wcg.items.map((i, itemIndex) => (
            <VStack key={itemIndex}>
              <Card>
                <ArtSelector
                  filter={artistFilter}
                  selected={
                    (i as TierDummyEntry).safetyDepositBoxIndex !== undefined
                      ? [
                          props.attributes.items[
                            (i as TierDummyEntry).safetyDepositBoxIndex
                          ],
                        ]
                      : []
                  }
                  setSelected={items => {
                    const newItems = [
                      ...props.attributes.items.map(it => ({ ...it })),
                    ];

                    const newTiers = newImmutableTiers(props.attributes.tiers);
                    if (items[0]) {
                      const existing = props.attributes.items.find(
                        it => it.metadata.pubkey === items[0].metadata.pubkey,
                      );
                      if (!existing) newItems.push(items[0]);
                      const index = newItems.findIndex(
                        it => it.metadata.pubkey === items[0].metadata.pubkey,
                      );

                      const myNewTier = newTiers[configIndex].items[itemIndex];
                      myNewTier.safetyDepositBoxIndex = index;
                      if (
                        items[0].masterEdition &&
                        items[0].masterEdition.info.key ==
                          MetadataKey.MasterEditionV1
                      ) {
                        myNewTier.winningConfigType =
                          WinningConfigType.PrintingV1;
                      } else if (
                        items[0].masterEdition &&
                        items[0].masterEdition.info.key ==
                          MetadataKey.MasterEditionV2
                      ) {
                        myNewTier.winningConfigType =
                          WinningConfigType.PrintingV2;
                      } else {
                        myNewTier.winningConfigType =
                          WinningConfigType.TokenOnlyTransfer;
                      }
                      myNewTier.amount = 1;
                    } else if (
                      (i as TierDummyEntry).safetyDepositBoxIndex !== undefined
                    ) {
                      const myNewTier = newTiers[configIndex];
                      myNewTier.items.splice(itemIndex, 1);
                      if (myNewTier.items.length === 0)
                        newTiers.splice(configIndex, 1);
                      const othersWithSameItem = newTiers.find(c =>
                        c.items.find(
                          it =>
                            it.safetyDepositBoxIndex ===
                            (i as TierDummyEntry).safetyDepositBoxIndex,
                        ),
                      );

                      if (!othersWithSameItem) {
                        for (
                          let j =
                            (i as TierDummyEntry).safetyDepositBoxIndex + 1;
                          j < props.attributes.items.length;
                          j++
                        ) {
                          newTiers.forEach(c =>
                            c.items.forEach(it => {
                              if (it.safetyDepositBoxIndex === j)
                                it.safetyDepositBoxIndex--;
                            }),
                          );
                        }
                        newItems.splice(
                          (i as TierDummyEntry).safetyDepositBoxIndex,
                          1,
                        );
                      }
                    }

                    props.setAttributes({
                      ...props.attributes,
                      items: newItems,
                      tiers: newTiers,
                    });
                  }}
                  allowMultiple={false}
                >
                  Select item
                </ArtSelector>

                {(i as TierDummyEntry).winningConfigType !== undefined && (
                  <>
                    <Select
                      defaultValue={(i as TierDummyEntry).winningConfigType}
                      style={{ width: 120 }}
                      onChange={value => {
                        const newTiers = newImmutableTiers(
                          props.attributes.tiers,
                        );

                        const myNewTier =
                          newTiers[configIndex].items[itemIndex];

                        // Legacy hack...
                        if (
                          value == WinningConfigType.PrintingV2 &&
                          myNewTier.safetyDepositBoxIndex &&
                          props.attributes.items[
                            myNewTier.safetyDepositBoxIndex
                          ].masterEdition?.info.key ==
                            MetadataKey.MasterEditionV1
                        ) {
                          value = WinningConfigType.PrintingV1;
                        }
                        myNewTier.winningConfigType = value;
                        props.setAttributes({
                          ...props.attributes,
                          tiers: newTiers,
                        });
                      }}
                    >
                      <Option value={WinningConfigType.FullRightsTransfer}>
                        Full Rights Transfer
                      </Option>
                      <Option value={WinningConfigType.TokenOnlyTransfer}>
                        Token Only Transfer
                      </Option>
                      <Option value={WinningConfigType.PrintingV2}>
                        Printing V2
                      </Option>

                      <Option value={WinningConfigType.PrintingV1}>
                        Printing V1
                      </Option>
                    </Select>

                    {((i as TierDummyEntry).winningConfigType ===
                      WinningConfigType.PrintingV1 ||
                      (i as TierDummyEntry).winningConfigType ===
                        WinningConfigType.PrintingV2) && (
                      <VStack>
                        <Text>
                          How many copies do you want to create for each winner?
                          If you put 2, then each winner will get 2 copies.
                        </Text>
                        <Text>
                          Each copy will be given unique edition number e.g. 1
                          of 30
                        </Text>

                        <NumberInput
                          bg="white"
                          placeholder="Enter number of copies sold"
                          onChange={stringValue => {
                            const newTiers = newImmutableTiers(
                              props.attributes.tiers,
                            );

                            const myNewTier =
                              newTiers[configIndex].items[itemIndex];
                            myNewTier.amount = parseInt(stringValue);
                            props.setAttributes({
                              ...props.attributes,
                              tiers: newTiers,
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
                    )}
                  </>
                )}
              </Card>
            </VStack>
          ))}
          <Button
            size="lg"
            onClick={() => {
              const newTiers = newImmutableTiers(props.attributes.tiers);
              const myNewTier = newTiers[configIndex];
              myNewTier.items.push({});
              props.setAttributes({
                ...props.attributes,
                tiers: newTiers,
              });
            }}
          >
            <FaPlusCircle />
          </Button>
        </VStack>
      ))}
      <Button
        size="lg"
        onClick={() => {
          const newTiers = newImmutableTiers(props.attributes.tiers);
          newTiers.push({ items: [], winningSpots: [] });
          props.setAttributes({
            ...props.attributes,
            tiers: newTiers,
          });
        }}
      >
        <FaPlusCircle />
      </Button>
      <Button size="lg" onClick={props.confirm}>
        Continue to Review
      </Button>
    </>
  );
};

export default TierTable;
