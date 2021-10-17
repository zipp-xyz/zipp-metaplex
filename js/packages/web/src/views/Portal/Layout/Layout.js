import { useState } from 'react';
import { NavMenu, Footer } from 'components';
import { Flex, HStack, Box, Text } from '@chakra-ui/react';
import ROUTES from '../routes';
import { BsFillGrid1X2Fill, BsFillPlusSquareFill } from 'react-icons/bs';

const MAXWIDTH = 1024;
const GRADIENT_HEIGHT = 600;
const OFFSET = 350;
const EXTRA_BANNER_HEIGHT = 250;

const Logo = () => {
  return (
    <svg
      id="Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 440.65 126.17"
      fill="#ffffff"
    >
      <path
        d="M246.13,278.63v8.84h-53V272.25l43.44-35.33v-1.48h-42.7v-8.83h50.8v14.72L201,277.16v1.47Z"
        transform="translate(-35.17 -192.85)"
      />
      <path
        d="M269.2,278.63h21.35V235.44H271.41v-8.83h28.71v52H320v8.84H269.2Zm17.42-70.18a8.6,8.6,0,1,1,2.52,6.07A8.25,8.25,0,0,1,286.62,208.45Z"
        transform="translate(-35.17 -192.85)"
      />
      <path
        d="M350.18,312h-9.57v-85.4h9.57v9.57h1.47a21.14,21.14,0,0,1,8.84-8.41,26.59,26.59,0,0,1,12.27-2.88A27.58,27.58,0,0,1,383.43,227a26.78,26.78,0,0,1,8.9,6,28.57,28.57,0,0,1,6.13,9.69,35.51,35.51,0,0,1,2.27,13.13v2.46a36.73,36.73,0,0,1-2.21,13.25,27.71,27.71,0,0,1-6.07,9.69,25.67,25.67,0,0,1-9,6,29.55,29.55,0,0,1-10.92,2,27.91,27.91,0,0,1-6-.68,24.1,24.1,0,0,1-5.83-2.08,25.15,25.15,0,0,1-5.09-3.44,18,18,0,0,1-3.93-4.85h-1.47Zm20.37-31.9a20.77,20.77,0,0,0,8.1-1.54,19.3,19.3,0,0,0,6.44-4.35,19.6,19.6,0,0,0,4.29-6.88,25.23,25.23,0,0,0,1.54-9.07v-2.46a24.39,24.39,0,0,0-1.54-8.89,20.45,20.45,0,0,0-4.29-6.88,19.46,19.46,0,0,0-6.5-4.47,20.21,20.21,0,0,0-8-1.6,19.14,19.14,0,0,0-8,1.66,20,20,0,0,0-6.44,4.6,21.5,21.5,0,0,0-4.35,7.05,24.64,24.64,0,0,0-1.6,9v1.47a25,25,0,0,0,1.6,9.15,21.5,21.5,0,0,0,4.35,7.05,19.24,19.24,0,0,0,6.44,4.54A19.75,19.75,0,0,0,370.55,280.11Z"
        transform="translate(-35.17 -192.85)"
      />
      <path
        d="M425.27,312H415.7v-85.4h9.57v9.57h1.48a21.12,21.12,0,0,1,8.83-8.41,26.59,26.59,0,0,1,12.27-2.88A27.58,27.58,0,0,1,458.52,227a26.68,26.68,0,0,1,8.9,6,28.42,28.42,0,0,1,6.13,9.69,35.51,35.51,0,0,1,2.28,13.13v2.46a37,37,0,0,1-2.21,13.25,27.88,27.88,0,0,1-6.08,9.69,25.58,25.58,0,0,1-9,6,29.55,29.55,0,0,1-10.92,2,28,28,0,0,1-6-.68,24.26,24.26,0,0,1-5.83-2.08,25.15,25.15,0,0,1-5.09-3.44,18.12,18.12,0,0,1-3.92-4.85h-1.48Zm20.37-31.9a20.69,20.69,0,0,0,8.1-1.54,19.3,19.3,0,0,0,6.44-4.35,19.76,19.76,0,0,0,4.3-6.88,25.45,25.45,0,0,0,1.53-9.07v-2.46a24.6,24.6,0,0,0-1.53-8.89,20.63,20.63,0,0,0-4.3-6.88,19.46,19.46,0,0,0-6.5-4.47,20.21,20.21,0,0,0-8-1.6,19.09,19.09,0,0,0-8,1.66,19.93,19.93,0,0,0-6.45,4.6,21.5,21.5,0,0,0-4.35,7.05,24.64,24.64,0,0,0-1.6,9v1.47a25,25,0,0,0,1.6,9.15,21.5,21.5,0,0,0,4.35,7.05,19.18,19.18,0,0,0,6.45,4.54A19.7,19.7,0,0,0,445.64,280.11Z"
        transform="translate(-35.17 -192.85)"
      />
      <path
        d="M119,208.69c-.68,1.3-1.38,2.62-2.14,4-.51.95-1,1.86-1.54,2.79a47.53,47.53,0,0,1-24.93,88c-.78,0-1.56,0-2.33-.06-2.3,2.25-4.74,4.58-7.27,6.91A55.23,55.23,0,0,0,119,208.69Z"
        transform="translate(-35.17 -192.85)"
      />
      <path
        d="M65.52,296.41a47.53,47.53,0,0,1,24.9-88c.83,0,1.66,0,2.48.07,2.27-2.24,4.68-4.56,7.21-6.9A55.23,55.23,0,0,0,61.83,303.19q1.05-2,2.22-4.12C64.53,298.17,65,297.3,65.52,296.41Z"
        transform="translate(-35.17 -192.85)"
      />
      <path
        d="M109.48,252c-5.38-1.78-10.79-3.44-16.22-5l-4.16-1.18c1-1.43,2-2.88,3-4.32,3.47-5.1,6.8-10.3,10.07-15.56q4-6.56,7.76-13.28c.53-1,1.08-1.87,1.59-2.83.72-1.31,1.42-2.63,2.12-3.95,2.21-4.21,4.31-8.51,6.22-13-4.37,3.33-8.5,6.86-12.51,10.48l-1.87,1.7c-1.61,1.47-3.18,3-4.74,4.49-2.92,2.8-5.8,5.62-8.63,8.49-4.31,4.44-8.55,8.92-12.66,13.52-2.06,2.3-4.12,4.59-6.11,6.94s-4,4.65-6,7l-8.18,10,12.72,4.08c2.69.86,5.38,1.77,8.08,2.59l8.13,2.46,4.1,1.17c-1,1.45-2,2.89-3,4.36-3.52,5.11-6.89,10.35-10.19,15.63-2.73,4.44-5.38,8.92-7.94,13.49-.51.9-1,1.79-1.54,2.7q-1.11,2-2.19,4.07c-2.21,4.21-4.33,8.49-6.24,12.94,4.4-3.32,8.55-6.85,12.57-10.46l2-1.76c1.6-1.45,3.15-2.94,4.7-4.43q4.47-4.25,8.79-8.6c4.35-4.46,8.64-9,12.77-13.6q3.15-3.45,6.17-7c2-2.33,4.06-4.68,6-7.08l8.18-9.95Z"
        transform="translate(-35.17 -192.85)"
      />
    </svg>
  );
};

