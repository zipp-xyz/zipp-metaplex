import {
  AccountsProvider,
  ConnectionProvider,
  StoreProvider,
  WalletProvider,
} from '@oyster/common';
import { FC } from 'react';
import { UseWalletProvider } from 'use-wallet';
import { ConfettiProvider } from 'components/Confetti';
import { MetaProvider, CoingeckoProvider, PlayerProvider } from 'contexts';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from 'theme';

export const Providers: FC = ({ children }) => {
  return (
    <ChakraProvider theme={theme}>
      <ConnectionProvider>
        <WalletProvider>
          <UseWalletProvider chainId={5}>
            <AccountsProvider>
              <CoingeckoProvider>
                <StoreProvider
                  ownerAddress={process.env.NEXT_PUBLIC_STORE_OWNER_ADDRESS}
                  storeAddress={process.env.NEXT_PUBLIC_STORE_ADDRESS}
                >
                  <MetaProvider>
                    <PlayerProvider>
                      <ConfettiProvider>{children}</ConfettiProvider>
                    </PlayerProvider>
                  </MetaProvider>
                </StoreProvider>
              </CoingeckoProvider>
            </AccountsProvider>
          </UseWalletProvider>
        </WalletProvider>
      </ConnectionProvider>
    </ChakraProvider>
  );
};
