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

export default function Whiteboard({ setBoardActions }: any) {
  const [actions, setActions] = useState<TAction[]>([]);
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
      // To-do: Handle history
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

    return () => {
      socket.off("action");
    };
  }, []);

  // █ █▄░█ ▀█▀ █▀▀ █▀█ ▄▀█ █▀▀ ▀█▀ █ █▀█ █▄░█
  // █ █░▀█ ░█░ ██▄ █▀▄ █▀█ █▄▄ ░█░ █ █▄█ █░▀█
  const [currentLine, setCurrentLine] = useState<TDrawing | null>(null);

  const handleMouseDown = () => {
    isMoving.current = true;

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
        user: "currentUser", // Replace with actual user identifier
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
    console.log("asfdasdfsadfadfs");
    const undo = () => {};
    const redo = () => {};
    const clear = () => {
      setActions(actions.filter((action) => action.user === context.user));
    };
    setBoardActions({ undo, redo, clear });
  }, []);

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
