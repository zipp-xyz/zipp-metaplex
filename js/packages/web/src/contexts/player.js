import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from 'react';
import { FaBullseye } from 'react-icons/fa';

const PlayerContext = createContext();

export const usePlayer = () => useContext(PlayerContext);

export const PlayerProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackProgress, setTrackProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [duration, setDuration] = useState();
  const currentRef = useRef();
  const intervalRef = useRef();

  const handlePause = () => {
    setIsPlaying(false);
    setIsLoading(false);
    currentRef?.current?.pause() ?? null;
  };

  const handlePlay = audioFile => {
    const isCurrent = currentRef?.current?.currentSrc === audioFile;
    currentRef.current?.pause && currentRef.current?.pause();
    if (!isCurrent) {
      currentRef.current = new Audio(audioFile);
    }
    currentRef.current.play();
    setDuration(currentRef.current.duration);
    setIsPlaying(true);
    startTimer();
  };

  const startTimer = () => {
    // Clear any timers already running
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (currentRef.current.ended) {
        // toNextTrack();
      } else {
        setTrackProgress(currentRef.current.currentTime);
      }
    }, [1000]);
  };
  const onScrub = value => {
    // Clear any timers already running
    clearInterval(intervalRef.current);
    currentRef.current.currentTime = value;
    setTrackProgress(currentRef.current.currentTime);
  };
  const onScrubEnd = () => {
    // If not already playing, start
    if (!isPlaying) {
      setIsPlaying(true);
    }
    startTimer();
  };

  return (
    <PlayerContext.Provider
      value={{
        currentRef,
        intervalRef,
        handlePlay,
        handlePause,
        isPlaying,
        trackProgress,
        startTimer,
        onScrub,
        onScrubEnd,
        duration,
        isLoading,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export default PlayerProvider;
