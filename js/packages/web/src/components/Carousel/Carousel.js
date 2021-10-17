import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { wrap } from "popmotion";
import styled from "styled-components";
import { IconButton, Text, VStack } from "@chakra-ui/react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { images } from "./images";
import { position } from "styled-system";

const Container = styled.div`
  width: 100%;
  height: 400px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const FloatingContainer = styled.div`
  position: absolute;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  z-index: 2;
  ${position}
`;

const MotionImage = styled(motion.img)`
  position: absolute;
  width: 100%;
`;

const variants = {
  enter: (direction) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
};

/**
 * Experimenting with distilling swipe offset and velocity into a single variable, so the
 * less distance a user has swiped, the more velocity they need to register as a swipe.
 * Should accomodate longer swipes and short flicks without having binary checks on
 * just distance thresholds and velocity > 0.
 */
const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => {
  return Math.abs(offset) * velocity;
};

export const Carousel = ({ images }) => {
  const [[page, direction], setPage] = useState([0, 0]);

  // We only have 3 images, but we paginate them absolutely (ie 1, 2, 3, 4, 5...) and
  // then wrap that within 0-2 to find our image ID in the array below. By passing an
  // absolute page index as the `motion` component's `key` prop, `AnimatePresence` will
  // detect it as an entirely new image. So you can infinitely paginate as few as 1 images.
  const imageIndex = wrap(0, images.length, page);

  const paginate = useCallback(
    (newDirection) => {
      setPage([page + newDirection, newDirection]);
    },
    [page]
  );

  useEffect(() => {
    setTimeout(() => paginate(1), 5000);
  }, [paginate]);

  return (
    <Container>
      <AnimatePresence initial={false} custom={direction}>
        <MotionImage
          key={page}
          src={images[imageIndex].image}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);

            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
        />
      </AnimatePresence>
      <FloatingContainer>
        <VStack justifyContent="center" alignItems="center" width={400}>
          <Text fontSize="40px" align="center" {...images[imageIndex].styled}>
            {images[imageIndex].title}
          </Text>
          <Text {...images[imageIndex].styled}>
            {images[imageIndex].description}
          </Text>
        </VStack>
      </FloatingContainer>
      <FloatingContainer left="10px">
        <IconButton
          variant="outline"
          colorScheme="black"
          aria-label="Send email"
          icon={<FaChevronLeft />}
          onClick={() => paginate(1)}
          size="sm"
        />
      </FloatingContainer>
      <FloatingContainer right="10px">
        <IconButton
          variant="outline"
          colorScheme="black"
          aria-label="Send email"
          icon={<FaChevronRight />}
          onClick={() => paginate(-1)}
          size="sm"
        />
      </FloatingContainer>
    </Container>
  );
};

Carousel.defaultProps = {
  images,
};
