import { ReactNode } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "../styles/utopia.space.css";
import "../styles/utopia.step.css";
import "../styles/variables.css";
import "../styles/globals.css";
import UserContext from "@/components/lib/UserContext";

interface TProps {
  readonly children: ReactNode;
}

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SketchSync",
  description: "Real-time collaborative whiteboard.",
};

export default function RootLayout({ children }: TProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserContext>{children}</UserContext>
      </body>
    </html>
  );
}
