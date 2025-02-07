"use client"; // Required for Next.js

import { MiniKit } from "@worldcoin/minikit-js";
import { ReactNode, useEffect } from "react";

export default function MiniKitProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    MiniKit.install({
      appId: process.env.NEXT_PUBLIC_APP_ID as string,
      appIcon: "/bendiga_playstore.png"
    });
    console.log(MiniKit.isInstalled());
  }, []);

  return <>{children}</>;
}
