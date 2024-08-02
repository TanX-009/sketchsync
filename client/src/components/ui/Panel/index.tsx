import React, { ForwardedRef, forwardRef, ReactNode } from "react";
import styles from "./styles.module.css";

interface TProps {
  readonly children: ReactNode;
  className?: string;
}

function PanelComponent(
  { children, className = "" }: TProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <div className={"panel " + className} ref={ref}>
      {children}
    </div>
  );
}
const Panel = forwardRef(PanelComponent);

export default Panel;
