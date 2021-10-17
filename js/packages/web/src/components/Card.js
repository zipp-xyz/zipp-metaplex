import styled from 'styled-components';
import { color, layout, space, flexbox } from 'styled-system';

export const Card = styled.div`
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  padding: 15px;
  background: #fff;
  display: flex;
  flex-direction: column;
  max-width: 100%;
  transition: all 0.3s;
  ${space};
  ${layout};
  ${color};
  ${flexbox};
`;
