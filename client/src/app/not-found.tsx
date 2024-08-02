import Panel from "@/components/ui/Panel";
import React from "react";
import styles from "./not-found.module.css";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className={styles.notfound}>
      <Panel>
        <h1>Not Found</h1>
        <Link className={"highContrastClickable"} href={"/"}>
          Home
        </Link>
      </Panel>
    </div>
  );
}
