import { useEffect } from 'react';
import {
  CircularProgress,
  CircularProgressLabel,
  Text,
  VStack,
} from '@chakra-ui/react';

const Waiting = (props: {
  mint: Function;
  progress: number;
  confirm: Function;
}) => {
  useEffect(() => {
    const func = async () => {
      await props.mint();
      props.confirm();
    };
    func();
  }, []);

  return (
    <VStack width="100%">
      <CircularProgress value={props.progress} size="120px" color="neonGreen">
        <CircularProgressLabel>{props.progress}%</CircularProgressLabel>
      </CircularProgress>
      <Text>Your creation is being uploaded to the decentralized web...</Text>
      <Text>This can take up to 1 minute.</Text>
    </VStack>
  );
};

export default Waiting;
