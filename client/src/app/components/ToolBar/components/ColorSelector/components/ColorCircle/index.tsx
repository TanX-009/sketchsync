"use client";

import React, { useContext } from "react";
import styles from "./styles.module.css";
import { motion, Variants } from "framer-motion";
import { TContext, UContext } from "@/components/lib/UserContext";

interface TProps {
  color: string;
  variants?: Variants | null;
}

export default function ColorCircle({ color, variants = null }: TProps) {
  const { context, setContext } = useContext(UContext) as TContext;

  if (variants) {
    const handleOnClick = () => {
      setContext({ ...context, currentColor: color });
    };
    return (
      <motion.div
        className={styles.colorCircle}
        style={{ background: color }}
        variants={variants}
        onClick={handleOnClick}
      ></motion.div>
    );
  }
  return (
    <div
      className={styles.colorCircle}
      style={{
        background: color,
        scale: 1.1,
      }}
    ></div>
  );
}
