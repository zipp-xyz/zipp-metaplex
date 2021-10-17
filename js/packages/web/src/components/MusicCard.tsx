import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MetaAvatar, ArtContentNew, HoverCard } from 'components';
import { Flex } from '@chakra-ui/react';

import { MetadataCategory, StringPublicKey } from '@oyster/common';
import { Artist, ArtType } from 'types';

import { Text, VStack, HStack, Badge, Box } from '@chakra-ui/react';
import { AiOutlineRight } from 'react-icons/ai';

import { useArt } from 'hooks';

import { pubkeyToString } from 'utils/pubkeyToString';

export interface ArtCardProps {
  pubkey?: StringPublicKey;

  image?: string;
  animationURL?: string;

  category?: MetadataCategory;

  name?: string;
  symbol?: string;
  description?: string;
  creators?: Artist[];
  preview?: boolean;
  small?: boolean;
  close?: () => void;

  height?: number;
  width?: number;

  to?: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export const MusicCard = (props: ArtCardProps) => {
  let {
    small,
    category,
    image,
    animationURL,
    name,
    preview,
    creators,
    description,
    close,
    pubkey,
    height,
    width,
    to,
    isSelected,
    onClick,
    ...otherProps
  } = props;
  const art = useArt(pubkey);
  const id = pubkeyToString(pubkey);
  // const { ref, data } = useExtendedArt(id);

  creators = art?.creators || creators || [];
  name = art?.title || name || ' ';

  let badge = '';
  if (art.type === ArtType.NFT) {
    badge = 'Unique';
  } else if (art.type === ArtType.Master) {
    badge = 'NFT 0';
  } else if (art.type === ArtType.Print) {
    badge = `${art.edition} of ${art.supply}`;
  }

  const [isHovering, setIsHovering] = useState(false);

  const cardLinkProps = useMemo(() => {
    if (onClick) {
      return { onClick, cursor: 'pointer' };
    }
    if (to) {
      return {
        to,
        as: Link,
      };
    }
  }, [onClick, to]);
  return (
    <HoverCard
      width={300}
      height={300}
      m={2}
      p={0}
      borderColor={isSelected ? 'neonGreen' : 'default'}
      borderRadius={10}
      overflow="hidden"
      dropShadow="3px"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      isHovering={isHovering}
      {...otherProps}
    >
      <Flex
        width="100%"
        height="75%"
        backgroundImage={`url(${image})`}
        backgroundPosition="center"
        backgroundSize="cover"
        overflow="hidden"
        position="relative"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        flexGrow={1}
      >
        <ArtContentNew
          pubkey={pubkey}
          uri={image}
          animationURL={animationURL}
          category={category}
          preview={preview}
          height={height}
          width={width}
        />
      </Flex>
      <Flex p={2} {...cardLinkProps}>
        <VStack justifyContent="center">
          <MetaAvatar creators={creators} size={32} />
        </VStack>
        <HStack flex={1} ml={2}>
          <Flex flexDirection="column">
            <Text>{name}</Text>
            <Box>
              <Badge colorScheme="green">{badge}</Badge>
            </Box>
          </Flex>
        </HStack>
        <VStack justifyContent="center">
          <AiOutlineRight />
        </VStack>
      </Flex>
    </HoverCard>
  );
};

MusicCard.defaultProps = {
  details: true,
  isSelected: false,
};
