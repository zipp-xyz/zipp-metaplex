import React, { useEffect, useState } from 'react';
import { useSolPrice } from '../../contexts';
import { formatUSD } from '@oyster/common';
import { Text, VStack, HStack } from '@chakra-ui/react';

interface IAmountLabel {
  bg?: string;
  amount: number | string;
  displayUSD?: boolean;
  label?: string;
  title?: string | boolean | undefined;
  style?: object;
  containerStyle?: object;
  fontStyle?: object;
}

export const AmountLabel = (props: IAmountLabel) => {
  const {
    amount: _amount,
    displayUSD = true,
    title = '',
    style = {},
    label = '',
    fontStyle = {},
    ...otherProps
  } = props;

  const amount = typeof _amount === 'string' ? parseFloat(_amount) : _amount;

  const solPrice = useSolPrice();

  const [priceUSD, setPriceUSD] = useState<number | undefined>(undefined);

  useEffect(() => {
    setPriceUSD(solPrice * amount);
  }, [amount, solPrice]);

  const PriceNaN = isNaN(amount);

  return (
    <HStack p={2} {...otherProps}>
      <VStack flex={1} alignItems="flex-start" spacing={0}>
        {title && PriceNaN === false && (
          <Text fontSize="lg" {...fontStyle} textTransform="capitalize">
            {title}
          </Text>
        )}
        {label && PriceNaN === false && <Text fontSize="md">{label}</Text>}
      </VStack>
      <VStack spacing={0} alignItems="flex-end">
        <Text fontSize={24} fontWeight={700}>
          ◎ {amount}
        </Text>
        {displayUSD &&
          (PriceNaN === false ? (
            <Text>{formatUSD.format(priceUSD || 0)}</Text>
          ) : (
            <Text>Place Bid</Text>
          ))}
      </VStack>
    </HStack>
  );
};
