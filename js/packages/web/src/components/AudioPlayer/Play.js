import React from "react";
import styled from "styled-components";
import { Flex } from "components";

const Play = ({ handleClick, icon }) => {
  const Icon = icon;

  const StyledIcon = styled(Icon)`
    font-size: 50px;
    color: white;
  `;

  return (
    <Flex onClick={() => handleClick()}>
      <StyledIcon />
    </Flex>
  );
};

export default Play;
