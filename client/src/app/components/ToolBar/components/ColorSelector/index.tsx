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
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
  closed: { opacity: 0, x: -10, transition: { duration: 0.1 } },
};

export default function ColorSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { context } = useContext(UContext) as TContext;

  const handleClick = () => {
    setIsOpen((val) => !val);
    setTimeout(() => {
      if (isOpen) setIsOpen(false);
    }, 10000);
  };

  return (
    <motion.div
      className={"lowContrastClickable " + styles.colorSelector}
      initial={false}
      onClick={handleClick}
      animate={isOpen ? "open" : "closed"}
    >
      <IoIosColorPalette />
      <ColorCircle color={context.currentColor} />
      <motion.div
        className={styles.menu}
        variants={{
          open: {
            width: "fit-content",
            padding: "0 var(--sp-3xs)",
            transition: {
              type: "spring",
              bounce: 0,
              duration: 0.3,
              delayChildren: 0.05,
              staggerChildren: 0.02,
            },
          },
          closed: {
            width: 0,
            padding: "0 0",
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
