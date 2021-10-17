import React, { useEffect, useRef, useState, useMemo } from 'react';

import WaveSurfer from 'wavesurfer.js';
import CursorPlugin from 'wavesurfer.js/src/plugin/cursor/index.js';
import TimelinePlugin from 'wavesurfer.js/src/plugin/timeline/index.js';

import {
  Box,
  Flex,
  Icon,
  IconButton,
  HStack,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from '@chakra-ui/react';

import {
  FiPlay,
  FiPause,
  FiRewind,
  FiFastForward,
  FiVolumeX,
  FiVolume,
  FiVolume1,
  FiVolume2,
} from 'react-icons/fi';

const formWaveSurferOptions = (ref, timelineRef) => ({
  container: ref,
  // waveColor: '#eee',
  progressColor: 'white',
  cursorColor: '#00ffa3',
  barWidth: 3,
  barRadius: 3,
  responsive: true,
  height: 100,
  // If true, normalize by the maximum peak instead of 1.0.
  normalize: true,
  // Use the PeakCache to improve rendering speed of large waveforms.
  partialRender: true,
  plugins: [
    CursorPlugin.create({
      showTime: true,
      opacity: 1,
      color: '#fff',
      customShowTimeStyle: {
        backgroundColor: '#00ffa3',
        color: '#000',
        padding: '2px',
        'font-size': '10px',
      },
    }),

    TimelinePlugin.create({
      container: timelineRef,
      notchPercentHeight: 10,
      primaryColor: '#eee',
      secondaryColor: '#eee',
      secondaryFontColor: '#505050',
    }),
  ],
});

export const Waveform = ({ url, creatorBadge }) => {
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const timelineRef = useRef(null);
  const [playing, setPlay] = useState(false);
  const [volume, setVolume] = useState(0.5);

  // create new WaveSurfer instance
  // On component mount and when url changes
  useEffect(() => {
    setPlay(false);

    const options = formWaveSurferOptions(
      waveformRef.current,
      timelineRef.current,
    );
    wavesurfer.current = WaveSurfer.create(options);
    wavesurfer.current.load(url);
    wavesurfer.current.on('ready', function () {
      // https://wavesurfer-js.org/docs/methods.html
      // wavesurfer.current.play();
      // setPlay(true);

      // make sure object still available when file loaded
      if (wavesurfer.current) {
        wavesurfer.current.setVolume(volume);
        setVolume(volume);
      }
    });

    // Removes events, elements and disconnects Web Audio nodes.
    // when component unmount
    return () => wavesurfer.current.destroy();
  }, [url]);

  const handlePlayPause = () => {
    setPlay(!playing);
    wavesurfer.current.playPause();
  };

  const onVolumeChange = intVolume => {
    const newVolume = intVolume / 100;
    if (newVolume) {
      setVolume(newVolume);
      wavesurfer.current.setVolume(newVolume || 1);
    }
  };

  const volumeIcon = useMemo(() => {
    if (volume >= 0.66) {
      return FiVolume2;
    } else if (volume >= 0.33) {
      return FiVolume1;
    } else if (volume > 0.1) {
      return FiVolume;
    } else {
      return FiVolumeX;
    }
  }, [volume]);

  return (
    <Flex p={3} flex={1} flexDirection="column" width="100%">
      <Flex flexGrow={1}>
        <Box width="100%">
          <Box id="waveform" ref={waveformRef} position="relative" />
          <Box id="timeline" ref={timelineRef} />
        </Box>
      </Flex>
      <Flex>
        <Flex flex={1}>
          <Flex width="120px">{creatorBadge}</Flex>
          <Flex flexGrow={1} justifyContent="center">
            <HStack spacing={8}>
              <Icon as={FiRewind} w={6} h={6} color="grey" />
              <IconButton
                variant="unstyled"
                cursor="pointer"
                as={!playing ? FiPlay : FiPause}
                w={10}
                h={10}
                color="neonGreen"
                onClick={handlePlayPause}
              />
              <Icon as={FiFastForward} w={6} h={6} color="grey" />
            </HStack>
          </Flex>
          <Flex width="120px">
            <HStack spacing={3}>
              <Icon as={volumeIcon} w={6} h={6} color="grey" />
              <Box width="80px">
                <Slider
                  aria-label="volume-slider"
                  onChange={onVolumeChange}
                  defaultValue={volume * 100}
                >
                  <SliderTrack bg="grey">
                    <SliderFilledTrack bg="white" />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>
              </Box>
            </HStack>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
