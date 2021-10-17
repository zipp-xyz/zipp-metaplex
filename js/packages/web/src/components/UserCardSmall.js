import { Flex, Avatar, Box, Text, Badge } from "@chakra-ui/react";
import { Card } from "components";

const UserCardSmall = ({
  file,
  image,
  shortLink,
  subtitle,
  username,
  transaction,
  ...otherProps
}) => {
  return (
    <Card mr={3} flexDirection="row">
      <Avatar src={image} />
      <Box ml="3">
        <Text fontWeight="bold">
          {username}
          <Badge ml="1" colorScheme="green">
            New
          </Badge>
        </Text>
        <Text fontSize="sm">{subtitle}</Text>
      </Box>
    </Card>
  );
};

export default UserCardSmall;
