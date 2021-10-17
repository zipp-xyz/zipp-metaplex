import { VStack, SimpleGrid, Flex, Text, Button } from '@chakra-ui/react';
import { Title, MotionCard } from 'components';
import styled from 'styled-components';
import { Link } from 'react-scroll';

const StyledText = styled.span`
  background-image: linear-gradient(
    120deg,
    #009962 0%,
    #00ffa3 50%,
    #009962 100%
  );
  background-repeat: no-repeat;
  background-size: 100% 0.2em;
  background-position: 0 95%;
  text-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);
  color: white;
`;

export const Banner = () => {
  return (
    <SimpleGrid columns={2} width={1024} p={8}>
      <Flex
        flex={1}
        mt={12}
        flexDirection="column"
        justifyContent="center"
        alignItems="start"
        spacing={6}
      >
        <Text
          fontFamily="Raleway"
          color="gray.300"
          fontSize={48}
          fontWeight={500}
          lineHeight={1}
          mb={4}
        >
          Explore, collect <br />
          and sell
          <br />
          <StyledText>phenomenal NFTs</StyledText>
        </Text>
        <Text color="gray.300" fontFamily="Raleway" fontSize={24}>
          on the best audio NFT marketplace.
        </Text>
        <Button
          colorScheme="cyan"
          mt={12}
          size="md"
          as={Link}
          to="content"
          spy={true}
          smooth={true}
          offset={-50}
          duration={500}
        >
          Explore
        </Button>
      </Flex>
      <Flex flex={1} justifyContent="center" alignItems="center">
        <MotionCard />
      </Flex>
    </SimpleGrid>
  );
};
