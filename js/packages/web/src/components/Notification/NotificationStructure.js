import {
  Box,
  Center,
  Flex,
  Icon,
  Stack,
  StackDivider,
  useColorModeValue,
} from "@chakra-ui/react";
import * as React from "react";

export const NotificationStructure = (props) => {
  const {
    primaryAction,
    secondaryAction,
    children,
    icon,
    showNotification,
    ...flexProps
  } = props;
  return (
    <Flex
      width="md"
      boxShadow="lg"
      borderRadius="base"
      overflow="hidden"
      position="absolute"
      right={showNotification ? 10 : -500}
      top={10}
      zIndex={10}
      transition="1s"
      bg={useColorModeValue("white", "gray.700")}
      {...flexProps}
    >
      <Center
        bg={useColorModeValue("blue.500", "blue.300")}
        px="4"
        display={{ base: "none", sm: "flex" }}
      >
        <Icon
          as={icon}
          color={useColorModeValue("white", "gray.900")}
          boxSize="9"
        />
      </Center>
      <Stack
        direction={{ base: "column", sm: "row" }}
        divider={<StackDivider />}
        spacing="0"
      >
        <Flex px="4" py="3">
          {children}
        </Flex>
        <Stack
          direction={{ base: "row", sm: "column" }}
          height="full"
          divider={<StackDivider />}
          spacing="0"
        >
          {primaryAction}
          {secondaryAction}
        </Stack>
      </Stack>
    </Flex>
  );
};
