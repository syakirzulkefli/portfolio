"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "#work", label: "Work" },
  { href: "#experience", label: "Experience" },
  { href: "#gallery", label: "Gallery" },
  { href: "#contact", label: "Contact" },
  { href: "/notes", label: "Notes" },
];

export default function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const lockedSectionRef = useRef<string | null>(null);
  const lockTimeoutRef = useRef<number | null>(null);

  const lockSection = (id: string) => {
    lockedSectionRef.current = id;
    setActiveSection(id);

    if (lockTimeoutRef.current !== null) {
      window.clearTimeout(lockTimeoutRef.current);
    }

    lockTimeoutRef.current = window.setTimeout(() => {
      lockedSectionRef.current = null;
      lockTimeoutRef.current = null;
    }, 1200);
  };

  useEffect(() => {
    const ids = NAV_ITEMS
      .filter((item) => item.href.startsWith("#"))
      .map((item) => item.href.slice(1));

    const update = () => {
      const nav = document.querySelector("nav");
      const navHeight = nav instanceof HTMLElement ? nav.offsetHeight : 96;
      const viewportHeight = window.innerHeight;
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const thresholdY = scrollTop + navHeight + 16;
      const sectionPositions = ids
        .map((id) => {
          const el = document.getElementById(id);
          if (!el) return null;
          return {
            id,
            top: el.getBoundingClientRect().top + scrollTop,
          };
        })
        .filter((section): section is { id: string; top: number } =>
          Boolean(section)
        );

      if (sectionPositions.length === 0) {
        setActiveSection(null);
        return;
      }

      // Keep clicked section highlighted during smooth scroll.
      const lockedId = lockedSectionRef.current;
      if (lockedId) {
        const target = document.getElementById(lockedId);
        if (target) {
          const targetTop = target.getBoundingClientRect().top;
          const arrivedByTop = Math.abs(targetTop - (navHeight + 16)) <= 12;
          const arrivedAtBottom =
            scrollTop + viewportHeight >= docHeight - 2 &&
            lockedId === sectionPositions[sectionPositions.length - 1].id;

          if (!arrivedByTop && !arrivedAtBottom) {
            setActiveSection(lockedId);
            return;
          }
        }
        lockedSectionRef.current = null;
      }

      // Above the first tracked section (hero area): no active nav item.
      if (thresholdY < sectionPositions[0].top) {
        setActiveSection(null);
        return;
      }

      // If user is at the bottom, always activate the last section.
      if (scrollTop + viewportHeight >= docHeight - 2) {
        setActiveSection(sectionPositions[sectionPositions.length - 1].id);
        return;
      }

      let currentSection = sectionPositions[0].id;
      for (const section of sectionPositions) {
        if (thresholdY >= section.top) {
          currentSection = section.id;
        } else {
          break;
        }
      }

      setActiveSection(currentSection);
    };

    const onScroll = () => requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  useEffect(() => {
    return () => {
      if (lockTimeoutRef.current !== null) {
        window.clearTimeout(lockTimeoutRef.current);
      }
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
      <nav className="fixed top-0 left-0 right-0 z-[100]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" aria-label="Home" className="flex items-center">
            <Image
              src="/syakir_brand_logo_black.svg"
              alt="Mohamad Syakir"
              width={1200}
              height={300}
              priority
              className="h-20 md:h-24 w-auto shrink-0"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </Link>

          <div className="hidden lg:block">
            <div
              className="flex items-center px-4 py-2 rounded-full"
              style={{
                background: "#000000",
              }}
            >
              {NAV_ITEMS.map((item) => {
                const id = item.href.startsWith("#") ? item.href.slice(1) : null;
                const itemKey =
                  id ?? (item.href === "/notes" ? "notes" : null);
                const isActive = itemKey
                  ? itemKey === "notes"
                    ? pathname.startsWith("/notes") || activeSection === "notes"
                    : activeSection === itemKey
                  : false;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={itemClass(isActive)}
                    onClick={() => {
                      if (id) {
                        lockSection(id);
                      } else if (item.href === "/notes") {
                        setActiveSection("notes");
                      }
                    }}
                  >
                    {item.label}
                  </a>
                );
              })}
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-4">
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
              onClick={() => {
                lockSection("contact");
                document.getElementById("contact")?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
              className="cta-primary text-sm font-medium px-6 py-2 rounded-full"
            >
              Get In Touch
            </button>
          </div>

          <button
            className="lg:hidden text-white p-2"
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
        className={`lg:hidden fixed inset-0 z-40 transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 visible pointer-events-auto"
            : "opacity-0 invisible pointer-events-none"
        }`}
        style={{
          backdropFilter: "blur(20px)",
          background:
            "linear-gradient(135deg, rgba(90, 103, 216, 0.9), rgba(0, 0, 0, 0.8))",
        }}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-8">
          {NAV_ITEMS.map((item) => {
            const id = item.href.startsWith("#") ? item.href.slice(1) : null;
            const itemKey = id ?? (item.href === "/notes" ? "notes" : null);
            const isActive = itemKey
              ? itemKey === "notes"
                ? pathname.startsWith("/notes") || activeSection === "notes"
                : activeSection === itemKey
              : false;
            return (
              <a
                key={item.href}
                href={item.href}
                className={[
                  "text-2xl font-medium transition-colors",
                  isActive ? "text-white" : "text-white/80 hover:text-white",
                ].join(" ")}
                onClick={() => {
                  if (id) {
                    lockSection(id);
                  } else if (item.href === "/notes") {
                    setActiveSection("notes");
                  }
                  setIsOpen(false);
                }}
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
