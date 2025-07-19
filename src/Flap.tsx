import classnames from "classnames";
import React from "react";
import styles from "./styles.css";

interface FlapProps {
  bottom?: boolean;
  animated?: boolean;
  final?: boolean;
  hinge?: boolean;
  children?: React.ReactNode;
}

export const Flap: React.FC<FlapProps> = ({
  bottom = false,
  animated = false,
  final = false,
  hinge = false,
  children
}) => {
  const classes = classnames(styles.flap, {
    [styles.bottom]: bottom,
    [styles.top]: !bottom,
    [styles.animated]: animated,
    [styles.final]: final
  });

  return (
    <div className={classes}>
      {children}
      {hinge && <div className={styles.hinge} data-kind="hinge" />}
    </div>
  );
};
