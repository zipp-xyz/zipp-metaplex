import React from "react";
import { Heading, MusicCard } from "components";
import { Flex } from "@chakra-ui/react";
import dropsQuery from "./response.json";

const CurrentDrops = () => (
  <>
    <Flex>
      <Heading fontSize={4} mb={2}>
        Your NFT Drops
      </Heading>
    </Flex>
    <Flex flexGrow={1} flexDirection="row" mb={4}>
      {dropsQuery.map((musicObject, i) => (
        <MusicCard key={i} {...musicObject} />
      ))}
    </Flex>
  </>
);

export default CurrentDrops;
