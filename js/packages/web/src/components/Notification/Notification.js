import { useState, useEffect } from "react";
import { Heading, Stack, Text, VStack } from "@chakra-ui/react";
import { NotificationStructure } from "./NotificationStructure";
import { NotificationButton } from "./NotificationButton";
import { GiPartyPopper } from "react-icons/gi";

export const Notification = ({
  title,
  description,
  icon,
  showNotification,
}) => {
  const [open, setOpen] = useState(showNotification);

  useEffect(() => {
    if (open) {
      setTimeout(() => setOpen(false), 5000);
    }
  }, [open, showNotification]);

  return (
    <>
      <NotificationStructure
        showNotification={open}
        icon={icon}
        primaryAction={
          <NotificationButton colorScheme="blue">View</NotificationButton>
        }
        secondaryAction={<NotificationButton>Close</NotificationButton>}
      >
        <Stack spacing="1">
          <VStack>
            <Heading as="h3" fontSize="md">
              {title}
            </Heading>
            <Text fontSize="sm">{description}</Text>
          </VStack>
        </Stack>
      </NotificationStructure>
    </>
  );
};

Notification.defaultProps = {
  icon: GiPartyPopper,
  title: "Congrats",
  description: "Your created your first drop on zipp! 🥳",
};
