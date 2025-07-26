/* eslint-disable react/jsx-fragments */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FlapDisplay, Presets } from "react-split-flap-effect";
// import "react-split-flap-effect/extras/themes.css";
import "./index.css";
import { PerformanceTest } from "./PerformanceTest";
import { TripleDigit } from "./TripleDigit";

const Words = [
  "",
  "Washington",
  "Baltimore",
  "Philadelphia",
  "Newark",
  "New York",
  "New Haven",
  "Providence",
  "Boston"
] as const;

const Modes = {
  Numeric: 0,
  Alphanumeric: 1,
  Words: 2
} as const;

type Mode = typeof Modes[keyof typeof Modes];
type PadMode = "auto" | "start" | "end";

export const App: React.FC = () => {
  const [showPerformanceTest, setShowPerformanceTest] = useState(false);
  const [showTripleDigit, setShowTripleDigit] = useState(true);
  const [autoplay, setAutoplay] = useState(true);
  const [mode, setMode] = useState<Mode>(Modes.Numeric);
  const [theme, setTheme] = useState("");
  const [colorScheme, setColorScheme] = useState("");
  const [chars, setChars] = useState(Presets.NUM);
  const [words, setWords] = useState(["REACT", "SPLIT", "FLAP", "EFFECT"]);
  const [length, setLength] = useState(6);
  const [timing, setTiming] = useState(500);
  const [padChar, setPadChar] = useState(" ");
  const [padMode, setPadMode] = useState<PadMode>("auto");
  const [value, setValue] = useState("");
  const [hinge, setHinge] = useState(true);
  const [useImproved, setUseImproved] = useState(true);

  const modeRef = useRef(mode);
  modeRef.current = mode;

  const lengthRef = useRef(length);
  lengthRef.current = length;

  const wordsRef = useRef(words);
  wordsRef.current = words;

  const randomNum = (min: number, max: number) =>
    Math.floor(Math.random() ** 5 * (max - min + 1) + min);

  const randomValue = useCallback(() => {
    const mode = modeRef.current;
    const length = lengthRef.current;
    const words = wordsRef.current;

    switch (mode) {
      case Modes.Numeric:
        return randomNum(10 ** (length - 1), 10 ** length - 1).toString();
      case Modes.Alphanumeric:
        return Array(length)
          .fill(null)
          .map(
            () => Presets.ALPHANUM[randomNum(0, Presets.ALPHANUM.length - 1)]
          )
          .join("");
      case Modes.Words:
        return words[randomNum(0, words.length - 1)];
      default:
        return "";
    }
  }, []);

  useEffect(() => {
    setChars(mode === Modes.Numeric ? Presets.NUM : Presets.ALPHANUM);
    setLength(mode === Modes.Alphanumeric ? 12 : 6);
  }, [mode]);

  useEffect(() => {
    if (autoplay) {
      setValue(randomValue());
      const interval = setInterval(() => {
        setValue(randomValue());
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [autoplay, randomValue]);

  if (showPerformanceTest) {
    return (
      <div>
        <button onClick={() => setShowPerformanceTest(false)}>
          Back to Demo
        </button>
        <PerformanceTest />
      </div>
    );
  }

  if (showTripleDigit) {
    return <TripleDigit />;
  }

  return (
    <div className="page-container">
      <div>
        <FlapDisplay
          className={`demoFlapper ${theme} ${colorScheme}`}
          value={value}
          chars={chars}
          words={mode === Modes.Words ? words : undefined}
          length={length}
          timing={timing}
          hinge={hinge}
          padChar={padChar}
          padMode={padMode}
          useImproved={useImproved}
        />
      </div>

      <form onSubmit={e => e.preventDefault()}>
        <div className="row">
          <div className="full">
            <h2>Animation Mode</h2>
          </div>
          <div className="full">
            <input
              type="checkbox"
              id="useImproved"
              checked={useImproved}
              onChange={e => setUseImproved(e.target.checked)}
            />
            <label htmlFor="useCss">Use CSS animations (GPU-accelerated)</label>
          </div>
        </div>

        <div className="row">
          <div className="full">
            <h2>Demo mode</h2>
          </div>
          <div className="full col-md-50">
            <input
              type="radio"
              name="mode"
              id="mode:numeric"
              value={Modes.Numeric}
              checked={mode === Modes.Numeric}
              onChange={() => setMode(Modes.Numeric)}
            />
            <label htmlFor="mode:numeric">Numeric</label>
            <input
              type="radio"
              name="mode"
              id="mode:alpha"
              value={Modes.Alphanumeric}
              checked={mode === Modes.Alphanumeric}
              onChange={() => setMode(Modes.Alphanumeric)}
            />
            <label htmlFor="mode:alpha">Alphanumeric</label>
            <input
              type="radio"
              name="mode"
              id="mode:words"
              value={Modes.Words}
              checked={mode === Modes.Words}
              onChange={() => setMode(Modes.Words)}
            />
            <label htmlFor="mode:words">Words</label>
          </div>
          <div className="full col-md-50">
            <input
              type="checkbox"
              id="autoplay"
              name="autoplay"
              checked={autoplay}
              onChange={e => setAutoplay(e.target.checked)}
            />
            <label htmlFor="autoplay">Update automatically</label>
          </div>
        </div>
        <div className="row">
          <div className="full">
            <h2>CSS</h2>
          </div>
          <div className="full col-md-50">
            <label htmlFor="theme">Theme</label>
            <select
              id="theme"
              name="theme"
              value={theme}
              onChange={e => setTheme(e.target.value)}
            >
              <option value="">Default</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
            </select>
          </div>
          <div className="full col-md-50">
            <label htmlFor="colorScheme">Color scheme</label>
            <select
              id="colorScheme"
              name="colorScheme"
              value={colorScheme}
              onChange={e => setColorScheme(e.target.value)}
            >
              <option value="">Default</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="lightBordered">Light Bordered</option>
              <option value="darkBordered">Dark Bordered</option>
            </select>
          </div>
        </div>
        <div className="row">
          <div className="full">
            <h2>Props</h2>
          </div>
          <div className="row">
            <label className="col25">
              <code>className</code>
            </label>
            <div className="col75">
              <input
                type="text"
                name="className"
                disabled
                value={`${theme} ${colorScheme}`}
              />
            </div>
          </div>
          <div className="row">
            <label className="col25">
              <code>value</code>
            </label>
            <div className="col75">
              <input
                type="text"
                name="value"
                value={value}
                disabled={autoplay}
                onChange={e => setValue(e.target.value)}
              />
            </div>
          </div>
          <div className="row">
            <label className="col25">
              <code>chars</code>
            </label>
            <div className="col75">
              <input
                type="text"
                name="chars"
                value={chars}
                disabled={mode === Modes.Words}
                onChange={e => setChars(e.target.value)}
              />
            </div>
          </div>
          <div className="row">
            <label className="col25">
              <code>words</code>
            </label>
            <div className="col75">
              <input
                type="text"
                name="words"
                value={JSON.stringify(words)}
                disabled={mode !== Modes.Words}
                onChange={e => setWords(JSON.parse(e.target.value))}
              />
            </div>
          </div>
          <div className="row">
            <label className="col25">
              <code>length</code>
            </label>
            <div className="col75">
              <input
                type="number"
                name="length"
                value={length}
                min="1"
                disabled={mode === Modes.Words}
                onChange={e => setLength(Math.max(Number(e.target.value), 1))}
              />
            </div>
          </div>
          <div className="row">
            <label className="col25">
              <code>timing</code>
            </label>
            <div className="col75">
              <input
                type="number"
                name="timing"
                value={timing}
                min="1"
                onChange={e => setTiming(Math.max(Number(e.target.value), 1))}
              />
            </div>
          </div>
          <div className="row">
            <label className="col25">
              <code>padChar</code>
            </label>
            <div className="col75">
              <input
                type="text"
                name="padChar"
                value={padChar}
                size={1}
                disabled={mode === Modes.Words}
                onChange={e => setPadChar(String(e.target.value).slice(0, 1))}
              />
            </div>
          </div>
          <div className="row">
            <label className="col25">
              <code>padMode</code>
            </label>
            <div className="col75">
              <input
                id="padMode:auto"
                type="radio"
                name="padMode"
                value="auto"
                checked={padMode === "auto"}
                disabled={mode === Modes.Words}
                onChange={e => setPadMode(e.target.value as PadMode)}
              />
              <label htmlFor="padMode:auto">
                <code>auto</code>
              </label>
              <input
                id="padMode:start"
                type="radio"
                name="padMode"
                value="start"
                checked={padMode === "start"}
                disabled={mode === Modes.Words}
                onChange={e => setPadMode(e.target.value as PadMode)}
              />
              <label htmlFor="padMode:start">
                <code>start</code>
              </label>
              <input
                id="padMode:end"
                type="radio"
                name="padMode"
                value="end"
                checked={padMode === "end"}
                disabled={mode === Modes.Words}
                onChange={e => setPadMode(e.target.value as PadMode)}
              />
              <label htmlFor="padMode:end">
                <code>end</code>
              </label>
            </div>
          </div>
          <div className="row">
            <label className="col25">
              <code>hinge</code>
            </label>
            <div className="col75">
              <input
                type="checkbox"
                id="hinge"
                name="hinge"
                checked={hinge}
                onChange={e => setHinge(e.target.checked)}
              />
              <label htmlFor="hinge">Show hinge</label>
            </div>
          </div>
        </div>
      </form>
      <div style={{ textAlign: "center", margin: "20px 0" }}>
        <button
          onClick={() => setShowPerformanceTest(true)}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Show Performance Test (50 Displays)
        </button>
        <button
          onClick={() => setShowTripleDigit(true)}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginLeft: "10px"
          }}
        >
          Show Single Digit
        </button>
      </div>
    </div>
  );
};
