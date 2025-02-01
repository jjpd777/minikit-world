"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

export default function NextAuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  console.log("[Debug] NextAuthProvider initializing");

  return <SessionProvider>{children}</SessionProvider>;
}
