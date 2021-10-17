import { Link } from "react-router-dom";
import ZippAnimation from "components/assets/ZippAnimation";
import { Box, Text, Heading, Card, GradientMesh } from "components";
import { FaTwitter } from "react-icons/fa";
import { Button, Flex } from "@chakra-ui/react";

const Login = () => {
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      position="relative"
      width="100%"
      height="100%"
      flexGrow={1}
      flexDirection="column"
    >
      <Flex position="absolute" zIndex={1100} flexDirection="column">
        <Card
          width={[300, 500]}
          height={400}
          justifyContent="center"
          alignItems="center"
        >
          <Flex
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
          >
            <Box mb={[2, 3]}>
              <ZippAnimation width={150} height={150} />
            </Box>
            <Heading fontSize={[1, 3]} color="black" textAlign="center">
              Welcome
            </Heading>
            <Box mb={[3, 4]}>
              <Text fontSize={[1, 2]}>Log in to the Creator portal below</Text>
            </Box>
            <Button icon={<FaTwitter />} to="/portal/" as={Link}>
              Log in using twitter
            </Button>
          </Flex>
        </Card>
      </Flex>
      <Flex
        position="absolute"
        top={0}
        overflow="hidden"
        zIndex={1000}
        width="100%"
        height="100%"
        opacity={0.7}
        flexDirection="column"
      >
        <GradientMesh />
      </Flex>
    </Flex>
  );
};

export default Login;
