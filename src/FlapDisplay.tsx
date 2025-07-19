import React, { useEffect, useState } from "react";
import { FlapStack } from "./FlapStack";
import { Presets } from "./Presets";

const Modes = {
  Numeric: "num",
  Alphanumeric: "alpha",
  Words: "words"
} as const;

type Mode = typeof Modes[keyof typeof Modes];

interface RenderProps {
  id?: string;
  className?: string;
  css?: any;
  children: React.ReactNode;
  [key: string]: any;
}

export interface FlapDisplayProps {
  id?: string;
  className?: string;
  css?: any;
  value: string;
  chars?: string;
  words?: string[];
  length?: number;
  padChar?: string;
  padMode?: "auto" | "start" | "end";
  timing?: number;
  hinge?: boolean;
  render?: (props: RenderProps) => React.ReactElement;
  // Additional props that will be passed to FlapStack
  [key: string]: any;
}

const splitChars = (v: string | number): string[] =>
  String(v)
    .split("")
    .map(c => c.toUpperCase());

const padValue = (
  v: string,
  length: number,
  padChar: string,
  padStart: boolean
): string => {
  const trimmed = v.slice(0, length);
  return padStart
    ? String(trimmed).padStart(length, padChar)
    : String(trimmed).padEnd(length, padChar);
};

export const FlapDisplay: React.FC<FlapDisplayProps> = ({
  id,
  className,
  css,
  value,
  chars = Presets.NUM,
  words,
  length,
  padChar = " ",
  padMode = "auto",
  render,
  timing = 30,
  hinge = true,
  ...restProps
}) => {
  const [stack, setStack] = useState<string[]>([]);
  const [mode, setMode] = useState<Mode>(Modes.Numeric);
  const [digits, setDigits] = useState<string[]>([]);
  const [children, setChildren] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    if (words && words.length) {
      setStack(words);
      setMode(Modes.Words);
    } else {
      setStack(splitChars(chars));
      setMode(chars.match(/[a-z]/i) ? Modes.Alphanumeric : Modes.Numeric);
    }
  }, [chars, words]);

  useEffect(() => {
    if (words && words.length) {
      setDigits([value]);
    } else {
      const padStart =
        padMode === "auto"
          ? !!value.match(/^[0-9.,+-]*$/)
          : padMode === "start";

      const paddedValue = length
        ? padValue(value, length, padChar, padStart)
        : value;

      setDigits(splitChars(paddedValue));
    }
  }, [value, chars, words, length, padChar, padMode]);

  useEffect(() => {
    setChildren(
      digits.map((digit, i) => (
        <FlapStack
          key={i}
          stack={stack}
          value={digit}
          mode={mode}
          timing={timing}
          hinge={hinge}
          {...restProps}
        />
      ))
    );
  }, [digits, stack, mode, timing, hinge, ...Object.values(restProps)]);

  return render ? (
    render({ id, className, css, ...restProps, children })
  ) : (
    <div id={id} className={className} aria-hidden="true" aria-label={value}>
      {children}
    </div>
  );
};
