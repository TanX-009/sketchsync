"use client";

import React, { useContext } from "react";
import styles from "./styles.module.css";
import {
  FaImage,
  FaMessage,
  FaPencil,
  FaSquareFull,
  FaTrash,
} from "react-icons/fa6";
import Panel from "@/components/ui/Panel";
import Button from "@/components/ui/Button";
import { PiLineVertical } from "react-icons/pi";
import ColorSelector from "./components/ColorSelector";
import WidthSelector from "./components/WidthSelector";
import { IoTriangleSharp } from "react-icons/io5";
import ImageUpload from "./components/ImageUpload";
import { FaRedo, FaUndoAlt } from "react-icons/fa";
import { TBoardActions } from "@/app/page";
import ThemeButton from "./components/ThemeButton";
import { TContext, UContext } from "@/components/lib/UserContext";
import Loader from "@/components/ui/Loader";

interface TProps {
  boardActions: TBoardActions;
}

export default function ToolBar({ boardActions }: TProps) {
  const { context, updateContext } = useContext(UContext) as TContext;

  const handleChatClick = () => {
    if (context.user !== "Guest" && context.socket.connected)
      updateContext({ isChatOpen: true });
  };

  return (
    <div className={styles.toolbar}>
      <Panel className={styles.panel}>
        <div>
          <ColorSelector />
          <WidthSelector />
          <ImageUpload boardActions={boardActions} />
        </div>
        <div>
          <Button.LowContrast onClick={boardActions.undo}>
            <FaUndoAlt />
          </Button.LowContrast>
          <Button.LowContrast onClick={boardActions.redo}>
            <FaRedo />
          </Button.LowContrast>
          <Button.LowContrast onClick={boardActions.clear}>
            <FaTrash />
          </Button.LowContrast>
          <ThemeButton />
          {context.user !== "Guest" ? (
            <Button.LowContrast onClick={handleChatClick}>
              <FaMessage />
            </Button.LowContrast>
          ) : null}
        </div>
      </Panel>
    </div>
  );
}
