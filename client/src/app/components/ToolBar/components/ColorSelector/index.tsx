"use client";

import React, { useContext, useState } from "react";
import styles from "./styles.module.css";
import { motion, Variants } from "framer-motion";
import ColorCircle from "./components/ColorCircle";
import { IoIosColorPalette } from "react-icons/io";
import { TContext, UContext } from "@/components/lib/UserContext";

const itemVariants: Variants = {
  open: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
  closed: { opacity: 0, x: -10, y: 0, transition: { duration: 0.1 } },
};

export default function ColorSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { context } = useContext(UContext) as TContext;

  return (
    <motion.div
      className={styles.colorSelector}
      initial={false}
      onClick={() => setIsOpen(!isOpen)}
      animate={isOpen ? "open" : "closed"}
    >
      <IoIosColorPalette />
      <ColorCircle color={context.currentColor} />
      <motion.div
        className={styles.menu}
        variants={{
          open: {
            display: "flex",
            transition: {
              type: "spring",
              bounce: 0,
              duration: 0.3,
              delayChildren: 0.05,
              staggerChildren: 0.02,
            },
          },
          closed: {
            display: "none",
            transition: {
              type: "spring",
              bounce: 0,
              duration: 0.3,
            },
          },
        }}
      >
        <ColorCircle color={context.primary} variants={itemVariants} />
        <ColorCircle color="violet" variants={itemVariants} />
        <ColorCircle color="indigo" variants={itemVariants} />
        <ColorCircle color="blue" variants={itemVariants} />
        <ColorCircle color="green" variants={itemVariants} />
        <ColorCircle color="yellow" variants={itemVariants} />
        <ColorCircle color="orange" variants={itemVariants} />
        <ColorCircle color="red" variants={itemVariants} />
      </motion.div>
    </motion.div>
  );
}
