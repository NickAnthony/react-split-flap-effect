import React, { useEffect, useRef, useState } from "react";
import { FlapFrame } from "./FlapFrame";
import styles from "./styles.css";

interface FlapStackCSSProps {
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

export const FlapStackCSS: React.FC<FlapStackCSSProps> = ({
  stack,
  value,
  timing, // This is the timing between each character flip, not the timing of the animation of the character itself
  className,
  css,
  mode,
  hinge = true
}) => {
  const [displayValue, setDisplayValue] = useState<string>(value);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentChar, setCurrentChar] = useState<string>(value);
  const [nextChar, setNextChar] = useState<string>(value);
  const [isLastAnimation, setIsLastAnimation] = useState(false);
  const isFirstRender = useRef(true);
  const animationTimer = useRef<NodeJS.Timeout | null>(null);
  const sequenceRef = useRef<string[]>([]);
  const sequenceIndex = useRef(0);
  const targetValueRef = useRef(value);

  useEffect(() => {
    // On first render, just show the value without animation
    if (isFirstRender.current) {
      isFirstRender.current = false;
      setDisplayValue(value);
      setCurrentChar(value);
      setNextChar(value);
      targetValueRef.current = value;
      return;
    }

    // Only update if value actually changed and we're not already animating to this value
    if (value !== targetValueRef.current && stack.includes(value)) {
      targetValueRef.current = value;

      // Continue from current position if animating, otherwise from displayValue
      const startPosition = isAnimating ? currentChar : displayValue;
      const sequence = buildSequence(stack, startPosition, value);

      if (sequence.length > 0) {
        sequenceRef.current = sequence;
        sequenceIndex.current = 0;

        // Continue animation from current position
        setCurrentChar(startPosition);
        setNextChar(sequence[0]);
        setIsAnimating(true);
        setIsLastAnimation(sequence.length === 1);

        // Schedule the progression through the sequence
        const animateNext = () => {
          if (sequenceIndex.current < sequence.length) {
            // Check if this is the last character in the sequence
            const isLastCharacter =
              sequenceIndex.current === sequence.length - 1;
            // Use slower timing for the last character (1.5x slower)
            const currentTiming = isLastCharacter ? timing * 1.5 : timing;

            // After animation completes, update for next frame
            animationTimer.current = setTimeout(() => {
              const currentIndex = sequenceIndex.current;
              sequenceIndex.current++;

              if (sequenceIndex.current >= sequence.length) {
                // Animation complete
                setDisplayValue(value);
                setCurrentChar(value);
                setNextChar(value);
                setIsAnimating(false);
                setIsLastAnimation(false);
              } else {
                // Move to next frame
                const prevChar = sequence[currentIndex];
                const nextCharInSequence = sequence[sequenceIndex.current];

                // Brief pause to reset animation state
                setIsAnimating(false);
                setCurrentChar(prevChar);
                setNextChar(prevChar);

                // Use requestAnimationFrame to ensure the DOM updates before retriggering animation
                requestAnimationFrame(() => {
                  setCurrentChar(prevChar);
                  setNextChar(nextCharInSequence);
                  setIsAnimating(true);
                  setIsLastAnimation(
                    sequenceIndex.current === sequence.length - 1
                  );
                  animateNext();
                });
              }
            }, currentTiming);
          }
        };

        animateNext();
      } else {
        // If no sequence needed, update immediately
        setDisplayValue(value);
        setCurrentChar(value);
        setNextChar(value);
        setIsLastAnimation(false);
        targetValueRef.current = value;
      }
    }

    return () => {
      if (animationTimer.current) {
        clearTimeout(animationTimer.current);
      }
    };
  }, [value, stack, timing, currentChar, isAnimating]);

  return (
    <div
      className={styles.digit}
      style={css}
      data-mode={mode}
      data-kind="digit"
    >
      <FlapFrame
        char={currentChar}
        nextChar={nextChar}
        delay={0}
        timing={isLastAnimation ? timing * 3 : timing}
        isStatic={!isAnimating}
        hinge={hinge}
        className={className}
      />
    </div>
  );
};
