"use client";

import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Konva from "konva";
import { Stage, Layer, Line, Image, Transformer } from "react-konva";
import styles from "./styles.module.css";
import {
  TAction,
  TActionImage,
  TCursorLocation,
  TCursors,
  TDrawing,
  TImage,
} from "./types";
import { TContext, UContext } from "@/components/lib/UserContext";
import Panel from "@/components/ui/Panel";
import { TBoardActions } from "@/app/page";
import Cursor from "./components/Cursor";
import useImage from "use-image";
import URLImage from "./components/URLImage";
import { Socket } from "socket.io-client";

interface TProps {
  actions: TAction[];
  undoneActions: TAction[];
  setActions: Function;
  setUndoneActions: Function;
}

export default function Whiteboard({
  actions,
  setActions,
  undoneActions,
  setUndoneActions,
}: TProps) {
  const [cursors, setCursors] = useState<TCursors>({});

  const isMoving = useRef(false);
  const whiteboardRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState<Array<number>>([0, 0]);

  const [selectedId, selectShape] = useState<string>("");

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

  // █░█ █ █▀ ▀█▀ █▀█ █▀█ █▄█
  // █▀█ █ ▄█ ░█░ █▄█ █▀▄ ░█░
  useEffect(() => {
    context.socket.emit("joinRoom", context.roomCode);
    context.socket.on("history", (history) => {
      setActions(history);
    });

    return () => {
      context.socket.off("history");
    };
  }, [context.roomCode, context.socket, setActions]);

  // █▀ █▀█ █▀▀ █▄▀ █▀▀ ▀█▀ █▀
  // ▄█ █▄█ █▄▄ █░█ ██▄ ░█░ ▄█
  useEffect(() => {
    context.socket.on("action_StoC", (action: TAction) => {
      if (action.type === "image") {
        const updatedActions: TAction[] = actions.map((ac: TAction) => {
          if (ac.type === "image" && ac.payload.src === action.payload.src) {
            return { ...ac, latest: false } as TActionImage;
          }
          return ac as TAction;
        });
        updatedActions.push(action);
        setActions(updatedActions);
      } else setActions((prevActions: TAction[]) => [...prevActions, action]);
    });
    context.socket.on("update", (actions: TAction[]) => {
      setActions(actions);
    });
    context.socket.on("cursorMove", (cursorLocation: TCursorLocation) => {
      setCursors((prevCursors) => ({
        ...prevCursors,
        [cursorLocation.user]: cursorLocation,
      }));
    });
    return () => {
      context.socket.off("action_StoC");
      context.socket.off("update");
      context.socket.off("cursorMove");
    };
  }, [context.socket, actions, setActions]);

  // █ █▄░█ ▀█▀ █▀▀ █▀█ ▄▀█ █▀▀ ▀█▀ █ █▀█ █▄░█
  // █ █░▀█ ░█░ ██▄ █▀▄ █▀█ █▄▄ ░█░ █ █▄█ █░▀█
  const [currentLine, setCurrentLine] = useState<TDrawing | null>(null);

  const handleMouseDown = (e: any) => {
    isMoving.current = true;

    // reset undoneActions
    if (undoneActions.length > 0) setUndoneActions([]);

    if (e.target.className !== "Image" && e.target.className !== "Rect") {
      // reset selectedId
      selectShape("");

      const newLine: TDrawing = {
        points: [],
        color: context.currentColor,
        width: context.currentWidth,
      };

      setCurrentLine(newLine);
    }
  };

  const handleMouseMove = (e: any) => {
    e.evt.preventDefault();

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    const cursorLocation: TCursorLocation = {
      x: point.x,
      y: point.y,
      user: context.user,
    };

    context.socket.emit("cursorMove", cursorLocation);

    if (!isMoving.current || !currentLine) {
      return;
    }

    if (!currentLine) {
      setCurrentLine(null);
    }
    setCurrentLine({
      ...currentLine,
      points: currentLine.points.concat([point.x, point.y]),
    });
  };

  const handleMouseUp = (e: any) => {
    if (currentLine && e.target.className !== "Image") {
      // Create action data
      const actionData: TAction = {
        user: context.user, // Replace with actual user identifier
        roomCode: context.roomCode,
        type: "drawing",
        payload: currentLine,
      };

      // Update actions state
      setActions((prevActions: TAction[]) => [...prevActions, actionData]);

      // Emit action data
      context.socket.emit("action_CtoS", actionData);

      // Clear the currentLine
      setCurrentLine(null);
    }

    isMoving.current = false;
  };

  const handleImageTransform = (newData: TImage) => {
    const updatedActions: TAction[] = actions.map((action: TAction) => {
      if (action.type === "image" && action.payload.src === newData.src) {
        return { ...action, latest: false } as TActionImage;
      }
      return action as TAction;
    });

    const newAction: TAction = {
      user: context.user,
      roomCode: context.roomCode,
      latest: true,
      type: "image",
      payload: newData,
    };
    context.socket.emit("action_CtoS", newAction);

    updatedActions.push(newAction);
    setActions(updatedActions);
  };

  if (context.socket.connected) {
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
              } else if (action.type === "image" && action.latest) {
                return (
                  <URLImage
                    key={i}
                    data={action.payload}
                    isSelected={selectedId === action.payload.src}
                    onSelect={() => selectShape(action.payload.src)}
                    onTransform={handleImageTransform}
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
        {Object.keys(cursors).map((key) => (
          <Cursor key={key} cursorLocation={cursors[key]} />
        ))}
      </Panel>
    );
  } else return <Panel ref={whiteboardRef}>Connecting...</Panel>;
}
