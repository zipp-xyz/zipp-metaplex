import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { AudioPlayer } from 'components';
import { Box } from '@chakra-ui/react';

export const MotionCard = ({
  imagePath = 'https://u6llhiwlecb6in553vzjrw2jttfd47z3kg3p7dy5fodu5pycy2xa.arweave.net/p5azossgg-Q3vd1ymNtJnMo-fztRtv-PHSuHTr8Cxq4/?ext=png',
  audioFile = 'https://www.arweave.net/7E6ci1ykg062AChROcyHuURKMsO0aJDdjcKtkVCF83A?ext=wav',
}) => {
  const x = useMotionValue(250);
  const y = useMotionValue(150);

  const centeredX = useSpring(
    useTransform(x, n => n - 600),
    {
      bounce: 1,
      stiffness: 800,
      damping: 80,
    },
  );
  const centeredY = useSpring(
    useTransform(y, n => n - 600),
    {
      bounce: 1,
      stiffness: 800,
      damping: 80,
    },
  );

  const hoverState = useMotionValue(0);
  const hoverOpacity = useSpring(hoverState);

  const rotateX = useSpring(useTransform(y, [0, 300], [-5, 5]), {
    bounce: 1,
    stiffness: 800,
    damping: 80,
  });
  const rotateY = useSpring(useTransform(x, [0, 500], [5, -5]), {
    bounce: 1,
    stiffness: 800,
    damping: 80,
  });

  function handleMouse(event) {
    const rect = event.currentTarget.getBoundingClientRect();

    hoverState.set(1);
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  }

  function mouseLeave(event) {
    hoverState.set(0);
    x.set(250);
    y.set(150);
  }

  return (
    <motion.div
      style={{
        display: 'flex',
        placeItems: 'center',
        placeContent: 'center',
        perspective: 600,
        width: 600,
        height: 400,
      }}
      whileHover={{
        scale: 1.05,
      }}
      onMouseLeave={mouseLeave}
      onMouseMove={handleMouse}
    >
      <motion.div
        style={{
          background: `url(${imagePath})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: 300,
          height: 300,
          borderRadius: 30,
          backgroundColor: '#fff',
          rotateX: rotateX,
          rotateY: rotateY,
          overflow: 'hidden',
          position: 'relative',
          boxShadow: 'rgba(0, 0, 0, 0.5) 0px 15px 30px 0px',
        }}
      >
        <motion.div
          style={{
            width: 1200,
            height: 1200,
            background:
              'radial-gradient(closest-side, rgba(255,255,255,0.2), rgba(255,255,255,0)) 60%',
            opacity: hoverOpacity,
            x: centeredX,
            y: centeredY,
          }}
        ></motion.div>
        <Box
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
          justifyContent="center"
          alignItems="center"
          display="flex"
          flexDirection="column"
        >
          <AudioPlayer audioFile={audioFile} isHovering={true} />
        </Box>
      </motion.div>
    </motion.div>
  );
};
