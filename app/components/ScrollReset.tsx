"use client";

import { useEffect } from "react";

export default function ScrollReset() {
  useEffect(() => {
    try {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration =
          "manual" as typeof window.history.scrollRestoration;
      }
    } catch {}
  }, []);

  return null;
}
