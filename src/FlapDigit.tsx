import React from "react";
import { Flap } from "./Flap";
import styles from "./styles.css";

interface FlapDigitProps {
  className?: string;
  css?: any;
  value?: string;
  prevValue?: string;
  final?: boolean;
  mode?: string | null;
  // Props that will be passed through to Flap components
  bottom?: boolean;
  animated?: boolean;
  hinge?: boolean;
}

export const FlapDigit: React.FC<FlapDigitProps> = ({
  className,
  css,
  value = "",
  prevValue = "",
  final = false,
  mode = null,
  ...restProps
}) => {
  return (
    <div className={styles.digit} data-kind="digit" data-mode={mode}>
      <Flap {...restProps}>{value}</Flap>
      <Flap bottom {...restProps}>
        {prevValue}
      </Flap>
      <Flap key={`top-${prevValue}`} animated final={final} {...restProps}>
        {prevValue}
      </Flap>
      {final && (
        <Flap key={`bottom-${value}`} bottom animated final {...restProps}>
          {value}
        </Flap>
      )}
    </div>
  );
};
