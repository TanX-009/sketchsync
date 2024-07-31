"use client";

import Image from "next/image";
import styles from "./styles.module.css";
import ToolBar from "./components/ToolBar";
import dynamic from "next/dynamic";
import UserBar from "./components/UserBar";
import Panel from "@/components/ui/Panel";
import { TAction } from "./components/Whiteboard/types";
import { useState } from "react";

const Whiteboard = dynamic(() => import("./components/Whiteboard"), {
  loading: () => <Panel>Loading...</Panel>,
  ssr: false,
});

export interface TBoardActions {
  undo: () => void;
  redo: () => void;
  clear: () => void;
}

export default function Home() {
  const [boardActions, setBoardActions] = useState<TBoardActions>({
    undo: () => {},
    redo: () => {},
    clear: () => {},
  });

  return (
    <div className={styles.main}>
      <UserBar />
      <Whiteboard setBoardActions={setBoardActions} />
      <ToolBar boardActions={boardActions} />
    </div>
  );
}
