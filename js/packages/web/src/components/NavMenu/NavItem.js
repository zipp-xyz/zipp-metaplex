import { Box, HStack, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import * as React from 'react';

const DesktopNavItem = props => {
  const { icon, label, active, to, ...otherProps } = props;
  return (
    <Button
      size="sm"
      as={Link}
      to={to}
      colorScheme="none"
      leftIcon={icon}
      _hover={{
        color: 'white',
        opacity: 0.7,
      }}
      {...otherProps}
    >
      <Box fontWeight="semibold">{label}</Box>
    </Button>
  );
};

const MobileNavItem = props => {
  const { label, href = '#', active } = props;
  return (
    <Box
      as="a"
      display="block"
      href={href}
      px="3"
      py="3"
      rounded="md"
      fontWeight="semibold"
      aria-current={active ? 'page' : undefined}
      _hover={{ bg: 'whiteAlpha.200' }}
      _activeLink={{ bg: 'blackAlpha.300', color: 'white' }}
    >
      {label}
    </Box>
  );
};

export const NavItem = {
  Desktop: DesktopNavItem,
  Mobile: MobileNavItem,
};
