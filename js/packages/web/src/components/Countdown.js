import { useState, useEffect } from "react";
import { calculateCountdownFromNow } from "utils";
import { Text, VStack, HStack } from "@chakra-ui/react";

const TimerText = ({ children }) => (
  <Text fontSize={28} fontFamily="JetBrains Mono" mb={2}>
    {children}
  </Text>
);

export const Countdown = ({ countdownDate }) => {
  const [
    {
      expired,
      values: { days, hours, minutes, seconds },
    },
    setResult,
  ] = useState(() => calculateCountdownFromNow(countdownDate));

  useEffect(() => {
    if (expired) return undefined;
    const intervalId = setInterval(
      () => setResult(calculateCountdownFromNow(countdownDate)),
      1000
    );
    return () => {
      clearInterval(intervalId);
    };
  }, [expired, countdownDate]);

  const isEnded = () => false
    // days === 0 && hours === 0 && minutes === 0 && seconds === 0;

  return (
    <HStack>
      {isEnded ? (
        <Text>This auction has ended.</Text>
      ) : (
        <>
          {days > 0 && (
            <VStack>
              <TimerText>
                {days < 10 && <span style={{ opacity: 0.2 }}>0</span>}
                {days}
                <span style={{ opacity: 0.2 }}>:</span>
              </TimerText>
              <div className="cd-label">days</div>
            </VStack>
          )}
          <VStack>
            <TimerText>
              {hours < 10 && <span style={{ opacity: 0.2 }}>0</span>}
              {hours}
              <span style={{ opacity: 0.2 }}>:</span>
            </TimerText>
            <div className="cd-label">hour</div>
          </VStack>
          <VStack>
            <TimerText>
              {minutes < 10 && <span style={{ opacity: 0.2 }}>0</span>}
              {minutes}
              {days === 0 && <span style={{ opacity: 0.2 }}>:</span>}
            </TimerText>
            <div className="cd-label">mins</div>
          </VStack>
          {!days && (
            <VStack>
              <TimerText>
                {seconds < 10 && <span style={{ opacity: 0.2 }}>0</span>}
                {seconds}
              </TimerText>
              <div className="cd-label">secs</div>
            </VStack>
          )}
        </>
      )}
    </HStack>
  );
};

Countdown.defaultProps = {
  countdownDate: "June 10, 2021",
};
