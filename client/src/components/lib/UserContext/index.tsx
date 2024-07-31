"use client";

import React, { Component, createContext } from "react";
import generateRoomCode from "../generateRoomCode";
import { Session } from "next-auth";

interface TProps {
  readonly children: React.ReactNode;
  session: Session | null;
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
    let user = "Guest";
    if (props.session && typeof props.session?.user?.name === "string") {
      user = props.session.user.name;
    }
    this.state = {
      primary: "grey",
      currentColor: "grey",
      currentWidth: 10,
      user: user,
      roomCode: generateRoomCode(),
    };
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
