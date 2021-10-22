import React, { Ref, useCallback, useEffect, useState } from 'react';
import { MetadataCategory, MetadataFile } from '@oyster/common';
import { useCachedImage, useExtendedArt } from '../../hooks';
import { PublicKey } from '@solana/web3.js';
import { pubkeyToString } from '../../utils/pubkeyToString';
import { Flex, Image } from '@chakra-ui/react';
import { AudioPlayer } from 'components';

const CachedImageContent = ({
  uri,
  className,
  preview,
  style,
  children,
}: {
  uri?: string;
  className?: string;
  preview?: boolean;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}) => {
  // const [loaded, setLoaded] = useState<boolean>(false);
  const { cachedBlob } = useCachedImage(uri || '');

  return (
    <Flex>
      <Image
        src={cachedBlob}
        position="relative"
        // onLoad={e => {
        //   setLoaded(true);
        // }}
        fallbackSrc="https://stefan-kovac-random.s3.us-east-2.amazonaws.com/fallback-image.png"
      />
      <Flex
        position="absolute"
        top="50%"
        left="50%"
        height="100%"
        width="100%"
        transform="translate(-50%, -50%)"
        flexDirection="column"
      >
        {children}
      </Flex>
    </Flex>
  );
};

export const ArtContentNew = ({
  category,
  className,
  preview,
  style,
  active,
  allowMeshRender,
  pubkey,
  uri,
  animationURL,
  files,
}: {
  category?: MetadataCategory;
  className?: string;
  preview?: boolean;
  style?: React.CSSProperties;
  width?: number;
  height?: number;
  ref?: Ref<HTMLDivElement>;
  active?: boolean;
  allowMeshRender?: boolean;
  pubkey?: PublicKey | string;
  uri?: string;
  animationURL?: string;
  files?: (MetadataFile | string)[];
}) => {
  const id = pubkeyToString(pubkey);

  let audioFile;

  const { ref, data } = useExtendedArt(id);

  if (pubkey && data) {
    uri = data.image;
    animationURL = data.animation_url;
  }

  const content = (
    <CachedImageContent
      uri={uri}
      className={className}
      preview={preview}
      style={style}
    >
      {animationURL && (
        <AudioPlayer audioFile={animationURL} isHovering={true} />
      )}
    </CachedImageContent>
  );

  return (
    <div
      ref={ref as any}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {content}
    </div>
  );
};
