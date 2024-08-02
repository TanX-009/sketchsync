"use client";

import Panel from "@/components/ui/Panel";
import React, { RefObject, useContext, useEffect, useState } from "react";
import styles from "./styles.module.css";
import Button from "@/components/ui/Button";
import { TContext, UContext } from "@/components/lib/UserContext";
import JoinButton from "./components/JoinButton";
import Account from "./components/LoginButton";
import { signIn } from "next-auth/react";
import Download from "./components/Download";
import Konva from "konva";
import Loader from "@/components/ui/Loader";

interface TProps {
  stageRef: RefObject<Konva.Stage>;
}

export default function UserBar({ stageRef }: TProps) {
  const [roomButtonText, setRoomButtonText] = useState<string>("");
  const { context } = useContext(UContext) as TContext;

  useEffect(() => {
    if (context.user === "Guest") {
      setRoomButtonText("Login to colab!");
    } else setRoomButtonText(context.roomCode);
  }, [context.roomCode, context.user]);

  const handleCopy = () => {
    if (context.user === "Guest") {
      signIn("keycloak");
      return;
    }

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
        <div
          className={"lowContrastClickable " + styles.copyButton}
          onClick={handleCopy}
        >
          {roomButtonText || <Loader />}
        </div>
        <Download stageRef={stageRef} />
      </div>
      <div>
        {context.user !== "Guest" ? <JoinButton /> : null}
        <Account />
      </div>
    </Panel>
  );
}
