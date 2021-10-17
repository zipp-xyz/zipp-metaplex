import { useMemo } from 'react';
import { Flex, HStack, Button } from '@chakra-ui/react';
import {
  HiLibrary,
  HiUserGroup,
  HiMusicNote,
  HiColorSwatch,
} from 'react-icons/hi';
import { NavItem } from './NavItem';
import { useWallet } from '@solana/wallet-adapter-react';
import { ConnectButton, CurrentUserBadge } from '@oyster/common';
import { useMeta } from 'contexts';

// const MobileNavMenu = props => {
//   const { isOpen } = props;
//   return (
//     <Flex
//       hidden={!isOpen}
//       as="nav"
//       direction="column"
//       bg="blue.600"
//       position="fixed"
//       height="calc(100vh - 4rem)"
//       top="16"
//       insetX="0"
//       zIndex={10}
//       w="full"
//     >
//       <Box px="4">
//         <NavItem.Mobile active label="Dashboard" />
//         <NavItem.Mobile label="Explore" />
//       </Box>
//     </Flex>
//   );
// };

const DesktopNavMenu = () => {
  const { publicKey, connected } = useWallet();
  const { whitelistedCreatorsByCreator, store } = useMeta();
  const pubkey = publicKey?.toBase58() || '';
  const canCreate = useMemo(() => {
    return (
      store?.info?.public ||
      whitelistedCreatorsByCreator[pubkey]?.info?.activated
    );
  }, [pubkey, whitelistedCreatorsByCreator, store]);

  return (
    <>
      <NavItem.Desktop
        icon={<HiLibrary />}
        label="Explore"
        to="/portal/explore"
      />
      <NavItem.Desktop
        icon={<HiMusicNote />}
        label={connected ? 'My Audio' : 'Audio'}
        to="/portal/artworks"
      />
      <Flex flex={1} />
      {connected ? (
        <>
          {canCreate && (
            <NavItem.Desktop
              icon={<HiColorSwatch />}
              label="Create"
              to="/portal/new-drop"
            />
          )}
          <NavItem.Desktop
            icon={<HiUserGroup />}
            label="Sell"
            to="/portal/sell-drop"
          />
          <Button variant="outline" colorScheme="whiteAlpha" size="sm">
            <CurrentUserBadge
              showBalance={false}
              showAddress={false}
              iconSize={24}
            />
          </Button>
        </>
      ) : (
        <ConnectButton type="primary" allowWalletChange />
      )}
    </>
  );
};

export const NavMenu = {
  // Mobile: MobileNavMenu,
  Desktop: DesktopNavMenu,
};
