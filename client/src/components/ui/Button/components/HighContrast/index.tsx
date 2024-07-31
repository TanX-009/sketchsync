import React, { MouseEventHandler, ReactNode } from "react";
import styles from "./styles.module.css";

interface TProps {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
}

export default function HighContrast({
  children,
  onClick,
  className = "",
}: TProps) {
  return (
    <button
      type="button"
      className={styles.highContrast + " " + className}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
