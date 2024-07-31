import { ReactNode } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "../styles/utopia.space.css";
import "../styles/utopia.step.css";
import "../styles/variables.css";
import "../styles/globals.css";
import UserContext from "@/components/lib/UserContext";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

interface TProps {
  readonly children: ReactNode;
}

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SketchSync",
  description: "Real-time collaborative whiteboard.",
};

export default async function RootLayout({ children }: TProps) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserContext session={session}>{children}</UserContext>
      </body>
    </html>
  );
}
