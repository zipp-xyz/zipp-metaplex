import { Card } from 'components';
import styled from 'styled-components';

export const HoverCard = styled(Card)`
  transition: 0.4s;
  position: relative;
  bottom: 0px;
  cursor: default;
  transform: ${props => (props.isHovering ? 'translateY(-1px)' : null)};
  box-shadow: ${props =>
    props.isHovering
      ? '0 4px 12px 0 rgba(0, 0, 0, 0.2)'
      : '0 2px 4px 0 rgba(0, 0, 0, 0.1)'};
`;
