"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const navItems = [
    { href: "#work", label: "Work" },
    { href: "#experience", label: "Experience" },
    { href: "#about", label: "About" },
    { href: "#contact", label: "Contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const ids = ["work", "experience", "about", "contact"];
    const update = () => {
      const center = window.innerHeight / 2;
      let bestId: string | null = null;
      let bestDist = Infinity;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const elCenter = rect.top + rect.height / 2;
        const dist = Math.abs(elCenter - center);
        if (dist < bestDist) {
          bestDist = dist;
          bestId = id;
        }
      }
      if (bestDist < window.innerHeight * 0.35) {
        setActiveSection(bestId);
      } else {
        setActiveSection(null);
      }
    };
    const onScroll = () => requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const itemClass = useMemo(
    () => (isActive: boolean) =>
      [
        "text-sm font-medium px-4 py-2 rounded-full tracking-tight transition-colors duration-200",
        isActive
          ? "text-white bg-white/10 ring-1 ring-white/10 backdrop-blur-sm shadow-[0_0_20px_rgba(113,232,223,0.12)]"
          : "text-white/80 hover:text-white hover:bg-white/10",
      ].join(" "),
    []
  );

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-[100] transition-all duration-300"
        style={{
          background: scrollY > 50 ? "rgba(0, 0, 0, 0.05)" : "transparent",
          backdropFilter: scrollY > 50 ? "blur(20px)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" aria-label="Home" className="flex items-center">
            <Image
              src="/syakir (A2 (Landscape)) new.svg"
              alt="Mohamad Syakir"
              width={1200}
              height={300}
              priority
              className="h-20 md:h-24 w-auto shrink-0 drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]"
            />
          </Link>

          <div className="hidden md:block">
            <div
              className="flex items-center px-4 py-2 rounded-full"
              style={{
                background: "rgba(0, 0, 0, 0.8)",
              }}
            >
              {navItems.map((item) => {
                const id = item.href.replace("#", "");
                const isActive = activeSection === id;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={itemClass(isActive)}
                  >
                    {item.label}
                  </a>
                );
              })}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <a
              href="https://github.com/syakirzulkefli"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white transition-colors p-2 hover:scale-110 duration-200"
              aria-label="GitHub Profile"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                  clipRule="evenodd"
                />
              </svg>
            </a>

            <a
              href="https://linkedin.com/in/syakir-zulkefli-5b67aa297/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white transition-colors p-2 hover:scale-110 duration-200"
              aria-label="LinkedIn Profile"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>

            <button
              onClick={() =>
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium px-6 py-2 rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-blue-500/25"
            >
              Get In Touch
            </button>
          </div>

          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span
                className={`bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
                  isOpen ? "rotate-45 translate-y-1" : "-translate-y-0.5"
                }`}
              ></span>
              <span
                className={`bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${
                  isOpen ? "opacity-0" : "opacity-100"
                }`}
              ></span>
              <span
                className={`bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
                  isOpen ? "-rotate-45 -translate-y-1" : "translate-y-0.5"
                }`}
              ></span>
            </div>
          </button>
        </div>
      </nav>

      <div
        className={`md:hidden fixed inset-0 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        style={{
          backdropFilter: "blur(20px)",
          background:
            "linear-gradient(135deg, rgba(90, 103, 216, 0.9), rgba(0, 0, 0, 0.8))",
        }}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-8">
          {navItems.map((item) => {
            const id = item.href.replace("#", "");
            const isActive = activeSection === id;
            return (
              <a
                key={item.href}
                href={item.href}
                className={[
                  "text-2xl font-medium transition-colors",
                  isActive ? "text-white" : "text-white/80 hover:text-white",
                ].join(" ")}
                onClick={() => setIsOpen(false)}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </a>
            );
          })}
        </div>
      </div>
    </>
  );
}
