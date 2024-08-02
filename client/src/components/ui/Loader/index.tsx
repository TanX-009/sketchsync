import { motion, Transition } from "framer-motion";
import React from "react";
import styles from "./styles.module.css";

export default function Loader() {
  return (
    <div className={styles.loading}>
      <span />
      <span />
      <span />
    </div>
  );
}
