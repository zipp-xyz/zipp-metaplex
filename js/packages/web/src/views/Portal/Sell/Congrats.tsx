import { useHistory } from 'react-router-dom';
import { Confetti } from 'components';
import { StringPublicKey } from '@oyster/common';
import { Button, VStack } from '@chakra-ui/react';
import { Heading } from 'components';

const Congrats = (props: {
  auction?: {
    vault: StringPublicKey;
    auction: StringPublicKey;
    auctionManager: StringPublicKey;
  };
}) => {
  const history = useHistory();

  const newTweetURL = () => {
    const params = {
      text: "I've created a new NFT auction on Metaplex, check it out!",
      url: `${
        window.location.origin
      }/#/auction/${props.auction?.auction.toString()}`,
      hashtags: 'NFT,Crypto,Metaplex',
      // via: "Metaplex",
      related: 'Metaplex,Solana',
    };
    const queryParams = new URLSearchParams(params).toString();
    return `https://twitter.com/intent/tweet?${queryParams}`;
  };

  return (
    <>
      <VStack marginTop={70} alignItems="center">
        <Heading>Congratulations! Your auction is now live.</Heading>
        <div className="congrats-button-container">
          <Button onClick={_ => window.open(newTweetURL(), '_blank')}>
            <span>Share it on Twitter</span>
            <span>&gt;</span>
          </Button>
          <Button
            onClick={_ =>
              history.push(
                `/portal/auction/${props.auction?.auction.toString()}`,
              )
            }
          >
            <span>See it in your auctions</span>
            <span>&gt;</span>
          </Button>
        </div>
      </VStack>
      <Confetti />
    </>
  );
};

export default Congrats;
