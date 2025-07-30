import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef
} from "react";

interface AnimationSchedule {
  getDigitStartDelay: () => number;
  batchSize: number;
  batchDelayMs: number;
}

const FlapDisplayContext = createContext<AnimationSchedule | null>(null);

export const useFlapDisplayScheduler = () => {
  const context = useContext(FlapDisplayContext);
  if (!context) {
    // If no provider, return a no-op scheduler
    return {
      getDigitStartDelay: () => 0,
      batchSize: Infinity,
      batchDelayMs: 0
    };
  }
  return context;
};

interface FlapDisplayProviderProps {
  children: React.ReactNode;
  batchSize?: number; // How many digits can start animating at once
  batchDelayMs?: number; // Delay between batches
  resetAfterMs?: number;
}

export const FlapDisplayProvider: React.FC<FlapDisplayProviderProps> = ({
  children,
  batchSize = 50, // 50 digits can start at once
  batchDelayMs = 16, // 16ms between batches (~1 frame)
  resetAfterMs = 1000
}) => {
  const digitCountRef = useRef(0);
  const lastActivityRef = useRef(Date.now());
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset counter after period of inactivity
  const resetCounter = useCallback(() => {
    digitCountRef.current = 0;
  }, []);

  const getDigitStartDelay = useCallback(() => {
    // Clear any pending reset
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
    }

    // Check if we should reset based on inactivity
    const now = Date.now();
    if (now - lastActivityRef.current > resetAfterMs) {
      digitCountRef.current = 0;
    }
    lastActivityRef.current = now;

    // Calculate which batch this digit belongs to
    const currentDigitIndex = digitCountRef.current;
    const batchIndex = Math.floor(currentDigitIndex / batchSize);

    // Calculate delay for this digit
    const delay = batchIndex * batchDelayMs;

    // Increment counter for next digit
    digitCountRef.current++;

    // Schedule reset
    resetTimerRef.current = setTimeout(() => {
      resetCounter();
    }, resetAfterMs);

    return delay;
  }, [batchSize, batchDelayMs, resetAfterMs, resetCounter]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const contextValue: AnimationSchedule = {
    getDigitStartDelay,
    batchSize,
    batchDelayMs
  };

  return (
    <FlapDisplayContext.Provider value={contextValue}>
      {children}
    </FlapDisplayContext.Provider>
  );
};
