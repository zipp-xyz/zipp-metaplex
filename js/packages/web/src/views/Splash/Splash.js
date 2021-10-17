import { Text, Link } from 'components';
import ZippAnimation from 'components/assets/ZippAnimation';
import Typed from 'react-typed';

import { Flex } from '@chakra-ui/react';

const Splash = () => {
  return (
    <Flex
      width="100vw"
      height="100%"
      bg="white"
      alignItems="center"
      justifyContent="center"
      direction="column"
      flexDirection="column"
    >
      <Flex
        flexGrow={1}
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <Flex
          my={[25, 100]}
          flexDirection={['column', 'row']}
          alignItems="center"
          justifyContent="center"
        >
          <ZippAnimation width={150} height={150} />
          <Text
            fontFamily="Space mono"
            fontSize={[6, '112px']}
            mb={25}
            color="black"
          >
            zipp
          </Text>
        </Flex>
        <Flex
          width={[300, 550]}
          height={50}
          alignItems="center"
          justifyContent="center"
        >
          <Text
            fontFamily="JetBrains Mono"
            fontSize={[1, 3]}
            color="black"
            textAlign="center"
            // mb={[4, 6]}
          >
            <Typed
              strings={[
                'BUILDING FOR AUDIO. IN CRYPTO. ON SOLANA.',
                'COMING SOON.',
              ]}
              startDelay={2000}
              backDelay={3000}
              backSpeed={40}
              typeSpeed={50}
              cursorChar="_"
              loop={true}
            />
          </Text>
        </Flex>
      </Flex>
      <Flex mb={50} flexDirection="column" alignItems="center">
        <Text
          fontFamily="JetBrains Mono"
          fontSize={[1, 3]}
          color="black"
          textAlign="center"
          mb={[2, 46]}
        >
          📍 Miami | Toronto
        </Text>
        <Link href="https://twitter.com/zipp_xyz">
          {/* <Twitter style={{ color: "#007ce0", marginRight: 10 }} /> */}
        </Link>
      </Flex>
    </Flex>
  );
};

export default Splash;
