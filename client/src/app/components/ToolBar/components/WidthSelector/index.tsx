"use client";

import React, { useContext, useState } from "react";
import styles from "./styles.module.css";
import { motion, Variants } from "framer-motion";
import WidthContainer from "./components/WidthContainer";
import { FaPencil } from "react-icons/fa6";
import { TContext, UContext } from "@/components/lib/UserContext";

const itemVariants: Variants = {
  open: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
  closed: { opacity: 0, x: -10, transition: { duration: 0.1 } },
};

export default function WidthSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { context } = useContext(UContext) as TContext;

  return (
    <motion.div
      className={styles.widthSelector}
      initial={false}
      onClick={() => setIsOpen(!isOpen)}
      animate={isOpen ? "open" : "closed"}
    >
      <FaPencil />
      <WidthContainer width={context.currentWidth} />
      <motion.div
        className={styles.menu}
        variants={{
          open: {
            width: "fit-content",
            display: "flex",
            opacity: 1,
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
            display: "none",
            opacity: 0,
            padding: "0 0",
            transition: {
              type: "spring",
              bounce: 0,
              duration: 0.3,
            },
          },
        }}
      >
        <WidthContainer width={2} variants={itemVariants} />
        <WidthContainer width={4} variants={itemVariants} />
        <WidthContainer width={8} variants={itemVariants} />
        <WidthContainer width={10} variants={itemVariants} />
        <WidthContainer width={12} variants={itemVariants} />
        <WidthContainer width={14} variants={itemVariants} />
        <WidthContainer width={16} variants={itemVariants} />
        <WidthContainer width={20} variants={itemVariants} />
        <WidthContainer width={24} variants={itemVariants} />
        <WidthContainer width={28} variants={itemVariants} />
        <WidthContainer width={32} variants={itemVariants} />
      </motion.div>
    </motion.div>
  );
}
