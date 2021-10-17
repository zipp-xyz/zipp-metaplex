import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { Flex } from '@chakra-ui/react';

const MotionSvg = styled(motion.svg)`
  width: 100%;
  overflow: visible;
  stroke: #fff;
  stroke-width: 0;
  stroke-linejoin: round;
  stroke-linecap: round;
`;

const white = '#fff';
const grey = '#1f2423';

const ZippAnimation = ({ width, height, light, delay }) => (
  <Flex
    width={width}
    height={height}
    overflow="hidden"
    alignItems="center"
    justifyContent="center"
    direction="column"
  >
    <MotionSvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
      <defs>
        <linearGradient id="gradient" gradientTransform="rotate(0, 0.5, 0.5)">
          <motion.stop
            offset="0"
            animate={{
              stopColor: [
                'rgba(255,255,255,0)',
                '#fa8bff',
                '#2bd2ff',
                '#2bff88',
                'rgba(255,255,255,0)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: delay }}
          />
          <motion.stop
            offset="0.5"
            animate={{
              stopColor: [
                'rgba(255,255,255,0)',
                '#2bd2ff',
                '#2bff88',
                'rgba(255,255,255,0)',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: 0.2,
              repeatDelay: 5,
            }}
          />
          <motion.stop
            offset="1"
            animate={{
              stopColor: [
                'rgba(255,255,255,0)',
                '#2bff88',
                'rgba(255,255,255,0)',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: 0.4,
              repeatDelay: 5,
            }}
          />
        </linearGradient>
      </defs>
      <motion.path
        d="M202.7,61.7c-1.5,2.9-3,5.7-4.4,8.3c-1.1,2-2.2,4.1-3.3,6.1c25,15.2,41.7,42.7,41.7,74c0,47.8-38.9,86.7-86.7,86.7
        c-0.4,0-0.7,0-1.1,0c-5,4.8-10.4,9.9-15.9,14.9c5.6,0.9,11.2,1.4,17.1,1.4c56.8,0,103-46.2,103-103
        C253,112.6,232.8,79.7,202.7,61.7z"
        fill={light ? white : grey}
      />
      <motion.path
        d="M105,224.1c-24.9-15.2-41.6-42.7-41.6-74c0-47.8,38.9-86.7,86.7-86.7c0.4,0,0.8,0,1.2,0c4.9-4.8,10.3-9.9,15.9-14.9
        c-5.6-0.9-11.3-1.4-17.1-1.4c-56.8,0-103,46.2-103,103c0,37.5,20.2,70.4,50.2,88.4c1.5-2.9,3-5.7,4.4-8.3
        C102.7,228.2,103.8,226.1,105,224.1z"
        fill={light ? white : grey}
      />
      <motion.path
        d="M171,138.2c-5.1-1.8-10.2-3.5-15.4-5.2c-2.8-0.9-5.5-1.8-8.3-2.7c8.2-11.8,16.1-23.8,23.7-36.1
        c5.9-9.8,11.8-19.6,17.2-29.7c5.5-10.1,10.7-20.4,15.3-31.3c-9.5,6.9-18.3,14.4-26.9,22.1c-8.6,7.6-16.8,15.6-25,23.6
        c-16.1,16.1-31.5,32.9-46.1,50.2l-15.7,18.5l23.9,8.8c5.1,1.9,10.2,3.7,15.3,5.5c5.1,1.8,10.2,3.5,15.4,5.2
        c2.7,0.9,5.5,1.8,8.2,2.7c-8.2,11.8-16.1,23.8-23.7,36.1c-5.9,9.8-11.8,19.6-17.2,29.7c-5.4,10.1-10.7,20.4-15.2,31.3
        c9.5-6.9,18.3-14.4,26.9-22c8.6-7.6,16.8-15.6,25-23.6c16.1-16.1,31.5-32.9,46.1-50.2l15.7-18.6l-24-8.8
        C181.2,141.8,176.1,140,171,138.2z"
        fill={light ? white : grey}
      />
      <motion.path
        d="M190.2,133c-5.7-2.1-10.6-3.8-15.5-5.5c-3.1-1.1-6.2-2.1-9.3-3.2c5.5-8.2,10.6-16.1,15.4-24
        c5.4-8.9,11.6-19.3,17.5-30.3c5-9.2,10.7-20.2,15.7-32.3L229.9,0l-33.1,24c-10.6,7.7-20,15.8-27.8,22.8
        c-9.3,8.3-18.1,16.8-25.4,24c-15.7,15.7-31.4,32.8-46.8,51l-15.7,18.5l-10.6,12.5l15.3,5.7l23.9,8.8c5,1.8,10.2,3.7,15.5,5.5
        c3.1,1.1,6.2,2.1,9.3,3.2c-5.5,8.2-10.6,16.1-15.4,24c-5.4,9-11.7,19.5-17.5,30.3c-5,9.2-10.7,20.3-15.7,32.3L70.3,300
        l32.9-23.8c10.6-7.7,20-15.8,27.8-22.7c9.2-8.1,18-16.7,25.4-24c15.7-15.7,31.5-32.8,46.8-51l15.7-18.6l10.6-12.5l-15.4-5.6
        L190.2,133z M152.6,169.8c-2.7-0.9-5.5-1.8-8.2-2.7c-5.1-1.7-10.3-3.4-15.4-5.2c-5.1-1.8-10.2-3.6-15.3-5.5l-23.9-8.8l15.7-18.5
        c14.7-17.3,30-34.1,46.1-50.2c8.1-8,16.4-16,25-23.6c8.6-7.6,17.4-15.1,26.9-22.1c-4.5,10.9-9.8,21.1-15.3,31.3
        c-5.5,10.1-11.3,20-17.2,29.7c-7.6,12.3-15.5,24.3-23.7,36.1c2.8,0.9,5.5,1.8,8.3,2.7c5.1,1.7,10.3,3.4,15.4,5.2
        c5.1,1.8,10.2,3.6,15.3,5.5l24,8.8l-15.7,18.6c-14.6,17.3-30,34.1-46.1,50.2c-8.1,8-16.4,16-25,23.6c-8.6,7.6-17.4,15.1-26.9,22
        c4.5-10.9,9.8-21.2,15.2-31.3c5.4-10.1,11.3-20,17.2-29.7C136.5,193.6,144.4,181.6,152.6,169.8z"
        fill="url(#gradient)"
        transition={{
          default: { duration: 3, ease: 'easeInOut' },
          fill: { duration: 3, ease: [1, 0, 0.8, 1] },
        }}
      />
    </MotionSvg>
  </Flex>
);

ZippAnimation.defaultProps = {
  width: 300,
  height: 300,
  delay: 5,
};

export default ZippAnimation;
