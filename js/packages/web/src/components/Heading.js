import { Text } from '@chakra-ui/react';
// import styled from "styled-components";
// import { typography, color, layout, space } from "styled-system";

// export const Heading = styled.div`
//   font-family: ${(props) =>
//     props.alt ? "'Raleway', sans-serif;" : "'JetBrains Mono', monospace;"};
//   ${space};
//   ${layout};
//   ${color};
//   ${typography};
// `;

export const Heading = ({ children, ...otherProps }) => (
  <Text
    fontSize="lg"
    fontWeight="semibold"
    textTransform="uppercase"
    letterSpacing="widest"
    color="gray.600"
    mb="3"
    {...otherProps}
  >
    {children}
  </Text>
);
