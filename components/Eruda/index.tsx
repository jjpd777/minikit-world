
"use client";

import dynamic from "next/dynamic";
import { ReactNode } from "react";

export const ErudaProvider = (props: { children: ReactNode }) => {
  if (typeof window !== "undefined") {
    // Dynamically import eruda only on client side
    import("eruda").then((eruda) => {
      try {
        eruda.default.init();
      } catch (error) {
        console.log("Eruda failed to initialize", error);
      }
    });
  }

  return <>{props.children}</>;
};
