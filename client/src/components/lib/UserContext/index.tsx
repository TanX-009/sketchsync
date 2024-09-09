"use client";

import React, { Component, createContext } from "react";
import io, { Socket } from "socket.io-client";
import generateRoomCode from "@/lib/generateRoomCode";
import generateUsername from "@/lib/generateUsername";

const socket: Socket = io(process.env.NEXT_PUBLIC_SERVER_API_URL); // Adjust the URL as needed

interface TProps {
  readonly children: React.ReactNode;
}
interface TState {
  primary: string;
  currentColor: string;
  currentWidth: number;
  user: string;
  roomCode: string;
  socket: Socket;
  isChatOpen: boolean;
}

export interface TContext {
  context: TState;
  setContext: (value: TState, callback?: (() => void) | null) => void;
  updateContext: (
    value: Partial<TState>,
    callback?: (() => void) | null,
  ) => void;
}

const UContext = createContext<TContext | null>(null);

class UserContext extends Component<TProps, TState> {
  constructor(props: TProps) {
    super(props);
    this.state = {
      primary: "grey",
      currentColor: "grey",
      currentWidth: 10,
      user: "Guest",
      roomCode: generateRoomCode(),
      //roomCode: "asdf",
      socket: socket,
      isChatOpen: false,
    };
  }

  componentDidMount(): void {
    this.setState({
      ...this.state,
      user: generateUsername(),
    });
  }

  render() {
    const { children } = this.props;
    return (
      <UContext.Provider
        value={{
          context: this.state,
          setContext: (value, callback = null) => {
            if (callback) {
              this.setState(value, callback);
            } else this.setState(value);
          },
          updateContext: (value, callback = null) => {
            if (callback) {
              this.setState({ ...this.state, ...value }, callback);
            } else this.setState({ ...this.state, ...value });
          },
        }}
      >
        {children}
      </UContext.Provider>
    );
  }
}

export { UContext };
export default UserContext;
