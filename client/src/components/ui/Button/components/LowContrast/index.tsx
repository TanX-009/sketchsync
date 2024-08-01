import React, { MouseEventHandler, ReactNode } from "react";

interface TProps {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
}

export default function LowContrast({
  children,
  onClick,
  className = "",
}: TProps) {
  return (
    <button
      type="button"
      className={"lowContrastClickable " + className}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