const Layout = ({ children, banner = null }) => {
  const menus = [
    {
      label: 'Artworks',
      route: ROUTES.ARTWORKS,
      bg: '#F6AD55',
      icon: BsFillGrid1X2Fill,
    },
    {
      label: 'New Drop',
      route: ROUTES.NEW_DROP,
      bg: '#68D391',
      icon: BsFillPlusSquareFill,
    },
  ];

  const [selected, setSelected] = useState(menus[0]);

  return (
    <>
      <Flex flexDirection="column" mb={30} position="relative">
        <Flex justifyContent="center">
          <HStack width={MAXWIDTH} py={1}>
            <HStack mr={14} alignItems="center" spacing={0} height="40px">
              <Box width="100px">
                <Logo />
              </Box>
              {/* <Text
                fontSize={30}
                fontFamily="Space mono"
                color="white"
                pb={1}
                mb={0}
              >
                zipp
              </Text> */}
            </HStack>

            <NavMenu.Desktop />
          </HStack>
        </Flex>
        <Flex
          flexGrow={1}
          alignItems="center"
          position="relative"
          direction="column"
        >
          <Flex
            width="100% "
            direction="column"
            backgroundImage={`url('https://stefan-kovac-random.s3.us-east-2.amazonaws.com/header-background.jpg')`}
            backgroundPosition="bottom"
            position="relative"
            minHeight={GRADIENT_HEIGHT}
            backgroundSize="100% 100%"
          >
            {/* Overlays */}
            <Flex
              position="absolute"
              width="100%"
              height="100%"
              opacity={0.75}
              backgroundImage="radial-gradient(ellipse at top right,
              rgba(63, 211, 184, 0) 10%, rgba(63, 211, 184, 1) 100%)"
            />
            <Flex
              width="100%"
              height="100%"
              opacity={0.75}
              position="absolute"
              backgroundImage="radial-gradient(ellipse at bottom left,
                rgba(215, 152, 255, 0) 40%, rgba(215, 152, 255, 1) 100%)"
            />
            <Flex
              width="100%"
              height="100%"
              opacity={1}
              position="absolute"
              backgroundImage="linear-gradient(rgba(31, 36, 35, 0) 40%, #1f2423 100%)"
            />
            {/* End Overlays */}
            <Flex
              justifyContent="center"
              alignItems="center"
              zIndex={1000}
              flexGrow={1}
              width="100%"
              height="100%"
              direction="column"
              // bg="white"
              pb={banner ? OFFSET - EXTRA_BANNER_HEIGHT : OFFSET}
            >
              {banner}
            </Flex>
          </Flex>
          <Flex
            flexDirection="column"
            zIndex={1000}
            mt={banner ? -OFFSET + EXTRA_BANNER_HEIGHT : -OFFSET}
            id="content"
          >
            <Flex flexDirection="row" minWidth={MAXWIDTH} minHeight={800}>
              {/* {withMenu && (
            <Flex minWidth="250px" direction="column" bg="white">
              <MotionFlex
                width="254px"
                bg="#17181C"
                height="100%"
                p="4"
                flexDirection="column"
                overflow="hidden"
                animate="254px"
              >
                <Menu
                  setSelected={setSelected}
                  selected={selected}
                  menus={menus}
                />
              </MotionFlex>
            </Flex>
          )} */}
              <Flex
                p={8}
                m={0}
                flexGrow={1}
                bg="offwhite"
                direction="column"
                maxWidth={MAXWIDTH}
                borderRadius={8}
              >
                {children}
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <Footer />
    </>
  );
};

Layout.defaultProps = {
  withMenu: false,
};

export default Layout;
