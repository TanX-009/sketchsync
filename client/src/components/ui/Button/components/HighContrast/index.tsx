import React, { MouseEventHandler, ReactNode } from "react";
import styles from "./styles.module.css";

interface TProps {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function HighContrast({ children, onClick }: TProps) {
  return (
    <button type="button" className={styles.highContrast} onClick={onClick}>
      {children}
    </button>
  );
}
