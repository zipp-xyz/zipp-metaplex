import React, { Ref, useCallback, useEffect, useState } from 'react';
import { MetadataCategory, MetadataFile } from '@oyster/common';
import { MeshViewer } from '../MeshViewer';
import { ThreeDots } from '../MyLoader';
import { useCachedImage, useExtendedArt } from '../../hooks';
import { Stream, StreamPlayerApi } from '@cloudflare/stream-react';
import { PublicKey } from '@solana/web3.js';
import { getLast } from '../../utils/utils';
import { pubkeyToString } from '../../utils/pubkeyToString';
import { Flex, Image } from '@chakra-ui/react';
import { AudioPlayer } from 'components';

const MeshArtContent = ({
  uri,
  animationUrl,
  className,
  style,
  files,
}: {
  uri?: string;
  animationUrl?: string;
  className?: string;
  style?: React.CSSProperties;
  files?: (MetadataFile | string)[];
}) => {
  const renderURL =
    files && files.length > 0 && typeof files[0] === 'string'
      ? files[0]
      : animationUrl;
  const { isLoading } = useCachedImage(renderURL || '', true);

  if (isLoading) {
    return (
      <CachedImageContent
        uri={uri}
        className={className}
        preview={false}
        style={{ width: 300, ...style }}
      />
    );
  }

  return <MeshViewer url={renderURL} className={className} style={style} />;
};

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
  const [loaded, setLoaded] = useState<boolean>(false);
  const { cachedBlob } = useCachedImage(uri || '');

  return (
    <Flex>
      <Image
        src={cachedBlob}
        preview={preview}
        wrapperClassName={className}
        loading="lazy"
        position="relative"
        wrapperStyle={{ ...style }}
        onLoad={e => {
          setLoaded(true);
        }}
        // placeholder={<ThreeDots />}
        {...(loaded ? {} : { height: 200 })}
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

const VideoArtContent = ({
  className,
  style,
  files,
  uri,
  animationURL,
  active,
}: {
  className?: string;
  style?: React.CSSProperties;
  files?: (MetadataFile | string)[];
  uri?: string;
  animationURL?: string;
  active?: boolean;
}) => {
  const [playerApi, setPlayerApi] = useState<StreamPlayerApi>();

  const playerRef = useCallback(
    ref => {
      setPlayerApi(ref);
    },
    [setPlayerApi],
  );

  useEffect(() => {
    if (playerApi) {
      playerApi.currentTime = 0;
    }
  }, [active, playerApi]);

  const likelyVideo = (files || []).filter((f, index, arr) => {
    if (typeof f !== 'string') {
      return false;
    }

    // TODO: filter by fileType
    return arr.length >= 2 ? index === 1 : index === 0;
  })?.[0] as string;

  const content =
    likelyVideo &&
    likelyVideo.startsWith('https://watch.videodelivery.net/') ? (
      <div className={`${className} square`}>
        <Stream
          streamRef={(e: any) => playerRef(e)}
          src={likelyVideo.replace('https://watch.videodelivery.net/', '')}
          loop={true}
          height={600}
          width={600}
          controls={false}
          videoDimensions={{
            videoHeight: 700,
            videoWidth: 400,
          }}
          autoplay={true}
          muted={true}
        />
      </div>
    ) : (
      <video
        className={className}
        playsInline={true}
        autoPlay={true}
        muted={true}
        controls={true}
        controlsList="nodownload"
        style={style}
        loop={true}
        poster={uri}
      >
        {likelyVideo && (
          <source src={likelyVideo} type="video/mp4" style={style} />
        )}
        {animationURL && (
          <source src={animationURL} type="video/mp4" style={style} />
        )}
        {files
          ?.filter(f => typeof f !== 'string')
          .map((f: any) => (
            <source src={f.uri} type={f.type} style={style} />
          ))}
      </video>
    );

  return content;
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

  if (pubkey && data?.properties) {
    files = data.properties.files;
    audioFile = data.properties.files?.[1];
    category = data.properties.category;
  }

  animationURL = animationURL || '';

  const animationUrlExt = new URLSearchParams(
    getLast(animationURL.split('?')),
  ).get('ext');

  // if (
  //   allowMeshRender &&
  //   (category === 'vr' ||
  //     animationUrlExt === 'glb' ||
  //     animationUrlExt === 'gltf')
  // ) {
  //   return (
  //     <MeshArtContent
  //       uri={uri}
  //       animationUrl={animationURL}
  //       className={className}
  //       style={style}
  //       files={files}
  //     />
  //   );
  // }

  const content =
    category === 'video' ? (
      <VideoArtContent
        className={className}
        style={style}
        files={files}
        uri={uri}
        animationURL={animationURL}
        active={active}
      />
    ) : (
      <>
        <CachedImageContent
          uri={uri}
          className={className}
          preview={preview}
          style={style}
        >
          {audioFile && (
            <AudioPlayer audioFile={audioFile.uri} isHovering={true} />
          )}
        </CachedImageContent>
      </>
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
