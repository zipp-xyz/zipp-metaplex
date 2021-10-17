import { Flex, Box, Text } from '@chakra-ui/react';
import { Title } from 'components';

export const AttributeRow = ({
  title = '' as string,
  label = '' as string,
  value = '' as any,
  children = null as any,
}) => {
  return (
    <Flex
      p={2}
      my={1}
      bg="white"
      borderRadius={3}
      boxShadow="rgba(0, 0, 0, 0.16) 0px 1px 4px"
      alignItems="center"
    >
      <Flex flex={1} alignItems="center">
        {title ? (
          <Title fontSize="24px" mb={0}>
            {title}
          </Title>
        ) : (
          <Text>{label}</Text>
        )}
      </Flex>
      {children || (
        <Text
          fontSize="md"
          fontWeight={500}
          color="black"
          fontFamily="JetBrains Mono"
        >
          {value}
        </Text>
      )}
    </Flex>
  );
};

export const AttributeBox = ({
  title = '' as string,
  label = '' as string,
  value = '' as any,
  children = null as any,
}) => {
  return (
    <Flex
      p={2}
      my={1}
      bg="white"
      borderRadius={3}
      flexDirection="column"
      boxShadow="rgba(0, 0, 0, 0.16) 0px 1px 4px"
    >
      <Flex borderBottom={1} borderColor="#eee" borderStyle="solid" mb={3}>
        {title ? (
          <Title fontSize="24px" mb={0}>
            {title}
          </Title>
        ) : (
          <Text
            fontSize="lg"
            fontWeight={500}
            color="black"
            fontFamily="JetBrains Mono"
            mb={2}
          >
            {label}
          </Text>
        )}
      </Flex>
      <Box width="100%">{children || <Text>{value}</Text>}</Box>
    </Flex>
  );
};
