import { useLocation } from 'react-router-dom';
import { Heading, MusicCard, Notification } from 'components';
import musicQuery from './response.json';
import { Flex, VStack, Image } from '@chakra-ui/react';
import { useWallet } from '@solana/wallet-adapter-react';
// import ChartsComponent from "./ChartsComponent";
import bitcoinWallet from 'assets/BitcoinWallet.png';

const Balances = ({ yourNftDrops }) => {
  const { wallet, connected } = useWallet();
  const location = useLocation();

  return (
    <>
      {wallet && connected ? (
        <>
          <Notification
            showNotification={location.state?.showNotification ?? false}
          />
          {/* <ChartsComponent /> */}
          <Flex flexDirection="column">
            <Heading fontSize={4} mb={2}>
              Your NFT Collections
            </Heading>
          </Flex>
          <Flex flexGrow={1} flexDirection="row" mb={4}>
            {musicQuery.map((musicObject, i) => (
              <MusicCard key={i} {...musicObject} />
            ))}
          </Flex>
          <Flex flexDirection="column">
            <Heading fontSize={4} mb={2}>
              Your NFT Drops
            </Heading>
          </Flex>
          <Flex flexGrow={1} flexDirection="row" mb={4}>
            {yourNftDrops.map((musicObject, i) => (
              <MusicCard key={i} {...musicObject} />
            ))}
          </Flex>
        </>
      ) : (
        <VStack>
          <Heading fontSize={4} mb={2}>
            You're in! Now connect your wallet!
          </Heading>
          <Image
            src={bitcoinWallet}
            alt="No wallet connected"
            width="300px"
            height="300px"
            opacity="50%"
            my={10}
          />
        </VStack>
      )}
    </>
  );
};

export default Balances;
