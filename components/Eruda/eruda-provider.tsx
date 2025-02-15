
"use client";
import eruda from "eruda";
import { useEffect } from "react";

export function ErudaProvider() {
  useEffect(() => {
    eruda.init();
  }, []);
  return null;
}
