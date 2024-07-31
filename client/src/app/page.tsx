import Image from "next/image";
import styles from "./styles.module.css";
import ToolBar from "./components/ToolBar";
import dynamic from "next/dynamic";
import UserBar from "./components/UserBar";
import Panel from "@/components/ui/Panel";

const Whiteboard = dynamic(() => import("./components/Whiteboard"), {
  loading: () => <Panel>Loading...</Panel>,
  ssr: false,
});

export default function Home() {
  return (
    <div className={styles.main}>
      <UserBar />
      <Whiteboard />
      <ToolBar />
    </div>
  );
}
