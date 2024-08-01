import React, { MouseEventHandler, ReactNode } from "react";

interface TProps {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
}

export default function HighContrast({
  children,
  onClick,
  className = "",
}: TProps) {
  return (
    <button
      type="button"
      className={"highContrastClickable " + className}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
