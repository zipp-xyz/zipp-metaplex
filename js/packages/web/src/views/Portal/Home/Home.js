import { programIds } from '@oyster/common';
import { VStack, Button } from '@chakra-ui/react';

const CURRENT_STORE = programIds().store;

const Home = () => {
  console.log(CURRENT_STORE);
  return CURRENT_STORE ? (
    <>
      <VStack>
        <Button>Connect</Button>
        CONFIGURED
      </VStack>
    </>
  ) : (
    <>NOT CONFIGURED</>
  );
};

export default Home;
