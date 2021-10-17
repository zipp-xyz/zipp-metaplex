import { Heading } from "components";
import { Flex } from "@chakra-ui/react";

const LabelledComponent = ({ label, children }) => {
  return (
    <Flex my={3} mr={3} flexDirection="column">
      <Heading fontSize={1} mb={2}>
        {label}
      </Heading>
      {children}
    </Flex>
  );
};

export default LabelledComponent;
