"use client";

import React, { FormEvent, useContext, useEffect, useState } from "react";
import styles from "./styles.module.css";
import Panel from "../ui/Panel";
import { TContext, UContext } from "../lib/UserContext";
import { motion } from "framer-motion";
import { IoClose, IoSend } from "react-icons/io5";
import Button from "../ui/Button";

interface TMessage {
  user: string;
  message: string;
}

export default function Chat() {
  const { context, updateContext } = useContext(UContext) as TContext;
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<TMessage[]>([]);
  const endOfMessagesRef = React.useRef<HTMLDivElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    setMessages([...messages, { user: context.user, message: message }]);
    context.socket.emit("chat", { user: context.user, message: message });
    setMessage("");
  };

  useEffect(() => {
    context.socket.on("chat", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      context.socket.off("chat");
    };
  }, [context.socket]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <motion.div
      initial={false}
      animate={context.isChatOpen ? "open" : "close"}
      variants={{
        open: {
          height: "100%",
          transition: {
            duration: 0.3,
            ease: "easeOut",
          },
        },
        close: {
          height: 0,
          transition: {
            duration: 0.2,
            ease: "easeOut",
          },
        },
      }}
      className={styles.chat}
    >
      <Panel className={styles.panel}>
        <div className={styles.header}>
          <div>Chat</div>
          <Button.HighContrast
            onClick={() => updateContext({ isChatOpen: false })}
          >
            <IoClose />
          </Button.HighContrast>
        </div>
        <div className={styles.messages}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={styles.message}
              style={{
                alignItems:
                  msg.user === context.user ? "flex-end" : "flex-start",
              }}
            >
              <span className={styles.user}>{msg.user}</span>
              <span className={styles.messageText}>{msg.message}</span>
            </div>
          ))}
          <div className={styles.endOfMessages} ref={endOfMessagesRef}></div>
        </div>
        <form className={styles.chatInput} onSubmit={handleSubmit}>
          <input
            className={"textInput"}
            type="text"
            placeholder="Type your message here"
            value={message}
            required
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button.HighContrast type={"submit"}>
            <IoSend />
          </Button.HighContrast>
        </form>
      </Panel>
    </motion.div>
  );
}
