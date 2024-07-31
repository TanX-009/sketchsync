"use client";

import Panel from "@/components/ui/Panel";
import React, { useContext, useEffect, useState } from "react";
import styles from "./styles.module.css";
import Button from "@/components/ui/Button";
import { FaSun } from "react-icons/fa6";
import { TContext, UContext } from "@/components/lib/UserContext";
import { motion } from "framer-motion";

export default function UserBar() {
  const [roomButtonText, setRoomButtonText] = useState<string>("");
  const { context, setContext } = useContext(UContext) as TContext;

  const [open, setOpen] = useState<boolean>(false);
  const [codeInput, setCodeInput] = useState<string>("");
  const [joinButtonText, setJoinButtonText] = useState<string>("Join");

  useEffect(() => {
    setRoomButtonText(context.roomCode);
  }, [context.roomCode]);

  const handleJoin = () => {
    if (!open) {
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
      }, 5000);
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

  const handleCopy = () => {
    navigator.clipboard
      .writeText(context.roomCode)
      .then(() => {
        setRoomButtonText("Copied!");

        setTimeout(() => {
          setRoomButtonText(context.roomCode);
        }, 1000);
      })
      .catch((error) => {
        console.error("Failed to copy text: ", error);
      });
  };
  return (
    <Panel className={styles.userbar}>
      <div>
        <Button.LowContrast onClick={handleCopy}>
          {roomButtonText}
        </Button.LowContrast>
      </div>
      <div>
        <div className={styles.joinContainer}>
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
          <Button.HighContrast
            onClick={handleJoin}
            className={styles.joinButton}
          >
            {joinButtonText}
          </Button.HighContrast>
        </div>
        <Button.LowContrast>
          <FaSun />
        </Button.LowContrast>
      </div>
    </Panel>
  );
}
