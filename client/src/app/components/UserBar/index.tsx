"use client";

import Panel from "@/components/ui/Panel";
import React, { useContext, useEffect, useState } from "react";
import styles from "./styles.module.css";
import Button from "@/components/ui/Button";
import { TContext, UContext } from "@/components/lib/UserContext";
import JoinButton from "./components/JoinButton";
import Account from "./components/LoginButton";
import { signIn } from "next-auth/react";

export default function UserBar() {
  const [roomButtonText, setRoomButtonText] = useState<string>("");
  const { context } = useContext(UContext) as TContext;

  useEffect(() => {
    setRoomButtonText(context.roomCode);
  }, [context.roomCode]);

  const handleCopy = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
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
    } else {
      console.error("Clipboard API is not availabe!");
    }
  };
  return (
    <Panel className={styles.userbar}>
      <div>
        {context.user !== "Guest" ? (
          <Button.LowContrast onClick={handleCopy}>
            {roomButtonText}
          </Button.LowContrast>
        ) : (
          <Button.LowContrast onClick={() => signIn("keycloak")}>
            Login to colab!
          </Button.LowContrast>
        )}
      </div>
      <div>
        {context.user !== "Guest" ? <JoinButton /> : null}
        <Account />
      </div>
    </Panel>
  );
}
