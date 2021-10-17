import { Box, useColorModeValue } from "@chakra-ui/react";
import * as React from "react";

export const Card2 = (props) => (
  <Box
    maxW="3xl"
    mx="auto"
    bg={useColorModeValue("white", "gray.700")}
    rounded={{ md: "xl" }}
    shadow={{ md: "base" }}
    overflow="hidden"
    {...props}
  />
);
