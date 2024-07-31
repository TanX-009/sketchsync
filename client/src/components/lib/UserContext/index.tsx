"use client";

import React, { Component, createContext } from "react";
import generateRoomCode from "../generateRoomCode";

interface TProps {
  readonly children: React.ReactNode;
}
interface TState {
  primary: string;
  currentColor: string;
  currentWidth: number;
  user: string;
  roomCode: string;
}

export interface TContext {
  context: TState;
  setContext: (value: TState, callback?: (() => void) | null) => void;
}

const UContext = createContext<TContext | null>(null);

class UserContext extends Component<TProps, TState> {
  constructor(props: TProps) {
    super(props);
    this.state = {
      primary: "#ffffff",
      currentColor: "#ffffff",
      currentWidth: 10,
      user: "Guest" + Math.floor(Math.random() * 1000),
      roomCode: "",
    };
  }

  componentDidMount(): void {
    const primaryVar = getComputedStyle(document.body).getPropertyValue(
      "--primary",
    );
    this.setState({
      ...this.state,
      primary: primaryVar,
      currentColor: primaryVar,
      roomCode: generateRoomCode(),
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
        }}
      >
        {children}
      </UContext.Provider>
    );
  }
}

export { UContext };
export default UserContext;
