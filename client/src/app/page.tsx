"use client";

import Image from "next/image";
import styles from "./styles.module.css";
import ToolBar from "./components/ToolBar";
import dynamic from "next/dynamic";
import UserBar from "./components/UserBar";
import Panel from "@/components/ui/Panel";
import { TAction, TActionImage } from "./components/Whiteboard/types";
import { useContext, useEffect, useState } from "react";
import Loading from "@/components/ui/Loading";
import { TContext, UContext } from "@/components/lib/UserContext";
import getNth from "@/components/lib/getNth";

const Whiteboard = dynamic(() => import("./components/Whiteboard"), {
  loading: () => (
    <Panel>
      <Loading />
    </Panel>
  ),
  ssr: false,
});

export interface TBoardActions {
  undo: () => void;
  redo: () => void;
  clear: () => void;
  addImage: (data: TActionImage) => void;
}

export default function Home() {
  const [actions, setActions] = useState<TAction[]>([]);
  const [undoneActions, setUndoneActions] = useState<TAction[]>([]);

  const { context, setContext, updateContext } = useContext(
    UContext,
  ) as TContext;

  // ▄▀█ █▀▀ ▀█▀ █ █▀█ █▄░█ █▀
  // █▀█ █▄▄ ░█░ █ █▄█ █░▀█ ▄█
  const boardActions: TBoardActions = {
    undo: () => {
      if (actions.length === 0) return;

      // get last action
      const lastAction = getNth(actions, "user", context.user, "last", 1);

      // newActions with last user action removed
      let newActions: TAction[] = actions.filter(
        (action) => action !== lastAction,
      );

      // if action type is image set latest action
      if (lastAction.type === "image") {
        const secondLastAction = getNth(
          actions,
          "user",
          context.user,
          "last",
          2,
        );

        for (let i = newActions.length - 1; i >= 0; i--) {
          if (newActions[i] === secondLastAction) {
            (newActions[i] as TActionImage).latest = true;
            break;
          }
        }
      }

      // add last action to undoneActions
      setUndoneActions([lastAction, ...undoneActions]);
      // update
      context.socket.emit("update", newActions);
      setActions(newActions);
    },

    redo: () => {
      if (undoneActions.length === 0) return;

      const firstUndoneAction = undoneActions[0];

      let newActions = [...actions, firstUndoneAction];
      if (firstUndoneAction.type === "image") {
        newActions = actions.map((action) => {
          if (action.type === "image" && action.user === context.user) {
            return { ...action, latest: false };
          }
          return action;
        });
        newActions.push(firstUndoneAction);
      }

      const newUndoneActions = undoneActions.slice(1);
      setUndoneActions(newUndoneActions);
      context.socket.emit("update", newActions);
      setActions(newActions);
    },

    clear: () => {
      const filteredActions = actions.filter(
        (action: TAction) => action.user !== context.user,
      );

      context.socket.emit("update", filteredActions);
      setActions(filteredActions);
    },

    addImage: (imageAction: TActionImage) => {
      const updatedActions = [...actions, imageAction];
      context.socket.emit("update", updatedActions);
      setActions(updatedActions);
    },
  };

  return (
    <div className={styles.main}>
      <UserBar />
      <Whiteboard
        actions={actions}
        setActions={setActions}
        undoneActions={undoneActions}
        setUndoneActions={setUndoneActions}
      />
      <ToolBar boardActions={boardActions} />
    </div>
  );
}
