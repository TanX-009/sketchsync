import { motion, Transition } from "framer-motion";
import React from "react";
import styles from "./styles.module.css";

const containerVariants = {
  start: {},
  end: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const dotVariants = {
  start: {
    y: "-0.2em",
  },
  end: {
    y: ["-0.2em", "0.2em", "-0.2em"],
  },
};

const dotTransition: Transition = {
  duration: 1,
  repeat: Infinity,
  repeatType: "loop",
};

export default function Loading() {
  return (
    <motion.div
      className={styles.loading}
      variants={containerVariants}
      initial="start"
      animate="end"
    >
      <motion.span variants={dotVariants} transition={dotTransition} />
      <motion.span variants={dotVariants} transition={dotTransition} />
      <motion.span variants={dotVariants} transition={dotTransition} />
    </motion.div>
  );
}
