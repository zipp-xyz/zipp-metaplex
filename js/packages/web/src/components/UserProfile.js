import React from "react";
import {
  Avatar,
  Flex,
  HStack,
  Text,
  useColorModeValue as mode,
} from "@chakra-ui/react";

const UserProfile = ({ name, image, email }) => {
  return (
    <HStack spacing="4" px="2" flexShrink={0} p="4">
      <Avatar size="sm" name={name} src={image} />
      <Flex direction="column" fontWeight="medium">
        <Text fontSize="sm">{name}</Text>
        <Text
          fontSize="xs"
          lineHeight="shorter"
          color={mode("gray.600", "gray.400")}
        >
          {email}
        </Text>
      </Flex>
    </HStack>
  );
};

export default UserProfile;
