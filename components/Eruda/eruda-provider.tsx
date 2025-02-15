
"use client";
import { useEffect } from "react";

export function ErudaProvider() {
  useEffect(() => {
    (async () => {
      const eruda = await import("eruda");
      eruda.init();
    })();
  }, []);
  return null;
}
