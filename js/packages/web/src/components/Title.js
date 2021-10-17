import { Text } from '@chakra-ui/react';
import styled from 'styled-components';

const StyledTitle = styled(Text)`
  background-image: linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%);
  background-repeat: no-repeat;
  background-size: 100% 0.2em;
  background-position: 0 78%;
  font-family: JetBrains Mono;
  font-size: ${props => (props.fontSize ? props.fontSize : '48px')};
  color: black;
  textalign: center;
`;

export const Title = ({ children, ...otherProps }) => (
  <StyledTitle {...otherProps}>{children}</StyledTitle>
);
