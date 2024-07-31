import React from "react";
import styles from "./styles.module.css";
import { TCursorLocation } from "../../types";
import { BiCross } from "react-icons/bi";

interface TProps {
  cursorLocation: TCursorLocation;
}

export default function Cursor({ cursorLocation }: TProps) {
  return (
    <div
      className={styles.cursor}
      style={{ top: cursorLocation.y, left: cursorLocation.x }}
    >
      <div className={styles.pointer}>
        <BiCross />
      </div>
      <div className={styles.name}>{cursorLocation.user}</div>
    </div>
  );
}
