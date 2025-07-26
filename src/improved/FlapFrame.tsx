import classnames from "classnames";
import React, { useMemo } from "react";
import styles from "./improved-styles.css";

interface FlapFrameProps {
  char: string;
  nextChar: string;
  delay: number;
  timing?: number;
  isStatic?: boolean;
  hinge?: boolean;
  className?: string;
  css?: any;
}

export const FlapFrame: React.FC<FlapFrameProps> = ({
  char,
  nextChar,
  delay,
  timing = 120,
  isStatic = false,
  hinge = true,
  className,
  css
}) => {
  // We want the animation to 2x faster than the character change timing, so that the animation
  // completely before the next character is displayed.
  const flapTiming = timing / 2;
  const flapTimingHalf = flapTiming / 2;
  const flapDelay = delay + flapTimingHalf;
  const frameClasses = classnames(styles.flapFrame, className);

  // Memoize all styles before any conditional logic
  const staticFrameStyle = useMemo(
    () => ({
      ...css,
      position: "absolute" as const,
      width: "100%",
      height: "100%",
      "--flap-timing": `${flapTimingHalf}ms`
    }),
    [css, flapTimingHalf]
  );

  const animatedFrameStyle = useMemo(
    () => ({
      ...css,
      position: "absolute" as const,
      width: "100%",
      height: "100%",
      zIndex: delay, // Later frames should be on top
      "--flap-timing": `${flapTiming / 2}ms`, // Set CSS variable for animation duration
      "--top-delay": `${delay}ms`,
      "--bottom-delay": `${flapDelay}ms`
    }),
    [css, delay, flapTiming, flapDelay]
  );

  if (isStatic) {
    // For the final character, render without animations
    return (
      <div className={frameClasses} style={staticFrameStyle}>
        <div className={classnames(styles.flapHalf, styles.top, styles.static)}>
          <span className={styles.flapContent}>{char}</span>
        </div>
        <div
          className={classnames(styles.flapHalf, styles.bottom, styles.static)}
        >
          <span className={styles.flapContent}>{char}</span>
        </div>
        {hinge && <div className={styles.hinge} data-kind="hinge" />}
      </div>
    );
  }

  return (
    <div className={frameClasses} style={animatedFrameStyle}>
      {/* Top half of next character, displayed when top flap is animating down */}
      <div className={classnames(styles.flapHalf, styles.top, styles.back)}>
        <span className={styles.flapContent}>{nextChar}</span>
      </div>

      {/* Current character top half, animates down */}
      <div className={classnames(styles.flapHalf, styles.top, styles.animated)}>
        <span className={styles.flapContent}>{char}</span>
      </div>

      {/* Current character bottom half, visible until the bottom flap animates in */}
      <div
        className={classnames(styles.flapHalf, styles.bottom, styles.current)}
      >
        <span className={styles.flapContent}>{char}</span>
      </div>

      {/* Next character bottom half, animates in */}
      <div
        className={classnames(styles.flapHalf, styles.bottom, styles.animated)}
      >
        <span className={styles.flapContent}>{nextChar}</span>
      </div>

      {/* Single hinge in the middle of the entire frame */}
      {hinge && <div className={styles.hinge} data-kind="hinge" />}
    </div>
  );
};
