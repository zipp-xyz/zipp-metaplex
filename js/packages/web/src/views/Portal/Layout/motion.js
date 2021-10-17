import { Box, Flex, Heading } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef } from "react";

export const MotionFlex = motion(Flex);
export const MotionBox = motion(Box);
export const MotionHeader = motion(Heading);

export function MotionText({ text, type = "slide", direction = "forward" }) {
  const isFirst = useRef(true);
  const animate = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  if (type === "rotate") {
    animate.initial.rotate = direction === "forward" ? -90 : 90;
    animate.animate.rotate = 0;
    animate.exit.rotate = direction === "forward" ? 90 : -90;
  } else {
    animate.initial.y = direction === "forward" ? "100%" : "-100%";
    animate.animate.y = 0;
    animate.exit.y = direction === "forward" ? "-100%" : "100%";
  }

  if (isFirst.current) {
    delete animate.initial;
  }

  useEffect(() => {
    isFirst.current = false;
  }, [text]);

  return (
    <Box position="relative">
      <span style={{ visibility: "hidden" }}>{text}</span>
      <AnimatePresence>
        <MotionBox
          key={text}
          position="absolute"
          top="0"
          left="0"
          transformOrigin="bottom left"
          transition={{ type: "tween" }}
          {...animate}
        >
          {text}
        </MotionBox>
      </AnimatePresence>
    </Box>
  );
}
