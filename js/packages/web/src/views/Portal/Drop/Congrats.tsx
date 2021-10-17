import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { StringPublicKey } from '@oyster/common';
import {
  Button,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { Confetti } from 'components';

const Congrats = (props: {
  nft?: {
    metadataAccount: StringPublicKey;
  };
}) => {
  const history = useHistory();
  const [isVisible, setIsVisible] = useState(true);

  const newTweetURL = () => {
    const params = {
      text: "I've created a new NFT artwork on Metaplex, check it out!",
      url: `${
        window.location.origin
      }/#/art/${props.nft?.metadataAccount.toString()}`,
      hashtags: 'NFT,Crypto,Metaplex',
      // via: "Metaplex",
      related: 'Metaplex,Solana',
    };
    const queryParams = new URLSearchParams(params).toString();
    return `https://twitter.com/intent/tweet?${queryParams}`;
  };

  return (
    <>
      <Modal isOpen={isVisible} onClose={() => setIsVisible(false)} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Congratulations, you created an NFT!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack>
              <Button onClick={_ => window.open(newTweetURL(), '_blank')}>
                <span>Share it on Twitter</span>
                <span>&gt;</span>
              </Button>
              <Button
                onClick={_ =>
                  history.push(
                    `/portal/art/${props.nft?.metadataAccount.toString()}`,
                  )
                }
              >
                <span>See it in your collection</span>
                <span>&gt;</span>
              </Button>
              <Button onClick={_ => history.push('/portal/auction/create')}>
                <span>Sell it via auction</span>
                <span>&gt;</span>
              </Button>
            </VStack>
            <Confetti />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Congrats;
