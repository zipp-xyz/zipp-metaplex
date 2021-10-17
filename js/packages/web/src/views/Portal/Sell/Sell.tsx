import { useState, useCallback } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { Title, Step } from 'components';
import { Flex, Button, HStack, VStack, Box } from '@chakra-ui/react';

import BN from 'bn.js';

import { useWallet } from '@solana/wallet-adapter-react';
import {
  constants,
  PriceFloor,
  PriceFloorType,
  useConnection,
  useMint,
  StringPublicKey,
  WinnerLimit,
  WinnerLimitType,
  toLamports,
  IPartialCreateAuctionArgs,
} from '@oyster/common';

import { QUOTE_MINT } from '../../../constants';

import { WinningConfigType, AmountRange } from 'models/metaplex';

import Category from './Category';
import Winners from './Winners';
import Copies from './Copies';
import Type from './Type';
import Price from './Price';
import InitialPhase from './Initial';
import EndingPhase from './Ending';
import Tier from './Tier';
import Participation from './Participation';
import Review from './Review';
import Waiting from './Waiting';
import Congrats from './Congrats';

import { createAuctionManager } from 'actions';
import { useMeta } from 'contexts';
import {
  AuctionState,
  AuctionCategory,
  TieredAuctionState,
  TierDummyEntry,
} from './types';
import { SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

const { ZERO } = constants;

const stepsByCategory = {
  [AuctionCategory.Limited]: [
    ['Category', Category],
    ['Copies', Copies],
    ['Sale Type', Type],
    ['Price', Price],
    ['Drop Date', InitialPhase],
    ['End Drop', EndingPhase],
    // ['Participation NFT', Participation],
    ['Review', Review],
    ['Publish', Waiting],
    [undefined, Congrats],
  ],
  [AuctionCategory.Single]: [
    ['Category', Category],
    ['Copies', Copies],
    ['Price', Price],
    ['Drop Date', InitialPhase],
    ['End Drop', EndingPhase],
    // ['Participation NFT', Participation],
    ['Review', Review],
    ['Publish', Waiting],
    [undefined, Congrats],
  ],
  [AuctionCategory.Open]: [
    ['Category', Category],
    ['Copies', Copies],
    ['Price', Price],
    ['Drop Date', InitialPhase],
    ['End Drop', EndingPhase],
    ['Review', Review],
    ['Publish', Waiting],
    [undefined, Congrats],
  ],
  [AuctionCategory.Tiered]: [
    ['Category', Category],
    ['Winners', Winners],
    ['Tiers', Tier],
    ['Price', Price],
    ['Drop Date', InitialPhase],
    ['End Drop', EndingPhase],
    // ['Participation NFT', Participation],
    ['Review', Review],
    ['Publish', Waiting],
    [undefined, Congrats],
  ],
};

const Sell = () => {
  const connection = useConnection();
  const wallet = useWallet();
  const { whitelistedCreatorsByCreator } = useMeta();
  const { step_param }: { step_param: string } = useParams();
  const history = useHistory();
  const mint = useMint(QUOTE_MINT);

  const [step, setStep] = useState<number>(0);
  const [stepsVisible, setStepsVisible] = useState<boolean>(true);
  const [auctionObj, setAuctionObj] = useState<
    | {
        vault: StringPublicKey;
        auction: StringPublicKey;
        auctionManager: StringPublicKey;
      }
    | undefined
  >(undefined);
  const [attributes, setAttributes] = useState<AuctionState>({
    reservationPrice: 0,
    items: [],
    category: AuctionCategory.Open,
    saleType: 'auction',
    auctionDurationType: 'days',
    gapTimeType: 'hours',
    winnersCount: 1,
    startSaleTS: undefined,
    startListTS: undefined,
    editions: 1,
    priceTick: 1,
    priceFloor: 1,
    auctionDuration: 1,
    gapTime: 1,
    tickSizeEndingPhase: 1,
  });

  const [tieredAttributes, setTieredAttributes] = useState<TieredAuctionState>({
    items: [],
    tiers: [],
  });

  const gotoStep = useCallback(
    (_step: number) => {
      setStep(step + 1);
    },
    [step],
  );

  const getStepContent = useCallback(
    step => {
      const Component = stepsByCategory[attributes.category][step][1];
      // refactor to pass only components that use these

      if (Component === Category) {
        return (
          <Component
            confirm={(category: AuctionCategory) => {
              setAttributes({
                ...attributes,
                category,
              });
              gotoStep(step + 1);
            }}
          />
        );
      }

      if (
        [
          Copies,
          Type,
          Price,
          InitialPhase,
          EndingPhase,
          Participation,
        ].includes(Component)
      ) {
        return (
          <Component
            attributes={attributes}
            setAttributes={setAttributes}
            confirm={() => gotoStep(step + 1)}
          />
        );
      }

      if (Component === Waiting) {
        return (
          <Component
            createAuction={createAuction}
            confirm={() => gotoStep(step + 1)}
          />
        );
      }

      if (Component === Congrats) {
        return <Component auction={auctionObj} />;
      }

      if (Component === Review) {
        return (
          <Component
            connection={connection}
            attributes={attributes}
            setAttributes={setAttributes}
            confirm={() => gotoStep(step + 1)}
          />
        );
      }
    },
    [step, attributes, connection],
  );

  const createAuction = async () => {
    let winnerLimit: WinnerLimit;
    if (attributes.category === AuctionCategory.Open) {
      if (
        attributes.items.length > 0 &&
        attributes.items[0].participationConfig
      ) {
        attributes.items[0].participationConfig.fixedPrice = new BN(
          toLamports(attributes.participationFixedPrice, mint) || 0,
        );
      }
      winnerLimit = new WinnerLimit({
        type: WinnerLimitType.Unlimited,
        usize: ZERO,
      });
    } else if (
      attributes.category === AuctionCategory.Limited ||
      attributes.category === AuctionCategory.Single
    ) {
      if (attributes.items.length > 0) {
        const item = attributes.items[0];
        if (
          attributes.category == AuctionCategory.Single &&
          item.masterEdition
        ) {
          item.winningConfigType =
            item.metadata.info.updateAuthority ===
            (wallet?.publicKey || SystemProgram.programId).toBase58()
              ? WinningConfigType.FullRightsTransfer
              : WinningConfigType.TokenOnlyTransfer;
        }
        item.amountRanges = [
          new AmountRange({
            amount: new BN(1),
            length:
              attributes.category === AuctionCategory.Single
                ? new BN(1)
                : new BN(attributes.editions || 1),
          }),
        ];
      }
      winnerLimit = new WinnerLimit({
        type: WinnerLimitType.Capped,
        usize:
          attributes.category === AuctionCategory.Single
            ? new BN(1)
            : new BN(attributes.editions || 1),
      });

      if (
        attributes.participationNFT &&
        attributes.participationNFT.participationConfig
      ) {
        attributes.participationNFT.participationConfig.fixedPrice = new BN(
          toLamports(attributes.participationFixedPrice, mint) || 0,
        );
      }
    } else {
      const tiers = tieredAttributes.tiers;
      tiers.forEach(
        c =>
          (c.items = c.items.filter(
            i => (i as TierDummyEntry).winningConfigType !== undefined,
          )),
      );
      let filteredTiers = tiers.filter(
        i => i.items.length > 0 && i.winningSpots.length > 0,
      );

      tieredAttributes.items.forEach((config, index) => {
        let ranges: AmountRange[] = [];
        filteredTiers.forEach(tier => {
          const tierRangeLookup: Record<number, AmountRange> = {};
          const tierRanges: AmountRange[] = [];
          const item = tier.items.find(
            i => (i as TierDummyEntry).safetyDepositBoxIndex == index,
          );

          if (item) {
            config.winningConfigType = (
              item as TierDummyEntry
            ).winningConfigType;
            const sorted = tier.winningSpots.sort();
            sorted.forEach((spot, i) => {
              if (tierRangeLookup[spot - 1]) {
                tierRangeLookup[spot] = tierRangeLookup[spot - 1];
                tierRangeLookup[spot].length = tierRangeLookup[spot].length.add(
                  new BN(1),
                );
              } else {
                tierRangeLookup[spot] = new AmountRange({
                  amount: new BN((item as TierDummyEntry).amount),
                  length: new BN(1),
                });
                // If the first spot with anything is winner spot 1, you want a section of 0 covering winning
                // spot 0.
                // If we have a gap, we want a gap area covered with zeroes.
                const zeroLength = i - 1 > 0 ? spot - sorted[i - 1] - 1 : spot;
                if (zeroLength > 0) {
                  tierRanges.push(
                    new AmountRange({
                      amount: new BN(0),
                      length: new BN(zeroLength),
                    }),
                  );
                }
                tierRanges.push(tierRangeLookup[spot]);
              }
            });
            // Ok now we have combined ranges from this tier range. Now we merge them into the ranges
            // at the top level.
            let oldRanges = ranges;
            ranges = [];
            let oldRangeCtr = 0,
              tierRangeCtr = 0;

            while (
              oldRangeCtr < oldRanges.length ||
              tierRangeCtr < tierRanges.length
            ) {
              let toAdd = new BN(0);
              if (
                tierRangeCtr < tierRanges.length &&
                tierRanges[tierRangeCtr].amount.gt(new BN(0))
              ) {
                toAdd = tierRanges[tierRangeCtr].amount;
              }

              if (oldRangeCtr == oldRanges.length) {
                ranges.push(
                  new AmountRange({
                    amount: toAdd,
                    length: tierRanges[tierRangeCtr].length,
                  }),
                );
                tierRangeCtr++;
              } else if (tierRangeCtr == tierRanges.length) {
                ranges.push(oldRanges[oldRangeCtr]);
                oldRangeCtr++;
              } else if (
                oldRanges[oldRangeCtr].length.gt(
                  tierRanges[tierRangeCtr].length,
                )
              ) {
                oldRanges[oldRangeCtr].length = oldRanges[
                  oldRangeCtr
                ].length.sub(tierRanges[tierRangeCtr].length);

                ranges.push(
                  new AmountRange({
                    amount: oldRanges[oldRangeCtr].amount.add(toAdd),
                    length: tierRanges[tierRangeCtr].length,
                  }),
                );

                tierRangeCtr += 1;
                // dont increment oldRangeCtr since i still have length to give
              } else if (
                tierRanges[tierRangeCtr].length.gt(
                  oldRanges[oldRangeCtr].length,
                )
              ) {
                tierRanges[tierRangeCtr].length = tierRanges[
                  tierRangeCtr
                ].length.sub(oldRanges[oldRangeCtr].length);

                ranges.push(
                  new AmountRange({
                    amount: oldRanges[oldRangeCtr].amount.add(toAdd),
                    length: oldRanges[oldRangeCtr].length,
                  }),
                );

                oldRangeCtr += 1;
                // dont increment tierRangeCtr since they still have length to give
              } else if (
                tierRanges[tierRangeCtr].length.eq(
                  oldRanges[oldRangeCtr].length,
                )
              ) {
                ranges.push(
                  new AmountRange({
                    amount: oldRanges[oldRangeCtr].amount.add(toAdd),
                    length: oldRanges[oldRangeCtr].length,
                  }),
                );
                // Move them both in this degen case
                oldRangeCtr++;
                tierRangeCtr++;
              }
            }
          }
        });
        console.log('Ranges');
        config.amountRanges = ranges;
      });

      winnerLimit = new WinnerLimit({
        type: WinnerLimitType.Capped,
        usize: new BN(attributes.winnersCount),
      });
      if (
        attributes.participationNFT &&
        attributes.participationNFT.participationConfig
      ) {
        attributes.participationNFT.participationConfig.fixedPrice = new BN(
          toLamports(attributes.participationFixedPrice, mint) || 0,
        );
      }
      console.log('Tiered settings', tieredAttributes.items);
    }

    const auctionSettings: IPartialCreateAuctionArgs = {
      winners: winnerLimit,
      endAuctionAt: new BN(
        (attributes.auctionDuration || 0) *
          (attributes.auctionDurationType == 'days'
            ? 60 * 60 * 24 // 1 day in seconds
            : attributes.auctionDurationType == 'hours'
            ? 60 * 60 // 1 hour in seconds
            : 60), // 1 minute in seconds
      ), // endAuctionAt is actually auction duration, poorly named, in seconds
      auctionGap: new BN(
        (attributes.gapTime || 0) *
          (attributes.gapTimeType == 'days'
            ? 60 * 60 * 24 // 1 day in seconds
            : attributes.gapTimeType == 'hours'
            ? 60 * 60 // 1 hour in seconds
            : 60), // 1 minute in seconds
      ),
      priceFloor: new PriceFloor({
        type: attributes.priceFloor
          ? PriceFloorType.Minimum
          : PriceFloorType.None,
        minPrice: new BN((attributes.priceFloor || 0) * LAMPORTS_PER_SOL),
      }),
      tokenMint: QUOTE_MINT.toBase58(),
      gapTickSizePercentage: attributes.tickSizeEndingPhase || null,
      tickSize: attributes.priceTick
        ? new BN(attributes.priceTick * LAMPORTS_PER_SOL)
        : null,
    };

    const _auctionObj = await createAuctionManager(
      connection,
      wallet,
      whitelistedCreatorsByCreator,
      auctionSettings,
      attributes.category === AuctionCategory.Open
        ? []
        : attributes.category !== AuctionCategory.Tiered
        ? attributes.items
        : tieredAttributes.items,
      attributes.category === AuctionCategory.Open
        ? attributes.items[0]
        : attributes.participationNFT,
      QUOTE_MINT.toBase58(),
    );
    setAuctionObj(_auctionObj);
  };

  return (
    <VStack flexGrow={1} spacing={10}>
      <Title>Sell NFT</Title>
      <Box width="100%">
        <HStack as="ol" listStyleType="none" spacing="0" mb={6}>
          {stepsByCategory[attributes.category]
            .slice(0, stepsByCategory[attributes.category].length - 1)
            .map((stepArray, index) => (
              <Step colorScheme="cyan" isCurrent={step === index}>
                {stepArray[0]}
              </Step>
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
export default Sell;
