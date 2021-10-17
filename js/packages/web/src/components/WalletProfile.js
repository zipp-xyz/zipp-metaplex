import React from 'react';
import {
  Box,
  VStack,
  Text,
  useColorModeValue as mode,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { useWallet } from '@solana/wallet-adapter-react';
import { maskWalletAddress } from 'utils';

const WalletProfile = () => {
  const { publicKey, select, disconnect } = useWallet();

  return (
    <VStack>
      {publicKey ? (
        <Menu>
          <MenuButton>
            <Text fontSize="sm">Wallet Address</Text>
            <Text
              fontSize="xs"
              lineHeight="shorter"
              color={mode('gray.300', 'gray.300')}
            >
              {maskWalletAddress(publicKey.toBase58())}
            </Text>
          </MenuButton>
          <MenuList>
            <MenuItem rounded="md" onClick={disconnect}>
              <Text color={mode('gray.600', 'gray.400')}>Disconnect</Text>
            </MenuItem>
          </MenuList>
        </Menu>
      ) : (
        <Box onClick={select}>
          <Text fontSize="sm">No wallet</Text>
          <Text
            fontSize="xs"
            lineHeight="shorter"
            color={mode('gray.300', 'gray.300')}
          >
            Connect Phantom Wallet
          </Text>
        </Box>
      )}
    </VStack>
  );
};

export default WalletProfile;
