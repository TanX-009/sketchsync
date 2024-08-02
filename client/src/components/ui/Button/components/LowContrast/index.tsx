import React, { MouseEventHandler, ReactNode } from "react";

interface TProps {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  type?: "submit" | "button";
}

export default function LowContrast({
  children,
  onClick,
  className = "",
  type = "button",
}: TProps) {
  return (
    <button
      type={type}
      className={"lowContrastClickable " + className}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
