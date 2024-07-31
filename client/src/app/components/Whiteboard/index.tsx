"use client";

import React, {
  ChangeEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Konva from "konva";
import { Stage, Layer, Line, Image, Transformer } from "react-konva";
import io from "socket.io-client";
import styles from "./styles.module.css";
import { TAction, TDrawing, TImage } from "./types";
import { TContext, UContext } from "@/components/lib/UserContext";
import Panel from "@/components/ui/Panel";
import generateRoomCode from "@/components/lib/generateRoomCode";
import { TBoardActions } from "@/app/page";

const socket = io("http://192.168.1.10:4000"); // Adjust the URL as needed

interface TProps {
  setBoardActions: Function;
}

export default function Whiteboard({ setBoardActions }: TProps) {
  const [actions, setActions] = useState<TAction[]>([]);
  const [undoneActions, setUndoneActions] = useState<TAction[]>([]);
  const [connected, setConnected] = useState<boolean>(false);

  const isMoving = useRef(false);
  const whiteboardRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState<Array<number>>([0, 0]);

  const { context, setContext } = useContext(UContext) as TContext;

  // █▀▀ ▄▀█ █▄░█ █░█ ▄▀█ █▀   █▀ █ ▀█ █▀▀
  // █▄▄ █▀█ █░▀█ ▀▄▀ █▀█ ▄█   ▄█ █ █▄ ██▄
  useEffect(() => {
    if (whiteboardRef.current) {
      setCanvasSize([
        whiteboardRef.current.clientWidth,
        whiteboardRef.current.clientHeight,
      ]);
    }
  }, [whiteboardRef]);

  // █▀█ █▀▀ █▀ █ ▀█ █▀▀
  // █▀▄ ██▄ ▄█ █ █▄ ██▄
  const handleResize = () => {
    if (whiteboardRef.current) {
      setCanvasSize([
        whiteboardRef.current.clientWidth,
        whiteboardRef.current.clientHeight,
      ]);
    }
  };
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

  // ░░█ █▀█ █ █▄░█   █▀█ █▀█ █▀█ █▀▄▀█
  // █▄█ █▄█ █ █░▀█   █▀▄ █▄█ █▄█ █░▀░█
  useEffect(() => {
    socket.emit("joinRoom", context.roomCode);
  }, [context.roomCode]);

  // █░█ █ █▀ ▀█▀ █▀█ █▀█ █▄█
  // █▀█ █ ▄█ ░█░ █▄█ █▀▄ ░█░
  useEffect(() => {
    socket.on("history", (history) => {
      setActions(history);
      setConnected(true);
    });

    return () => {
      socket.off("history");
    };
  }, []);

  useEffect(() => {
    socket.on("action", (action: TAction) => {
      setActions((prevActions) => [...prevActions, action]);
    });
    socket.on("update", (actions: TAction[]) => {
      setActions(actions);
    });

    return () => {
      socket.off("action");
      socket.off("update");
    };
  }, []);

  // █ █▄░█ ▀█▀ █▀▀ █▀█ ▄▀█ █▀▀ ▀█▀ █ █▀█ █▄░█
  // █ █░▀█ ░█░ ██▄ █▀▄ █▀█ █▄▄ ░█░ █ █▄█ █░▀█
  const [currentLine, setCurrentLine] = useState<TDrawing | null>(null);

  const handleMouseDown = () => {
    isMoving.current = true;

    // reset undoneActions
    setUndoneActions([]);

    const newLine: TDrawing = {
      points: [],
      color: context.currentColor,
      width: context.currentWidth,
    };

    setCurrentLine(newLine);
  };

  const handleMouseMove = (e: any) => {
    if (!isMoving.current || !currentLine) {
      return;
    }
    e.evt.preventDefault();

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();

    setCurrentLine((prevLine) => {
      if (prevLine) {
        const updatedLine = {
          ...prevLine,
          points: prevLine.points.concat([point.x, point.y]),
        };
        return updatedLine;
      }
      return null;
    });
  };

  const handleMouseUp = () => {
    if (currentLine) {
      // Create action data
      const actionData: TAction = {
        user: context.user, // Replace with actual user identifier
        roomCode: context.roomCode,
        type: "drawing",
        payload: currentLine,
      };

      // Update actions state
      setActions((prevActions) => [...prevActions, actionData]);

      // Emit action data
      socket.emit("action", actionData);

      // Clear the currentLine
      setCurrentLine(null);
    }

    isMoving.current = false;
  };

  // ▄▀█ █▀▀ ▀█▀ █ █▀█ █▄░█ █▀
  // █▀█ █▄▄ ░█░ █ █▄█ █░▀█ ▄█
  useEffect(() => {
    const undo = () => {
      if (actions.length === 0) return;

      const lastAction = actions[actions.length - 1];
      if (lastAction.user === context.user) {
        const newActions = actions.slice(0, actions.length - 1);
        setUndoneActions([lastAction, ...undoneActions]);
        socket.emit("update", newActions);
        setActions(newActions);
      }
    };

    const redo = () => {
      if (undoneActions.length === 0) return;

      const firstUndoneAction = undoneActions[0];
      if (firstUndoneAction.user === context.user) {
        const newActions = [...actions, firstUndoneAction];
        const newUndoneActions = undoneActions.slice(1);
        setUndoneActions(newUndoneActions);
        socket.emit("update", newActions);
        setActions(newActions);
      }
    };

    const clear = () => {
      const filteredActions = actions.filter(
        (action: TAction) => action.user !== context.user,
      );
      socket.emit("update", filteredActions);
      setActions(filteredActions);
    };

    setBoardActions({ undo, redo, clear });
  }, [actions, context.user, setBoardActions, undoneActions]);

  if (connected) {
    return (
      <Panel ref={whiteboardRef} className={styles.whiteboard}>
        <Stage
          width={canvasSize[0]}
          height={canvasSize[1]}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
        >
          <Layer>
            {actions.map((action, i) => {
              if (action.type === "drawing") {
                return (
                  <Line
                    key={`completed-${i}`}
                    points={action.payload.points}
                    stroke={action.payload.color}
                    strokeWidth={action.payload.width}
                    tension={0.5}
                    lineCap="round"
                    globalCompositeOperation="source-over"
                  />
                );
              }
              // Handle other action types
              return null;
            })}

            {currentLine && (
              <Line
                points={currentLine.points}
                stroke={currentLine.color}
                strokeWidth={currentLine.width}
                tension={0.5}
                lineCap="round"
                globalCompositeOperation="source-over"
              />
            )}
          </Layer>
        </Stage>
      </Panel>
    );
  } else return <Panel ref={whiteboardRef}>Loading...</Panel>;
}
