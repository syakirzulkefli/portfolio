"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const sendTrackEvent = (payload: Record<string, string>) => {
  const body = JSON.stringify(payload);

  if (typeof navigator !== "undefined" && "sendBeacon" in navigator) {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon("/api/analytics", blob);
    return;
  }

  void fetch("/api/analytics", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
    keepalive: true,
  });
};

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    const fullPath = pathname;
    const key = `pv:${pathname}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");

    sendTrackEvent({
      path: fullPath,
      referrer: document.referrer || "",
      screen: `${window.screen.width}x${window.screen.height}`,
      language: navigator.language || "",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
    });
  }, [pathname]);

  return null;
}
