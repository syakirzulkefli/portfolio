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

    if (window.location.hash) {
      const path = window.location.pathname + window.location.search;
      window.history.replaceState(null, "", path);
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return null;
}
