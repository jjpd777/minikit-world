
"use client";
import eruda from "eruda";
import { useEffect } from "react";

export function ErudaProvider() {
  useEffect(() => {
    if (process.env.NODE_ENV_JJ === 'development' && typeof window !== 'undefined' && !window.eruda) {
      eruda.init();
    }
  }, []);
  return null;
}
