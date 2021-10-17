import { WalletAdapter, WalletError } from '@solana/wallet-adapter-base';
import {
  useWallet,
  WalletProvider as BaseWalletProvider,
} from '@solana/wallet-adapter-react';
import {
  getLedgerWallet,
  getMathWallet,
  getPhantomWallet,
  getSolflareWallet,
  getSolletWallet,
  getSolongWallet,
  getTorusWallet,
  WalletName,
} from '@solana/wallet-adapter-wallets';
import React, {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
// import { notify } from 'utils';

import {
  Modal,
  Button,
  Flex,
  Image,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  VStack,
  Heading,
  Grid,
} from '@chakra-ui/react';

export interface WalletModalContextState {
  visible: boolean;
  setVisible: (open: boolean) => void;
}

export const WalletModalContext = createContext<WalletModalContextState>(
  {} as WalletModalContextState,
);

export function useWalletModal(): WalletModalContextState {
  return useContext(WalletModalContext);
}

export const WalletModal: FC = () => {
  const { wallets, wallet: selected, select } = useWallet();
  const { visible, setVisible } = useWalletModal();
  const [showWallets, setShowWallets] = useState(false);
  const close = useCallback(() => {
    setVisible(false);
    setShowWallets(false);
  }, [setVisible, setShowWallets]);

  return (
    <Modal isOpen={visible} onClose={close} isCentered size="xl">
      <ModalOverlay />
      <ModalContent bg="offblack">
        <ModalHeader color="white">{}</ModalHeader>
        <ModalCloseButton color="white" />
        <ModalBody>
          <Flex justifyContent="center" my={6}>
            <Heading color="white" size="md">
              {selected
                ? 'Select your wallet provider'
                : 'You must be signed in to place a bid'}
            </Heading>
          </Flex>
          {selected || showWallets ? (
            <Grid templateColumns="repeat(2, 1fr)" gap={2}>
              {wallets.map(wallet => {
                const onClick = function () {
                  select(wallet.name);
                  close();
                };

                return (
                  <Button
                    key={wallet.name}
                    size="large"
                    width="100%"
                    textTransform="none"
                    colorScheme="whiteAlpha"
                    variant="outline"
                    py={4}
                    onClick={onClick}
                    mb={0}
                    leftIcon={
                      <Image
                        alt={`${wallet.name}`}
                        width={10}
                        height={10}
                        src={wallet.icon}
                        ml={6}
                      />
                    }
                  >
                    <VStack flex={1}>
                      <Text fontSize="lg" textTransform="uppercase">
                        {wallet.name}
                      </Text>
                      <Text fontSize="sm">{wallet.url}</Text>
                    </VStack>
                  </Button>
                );
              })}
            </Grid>
          ) : (
            <>
              <Button
                size="large"
                width="100%"
                textTransform="none"
                colorScheme="whiteAlpha"
                variant="outline"
                py={4}
                onClick={() => {
                  select(WalletName.Phantom);
                  close();
                }}
                leftIcon={
                  <Image
                    alt="Phantom Wallet"
                    width={10}
                    height={10}
                    src="https://www.phantom.app/img/logo.png"
                    ml={6}
                  />
                }
              >
                <VStack flex={1}>
                  <Text fontSize="lg" textTransform="uppercase">
                    Sign in with Phantom
                  </Text>
                </VStack>
              </Button>

              <Text
                onClick={_ => setShowWallets(true)}
                cursor="pointer"
                mt={10}
              >
                Select a different Solana wallet
              </Text>
            </>
          )}
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={close}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>

    // <MetaplexModal visible={visible} onCancel={close}>

    //   <h2>{selected ? 'Change provider' : 'Welcome to Metaplex'}</h2>
    //   <p>
    //     {selected
    //       ? 'Feel free to switch wallet provider'
    //       : 'You must be signed in to place a bid'}
    //   </p>

    //   <br />
    //   {selected || showWallets ? (
    //     wallets.map(wallet => {
    //       return (
    //         <Button
    //           key={wallet.name}
    //           size="large"
    //           type={wallet === selected ? 'primary' : 'ghost'}
    //           onClick={() => {
    //             select(wallet.name);
    //             close();
    //           }}
    //           icon={
    //             <img
    //               alt={`${wallet.name}`}
    //               width={20}
    //               height={20}
    //               src={wallet.icon}
    //               style={{ marginRight: 8 }}
    //             />
    //           }
    //           style={{
    //             display: 'block',
    //             width: '100%',
    //             textAlign: 'left',
    //             marginBottom: 8,
    //           }}
    //         >
    //           {wallet.name}
    //         </Button>
    //       );
    //     })
    //   ) : (
    //     <>
    //       <Button
    //         className="metaplex-button"
    //         style={{
    //           width: '80%',
    //           fontWeight: 'unset',
    //         }}
    //         onClick={() => {
    //           select(WalletName.Phantom);
    //           close();
    //         }}
    //       >
    //         <span>
    //           <img
    //             src="https://www.phantom.app/img/logo.png"
    //             style={{ width: '1.2rem' }}
    //           />
    //           &nbsp;Sign in with Phantom
    //         </span>
    //         <span>&gt;</span>
    //       </Button>
    //       <p
    //         onClick={() => setShowWallets(true)}
    //         style={{ cursor: 'pointer', marginTop: 10 }}
    //       >
    //         Select a different Solana wallet
    //       </p>
    //     </>
    //   )}
    // </MetaplexModal>
  );
};

export const WalletModalProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { publicKey } = useWallet();
  const [connected, setConnected] = useState(!!publicKey);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (publicKey) {
      const base58 = publicKey.toBase58();
      const keyToDisplay =
        base58.length > 20
          ? `${base58.substring(0, 7)}.....${base58.substring(
              base58.length - 7,
              base58.length,
            )}`
          : base58;

      // notify({
      //   message: 'Wallet update',
      //   description: 'Connected to wallet ' + keyToDisplay,
      // });
    }
  }, [publicKey]);

  useEffect(() => {
    if (!publicKey && connected) {
      // notify({
      //   message: 'Wallet update',
      //   description: 'Disconnected from wallet',
      // });
    }
    setConnected(!!publicKey);
  }, [publicKey, connected, setConnected]);

  return (
    <WalletModalContext.Provider
      value={{
        visible,
        setVisible,
      }}
    >
      {children}
      <WalletModal />
    </WalletModalContext.Provider>
  );
};

export const WalletProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const wallets = useMemo(
    () => [
      getPhantomWallet(),
      getSolflareWallet(),
      getTorusWallet({
        options: {
          // @FIXME: this should be changed for Metaplex, and by each Metaplex storefront
          clientId:
            'BOM5Cl7PXgE9Ylq1Z1tqzhpydY0RVr8k90QQ85N7AKI5QGSrr9iDC-3rvmy0K_hF0JfpLMiXoDhta68JwcxS1LQ',
        },
      }),
      getLedgerWallet(),
      getSolongWallet(),
      getMathWallet(),
      getSolletWallet(),
    ],
    [],
  );

  const onError = useCallback((error: WalletError) => {
    console.error(error);
    // notify({
    //   message: 'Wallet error',
    //   description: error.message,
    // });
  }, []);

  return (
    <BaseWalletProvider wallets={wallets} onError={onError} autoConnect>
      <WalletModalProvider>{children}</WalletModalProvider>
    </BaseWalletProvider>
  );
};

export type WalletSigner = Pick<
  WalletAdapter,
  'publicKey' | 'signTransaction' | 'signAllTransactions'
>;
