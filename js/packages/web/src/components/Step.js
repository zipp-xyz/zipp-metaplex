import { Box, Flex, useColorModeValue } from '@chakra-ui/react';
import * as React from 'react';
import { SkewBox, StepContent } from 'components';

const Step = props => {
  const { children, isCurrent } = props;
  const color = useColorModeValue('black', 'gray.900');
  return (
    <Box as="li" flex="1">
      <Box as="button" outline={0} className="group" width="full">
        <Flex
          align="center"
          height="12"
          justify="center"
          position="relative"
          css={{ '--arrow-skew': '20deg' }}
        >
          <SkewBox isCurrent={isCurrent} placement="top" />
          <StepContent color={isCurrent ? color : 'inherit'}>
            {children}
          </StepContent>
          <SkewBox isCurrent={isCurrent} placement="bottom" />
        </Flex>
      </Box>
    </Box>
  );
};

export default Step;
