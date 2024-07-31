"use client";

import Panel from "@/components/ui/Panel";
import React, { useContext, useEffect, useState } from "react";
import styles from "./styles.module.css";
import Button from "@/components/ui/Button";
import { FaSun } from "react-icons/fa6";
import { TContext, UContext } from "@/components/lib/UserContext";

export default function UserBar() {
  const [roomButtonText, setRoomButtonText] = useState<string>("");
  const { context } = useContext(UContext) as TContext;

  useEffect(() => {
    setRoomButtonText(context.roomCode);
  }, [context.roomCode]);

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
        <Button.HighContrast>Join</Button.HighContrast>
        <Button.LowContrast>
          <FaSun />
        </Button.LowContrast>
      </div>
    </Panel>
  );
}
