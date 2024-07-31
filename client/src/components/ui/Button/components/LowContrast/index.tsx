import React, { MouseEventHandler, ReactNode } from "react";
import styles from "./styles.module.css";

interface TProps {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function LowContrast({ children, onClick }: TProps) {
  return (
    <button type="button" className={styles.lowContrast} onClick={onClick}>
      {children}
    </button>
  );
}
