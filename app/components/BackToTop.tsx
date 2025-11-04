"use client";

import { useEffect, useState } from "react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || window.pageYOffset;
      const innerH = window.innerHeight;
      const docH = document.documentElement.scrollHeight;
      const nearBottom = innerH + y >= docH - 160;
      setVisible(nearBottom);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const scrollTop = () => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    } catch {
      window.scrollTo(0, 0);
    }
  };

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={scrollTop}
      className={`group fixed z-[120] rounded-full p-3.5 md:p-4
        bg-white/10 backdrop-blur-md text-white 
        ring-1 ring-white/15 shadow-2xl shadow-purple-500/10
        transition-all duration-300 hover:bg-white/15 hover:shadow-purple-500/20
        focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70
        ${
          visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      style={{
        bottom: "calc(env(safe-area-inset-bottom, 0px) + 12rem)",
        right: "clamp(4rem, 12vw, 18rem)",
      }}
      title="Back to top"
    >
      <span className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/25 to-purple-600/25 opacity-0 group-hover:opacity-100 transition-opacity" />
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative drop-shadow-sm"
      >
        <path
          d="M12 19V5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M6 11l6-6 6 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
