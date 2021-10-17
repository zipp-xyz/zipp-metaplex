import styled from "styled-components";
import { typography, color, layout, space } from "styled-system";

export const Link = styled.a`
  font-family: "JetBrains Mono", monospace;
  text-decoration: none;
  ${space};
  ${layout};
  ${color};
  ${typography};
`;

Link.defaultProps = {
  fontSize: [2, 4],
  color: "blue",
};
