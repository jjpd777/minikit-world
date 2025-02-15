
"use client";
import eruda from "eruda";
import { useEffect } from "react";

export function ErudaProvider() {
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.eruda) {
      eruda.init();
    }
  }, []);
  return null;
}
