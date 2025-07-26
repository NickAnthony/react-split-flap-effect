import React, { useEffect, useRef, useState } from "react";
import { FlapFrame } from "./FlapFrame";
import styles from "./improved-styles.css";

interface FlapStackImprovedProps {
  stack: string[];
  value: string;
  timing: number;
  className?: string;
  css?: any;
  mode?: string | null;
  hinge?: boolean;
}

const buildSequence = (
  stack: string[],
  currentValue: string,
  targetValue: string
): string[] => {
  const currentIndex = stack.indexOf(currentValue);
  const targetIndex = stack.indexOf(targetValue);

  if (
    currentIndex === -1 ||
    targetIndex === -1 ||
    currentIndex === targetIndex
  ) {
    return [];
  }

  const sequence: string[] = [];
  let index = currentIndex;

  // Build sequence from current to target, wrapping around if needed
  while (index !== targetIndex) {
    index = (index + 1) % stack.length;
    sequence.push(stack[index]);
  }

  return sequence;
};

interface AnimationFrame {
  currentChar: string;
  nextChar: string;
  delay: number;
  timing: number;
  isLast: boolean;
}

export const FlapStackImproved: React.FC<FlapStackImprovedProps> = ({
  stack,
  value,
  timing, // This is the timing between each character flip, not the timing of the animation of the character itself
  className,
  css,
  mode,
  hinge = true
}) => {
  const [displayValue, setDisplayValue] = useState<string>(value);
  const [animationFrames, setAnimationFrames] = useState<AnimationFrame[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const isFirstRender = useRef(true);
  const animationTimer = useRef<NodeJS.Timeout | null>(null);
  const targetValueRef = useRef(value);

  useEffect(() => {
    // On first render, just show the value without animation
    if (isFirstRender.current) {
      isFirstRender.current = false;
      setDisplayValue(value);
      targetValueRef.current = value;
      return;
    }

    // Only update if value actually changed and we're not already animating to this value
    if (value !== targetValueRef.current && stack.includes(value)) {
      targetValueRef.current = value;

      // Continue from current position if animating, otherwise from displayValue
      const startPosition = displayValue;
      const sequence = buildSequence(stack, startPosition, value);

      if (sequence.length > 0) {
        // Build all animation frames at once
        const frames: AnimationFrame[] = [];
        let accumulatedDelay = 0;

        // Add all frames in the sequence
        for (let i = 0; i < sequence.length; i++) {
          const isLast = i === sequence.length - 1;
          const currentChar = i === 0 ? startPosition : sequence[i - 1];
          const nextChar = sequence[i];

          frames.push({
            currentChar,
            nextChar,
            delay: accumulatedDelay,
            timing: isLast ? timing * 1.5 : timing, // Slower timing for last character
            isLast
          });

          accumulatedDelay += isLast ? timing * 1.5 : timing;
        }

        // Set all frames at once - only one React update
        setAnimationFrames(frames);
        setIsAnimating(true);

        // Clear previous timer
        if (animationTimer.current) {
          clearTimeout(animationTimer.current);
        }

        // Set timer for when animation completes
        animationTimer.current = setTimeout(() => {
          // Animation complete - only one React update at the end
          setDisplayValue(value);
          setAnimationFrames([]);
          setIsAnimating(false);
        }, accumulatedDelay);
      } else {
        // If no sequence needed, update immediately
        setDisplayValue(value);
        setAnimationFrames([]);
        setIsAnimating(false);
        targetValueRef.current = value;
      }
    }

    return () => {
      if (animationTimer.current) {
        clearTimeout(animationTimer.current);
      }
    };
  }, [value, stack, timing, displayValue]);

  return (
    <div
      className={styles.digit}
      style={css}
      data-mode={mode}
      data-kind="digit"
    >
      {isAnimating && animationFrames.length > 0 ? (
        // During animation, render all frames with their delays
        <>
          {animationFrames.map((frame, index) => (
            <FlapFrame
              key={`${frame.currentChar}-${frame.nextChar}-${index}`}
              char={frame.currentChar}
              nextChar={frame.nextChar}
              delay={frame.delay}
              timing={frame.timing}
              isStatic={false}
              hinge={hinge}
              className={className}
            />
          ))}
        </>
      ) : (
        // When not animating, render a single static frame
        <FlapFrame
          char={displayValue}
          nextChar={displayValue}
          delay={0}
          timing={timing}
          isStatic={true}
          hinge={hinge}
          className={className}
        />
      )}
    </div>
  );
};
