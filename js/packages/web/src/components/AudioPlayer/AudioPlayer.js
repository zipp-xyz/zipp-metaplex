import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Flex, Box, CircularProgress } from '@chakra-ui/react';
import { usePlayer } from 'contexts';
import { FaPlayCircle, FaPauseCircle } from 'react-icons/fa';

const StyledPlayPauseButton = styled.button`
  margin: 0;
  cursor: pointer;
  background: transparent;
  border: none;
  font-size: 50px;
  color: white;
  outline: none;
  flex-grow: 0;
  transition: opacity 0.2s;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: ${({ isPlaying, isHovering }) =>
    isPlaying || isHovering ? 0.7 : 0};
  &:hover {
    opacity: 1;
  }
`;

const StyledInput = styled.input`
  opacity: ${({ isPlaying, isCurrent }) => (isPlaying && isCurrent ? 0.7 : 0)};
  -webkit-appearance: none;
  width: 100%;
  height: 10px;
  outline: none;
  -webkit-transition: 0.2s;
  transition: opacity 0.4s;
  &:hover {
    opacity: 1;
  }
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 10px;
    height: 10px;
    background: #00ffa3;
    cursor: pointer;
  }
  &::-moz-range-thumb {
    width: 10px;
    height: 10px;
    background: #04aa6d;
    cursor: pointer;
  }
`;

const AudioPlayer = ({ audioFile, isHovering }) => {
  const {
    currentRef,
    intervalRef,
    handlePlay,
    handlePause,
    isPlaying,
    trackProgress,
    onScrub,
    onScrubEnd,
    duration,
    isLoading,
  } = usePlayer();

  const isCurrent = currentRef?.current?.currentSrc === audioFile;

  useEffect(() => {
    // Pause and clean up on unmount
    return () => {
      handlePause();
      clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <>
      <Flex
        flexGrow={1}
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <Flex position="relative">
          {isLoading && isCurrent && (
            <CircularProgress
              isIndeterminate
              color="neonGreen"
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              size="100px"
              thickness={5}
              opacity={0.5}
            />
          )}

          {isCurrent && isPlaying ? (
            <StyledPlayPauseButton
              type="button"
              onClick={handlePause}
              aria-label="Pause"
              isHovering={isHovering}
              isPlaying={isPlaying}
            >
              <FaPauseCircle />
            </StyledPlayPauseButton>
          ) : (
            <StyledPlayPauseButton
              type="button"
              onClick={() => handlePlay(audioFile)}
              aria-label="Play"
              isHovering={isHovering}
            >
              <FaPlayCircle />
            </StyledPlayPauseButton>
          )}
        </Flex>
      </Flex>
      <StyledInput
        type="range"
        value={trackProgress}
        step="1"
        min="0"
        max={duration ? duration : `${duration}`}
        onChange={e => onScrub(e.target.value)}
        onMouseUp={onScrubEnd}
        onKeyUp={onScrubEnd}
        isPlaying={isPlaying}
        isCurrent={isCurrent}
      />
    </>
  );
};

export default AudioPlayer;
