import {
  Flex,
  Box,
  HStack,
  Icon,
  Stack,
  Tag,
  Text,
  useColorModeValue,
  Wrap,
} from "@chakra-ui/react";
import * as React from "react";
import { HiCash, HiLocationMarker, HiShieldCheck } from "react-icons/hi";
import { CustomerReviews, Card2 } from "components";

const UserCardWide = () => (
  <Box>
    <Card2>
      <Stack
        direction={{ base: "column", md: "row" }}
        spacing={{ base: "3", md: "10" }}
        align="flex-start"
      >
        <Box
          width={200}
          height={200}
          bg="url(https://www.rap-up.com/app/uploads/2020/07/dj-khaled-owl.jpg)"
          backgroundSize="cover"
          backgroundPosition="center"
        />
        <Box
          px={2}
          py={6}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          flexGrow={1}
        >
          <Stack
            spacing={{ base: "1", md: "2" }}
            direction={{ base: "column", md: "row" }}
          >
            <Text as="h2" fontWeight="bold" fontSize="xl">
              DJ Khaled
            </Text>
            <HStack fontSize={{ base: "md", md: "lg" }}>
              <Text
                as="span"
                color={useColorModeValue("gray.500", "gray.300")}
                lineHeight="1"
              >
                @djkhaled
              </Text>
              <Icon as={HiShieldCheck} color="green.500" />
            </HStack>
          </Stack>
          <Wrap shouldWrapChildren my="4" spacing="4">
            <HStack>
              <Icon as={HiCash} fontSize="xl" color="gray.400" />
              <Text
                fontSize="sm"
                fontWeight="medium"
                color={useColorModeValue("gray.600", "gray.300")}
              >
                <b>2</b> drops
              </Text>
            </HStack>

            <HStack spacing="1">
              <Icon as={HiLocationMarker} color="gray.400" />
              <Text
                fontSize="sm"
                fontWeight="medium"
                color={useColorModeValue("gray.600", "gray.300")}
              >
                Miami, FL
              </Text>
            </HStack>
          </Wrap>
          <Box fontSize="sm" noOfLines={2}>
            Award winning producer
          </Box>
          <Wrap
            shouldWrapChildren
            mt="5"
            color={useColorModeValue("gray.600", "gray.300")}
          >
            {["Hip Hop", "R'n'B", "Rap"].map((tag) => (
              <Tag key={tag} color="inherit" px="3">
                {tag}
              </Tag>
            ))}
          </Wrap>
        </Box>
      </Stack>
    </Card2>
  </Box>
);

export default UserCardWide;
