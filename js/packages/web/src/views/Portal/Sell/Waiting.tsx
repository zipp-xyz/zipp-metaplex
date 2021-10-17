import { useState, useEffect } from 'react';
import {
  CircularProgress,
  CircularProgressLabel,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Heading } from 'components';

const Waiting = (props: {
  createAuction: () => Promise<void>;
  confirm: () => void;
}) => {
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const func = async () => {
      const inte = setInterval(
        () => setProgress(prog => Math.min(prog + 1, 99)),
        600,
      );
      await props.createAuction();
      clearInterval(inte);
      props.confirm();
    };
    func();
  }, []);

  return (
    <VStack marginTop={70} alignItems="center">
      <CircularProgress value={progress} size="120px" color="neonGreen">
        <CircularProgressLabel>{progress}%</CircularProgressLabel>
      </CircularProgress>
      <Heading>Your creation is being listed on Zipp..</Heading>
      <Text>This can take up to 30 seconds.</Text>
    </VStack>
  );
};

export default Waiting;
