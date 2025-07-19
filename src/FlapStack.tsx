import React, { useEffect, useState } from "react";
import { FlapDigit } from "./FlapDigit";

interface Cursor {
  current: number;
  previous: number;
  target: number;
}

const InitialCursor: Cursor = {
  current: -1,
  previous: -1,
  target: 0
};

interface FlapStackProps {
  stack: string[];
  value: string;
  timing: number;
  // Props that will be passed through to FlapDigit
  className?: string;
  css?: any;
  mode?: string | null;
  bottom?: boolean;
  animated?: boolean;
  hinge?: boolean;
}

export const FlapStack: React.FC<FlapStackProps> = ({
  stack,
  value,
  timing,
  ...restProps
}) => {
  const [cursor, setCursor] = useState<Cursor>(InitialCursor);

  useEffect(() => {
    setCursor(InitialCursor);
  }, [stack]);

  useEffect(() => {
    let { current, previous } = cursor;
    const target = Math.max(stack.indexOf(value), 0);

    const increment = () => {
      previous = current;
      if (current >= stack.length - 1) {
        current = 0;
      } else {
        current = current + 1;
      }

      setCursor({
        current,
        previous,
        target
      });
    };

    increment();

    const timer = setInterval(() => {
      if (current === target) {
        clearInterval(timer);
      } else {
        increment();
      }
    }, timing);

    return () => clearInterval(timer);
  }, [stack, value]);

  const { current, previous, target } = cursor;
  return (
    <FlapDigit
      value={stack[current]}
      prevValue={stack[previous]}
      final={current === target}
      {...restProps}
    />
  );
};
