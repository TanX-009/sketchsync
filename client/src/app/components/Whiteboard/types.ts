export interface TDrawing {
  points: number[];
  color: string;
  width: number;
}

export interface TImage {
  src: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export interface TActionDrawing {
  user: string;
  roomCode: string;
  type: "drawing";
  payload: TDrawing;
}

export interface TActionImage {
  user: string;
  roomCode: string;
  type: "image";
  payload: TImage;
}

export type TAction = TActionDrawing | TActionImage;

export interface TCursorLocation {
  x: number;
  y: number;
  user: string;
}

export interface TCursors {
  [user: string]: TCursorLocation;
}
