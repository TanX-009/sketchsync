"use client";

import React, { useContext, useEffect, useState } from "react";
import styles from "./styles.module.css";
import { motion } from "framer-motion";
import { TContext, UContext } from "@/components/lib/UserContext";
import { signIn, signOut } from "next-auth/react";

export default function Account() {
  const { context, setContext } = useContext(UContext) as TContext;
  const [buttonText, setButtonText] = useState<string>(context.user);

  const actions = {
    login: () => {
      signIn("keycloak");
    },
    logout: () => {
      signOut();
    },
  };

  const handleClick = () => {
    if (context.user === "Guest") {
      actions.login();
      return;
    }

    actions.logout();
  };

  const handleMouseEnter = () => {
    if (context.user === "Guest") {
      setButtonText("Login");
      return;
    }
    setButtonText("Logout");
  };
  const handleMouseLeave = () => {
    setButtonText(context.user);
  };

  return (
    <motion.button
      className={styles.account}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      transition={{ duration: 0.1 }}
      layout
    >
      {buttonText}
    </motion.button>
  );
}
