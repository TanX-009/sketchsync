"use client";

import React, { useContext } from "react";
import styles from "./styles.module.css";
import { motion, Variants } from "framer-motion";
import { TContext, UContext } from "@/components/lib/UserContext";

interface TProps {
  width: number;
  variants?: Variants | null;
}

export default function WidthContainer({ width, variants = null }: TProps) {
  const { context, setContext } = useContext(UContext) as TContext;

  if (variants) {
    const handleOnClick = () => {
      setContext({ ...context, currentWidth: width });
    };
    return (
      <motion.div
        className={styles.widthContainer}
        variants={variants}
        onClick={handleOnClick}
      >
        <div style={{ width: width, background: context.currentColor }}></div>
      </motion.div>
    );
  }
  return (
    <div className={styles.widthContainer}>
      <div style={{ width: width, background: context.currentColor }}></div>
    </div>
  );
}
