"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";
import { TContext, UContext } from "@/components/lib/UserContext";
import Button from "@/components/ui/Button";
import { motion } from "framer-motion";

export default function JoinButton() {
  const [codeInput, setCodeInput] = useState<string>("");
  const [joinButtonText, setJoinButtonText] = useState<string>("Join");

  const { context, setContext } = useContext(UContext) as TContext;

  const [open, setOpen] = useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startHideTimer = () => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set a new timeout
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 5000);
  };

  useEffect(() => {
    startHideTimer();
  }, [codeInput]);

  const handleJoin = () => {
    if (!open) {
      setOpen(true);

      startHideTimer();
      return;
    }
    const isCodeValid = () => {
      const parts = codeInput.split("-");
      if (parts.length !== 3) return false;
      for (const part of parts) {
        if (part.length !== 3) return false;
      }
      return true;
    };
    if (!isCodeValid()) {
      setJoinButtonText("Invalid!");
      setTimeout(() => {
        setJoinButtonText("Join");
      }, 1000);
      return;
    }
    setJoinButtonText("Joining...");
    setContext({ ...context, roomCode: codeInput }, () => {
      setJoinButtonText("Join");
      setCodeInput("");
      setOpen(false);
    });
  };
  const handleCodeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCodeInput(event.target.value);
  };
  return (
    <div className={styles.joinButton}>
      <motion.input
        className={styles.codeInput}
        type="text"
        placeholder="Room code"
        value={codeInput}
        onChange={handleCodeInput}
        initial={false}
        variants={{
          open: {
            opacity: 1,
            width: "calc(14 * 1ch)",
            padding: "var(--sp-3xs)",
            border: "var(--border) solid var(--primary)",
          },
          closed: { opacity: 0, width: 0, padding: 0, border: "none" },
        }}
        animate={open ? "open" : "closed"}
      />
      <Button.HighContrast onClick={handleJoin} className={styles.joinButton}>
        {joinButtonText}
      </Button.HighContrast>
    </div>
  );
}
