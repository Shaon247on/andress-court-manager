import { useState, useEffect } from 'react';

export function useResendTimer(initialSeconds: number = 60) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!isActive || seconds <= 0) {
      setIsActive(false);
      return;
    }

    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, seconds]);

  const resetTimer = () => {
    setSeconds(initialSeconds);
    setIsActive(true);
  };

  return {
    seconds,
    isActive,
    resetTimer,
    formattedTime: `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`,
  };
}