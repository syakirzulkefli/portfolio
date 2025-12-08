"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  DomainId,
  Level,
  Note,
  NoteSection,
  SectionId,
  SortBy,
  domains,
  levels,
  sections,
  sortOptions,
} from "./data";
import { mockNotes } from "./content";

const noteSections = (note: Note | null): NoteSection[] =>
  note?.sections && note.sections.length > 0
    ? note.sections
    : (note?.headings ?? []).map((title) => ({
        title,
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus.",
      }));

const getSectionId = (title: string) =>
  title.toLowerCase().replace(/\s+/g, "-");

export default function NotesPage() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [query, setQuery] = useState("");
  const [notes] = useState<Note[]>(mockNotes);
  const [activeDomain, setActiveDomain] = useState<DomainId>("software");
  const [activeSection, setActiveSection] = useState<SectionId | "all">("all");
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(
    mockNotes[0]?.id ?? null
  );
  const [activeLevel, setActiveLevel] = useState<Level | "all">("all");
  const [sortBy, setSortBy] = useState<SortBy>("recent");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [sectionsOpen, setSectionsOpen] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const lastDomainRef = useRef<DomainId | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("notes-theme");
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setTheme(prefersDark ? "dark" : "light");
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("notes-theme", theme);
  }, [theme]);

  useEffect(() => {
    setActiveSection("all");
    setActiveChapterId(null);
    setActiveTag(null);
  }, [activeDomain]);

  const domainNotes = useMemo(
    () => notes.filter((note) => note.domain === activeDomain),
    [notes, activeDomain]
  );

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return [...domainNotes]
      .filter((note) => {
        if (activeSection !== "all" && note.section !== activeSection)
          return false;
        if (activeChapterId && note.chapterId !== activeChapterId) return false;
        if (activeLevel !== "all" && note.level !== activeLevel) return false;
        if (activeTag && !note.tags.includes(activeTag)) return false;
        if (!q) return true;
        return (
          note.title.toLowerCase().includes(q) ||
          note.summary.toLowerCase().includes(q) ||
          note.tags.some((t) => t.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => {
        if (sortBy === "recent") {
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        }
        if (sortBy === "mostReviewed") {
          return (b.viewCount ?? 0) - (a.viewCount ?? 0);
        }
        const order: Record<Level, number> = {
          intro: 0,
          beginner: 1,
          intermediate: 2,
          advanced: 3,
        };
        return order[a.level] - order[b.level];
      });
  }, [
    domainNotes,
    activeSection,
    activeChapterId,
    activeLevel,
    activeTag,
    query,
    sortBy,
  ]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const domainChanged = lastDomainRef.current !== activeDomain;
    lastDomainRef.current = activeDomain;

    const hasActiveInDomain =
      !!activeNoteId && domainNotes.some((note) => note.id === activeNoteId);
    const stored = window.localStorage.getItem(
      `notes-last-note-${activeDomain}`
    );
    const storedValid =
      !!stored && domainNotes.some((note) => note.id === stored);

    if ((domainChanged || !hasActiveInDomain) && storedValid) {
      setActiveNoteId(stored);
      return;
    }
    if (domainChanged || !hasActiveInDomain) {
      if (filtered[0]?.id) {
        setActiveNoteId(filtered[0].id);
      }
    }
  }, [activeDomain, domainNotes, filtered, activeNoteId]);

  const activeNote =
    filtered.find((note) => note.id === activeNoteId) || filtered[0] || null;

  useEffect(() => {
    if (activeNote) return;
    setActiveNoteId(filtered[0]?.id ?? null);
  }, [filtered, activeNote]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!activeNoteId) return;
    const existsInDomain = domainNotes.some((note) => note.id === activeNoteId);
    if (!existsInDomain) return;
    window.localStorage.setItem(
      `notes-last-note-${activeDomain}`,
      activeNoteId
    );
  }, [activeNoteId, activeDomain, domainNotes]);

  const toc = noteSections(activeNote);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!activeNote || toc.length === 0) {
      setActiveSectionId(null);
      return;
    }

    const ids = toc.map((sec) => getSectionId(sec.title));
    if (ids.length > 0) {
      setActiveSectionId((prev) => prev ?? ids[0] ?? null);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
            setActiveSectionId(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
      observer.disconnect();
    };
  }, [activeNote, toc]);

  const isDark = theme === "dark";
  const bgClass = isDark
    ? "bg-slate-950 text-slate-100"
    : "bg-slate-50 text-slate-900";
  const panelClass = isDark
    ? "border-slate-800/70 bg-slate-900/70 text-slate-100"
    : "border-slate-200 bg-white text-slate-900";
  const inputClass = isDark
    ? "border-slate-800 bg-slate-900 text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:ring focus:ring-sky-500/20"
    : "border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:ring focus:ring-sky-500/20";

  const textPrimary = isDark ? "text-slate-50" : "text-slate-900";
  const textBody = isDark ? "text-slate-200" : "text-slate-700";
  const textMuted = isDark ? "text-slate-400" : "text-slate-500";
  const textSubtle = isDark ? "text-slate-500" : "text-slate-500";
  const hoverRow = isDark ? "hover:bg-slate-800" : "hover:bg-slate-100";
  const badgeBg = isDark ? "bg-slate-800/80" : "bg-slate-100";
  const borderSoft = isDark ? "border-slate-800" : "border-slate-200";
  const borderDashedSoft = isDark
    ? "border-slate-600/80"
    : "border-slate-300";
  const cardShadow = isDark ? "shadow-slate-950/40" : "shadow-slate-200";

  const headingSm = `${textPrimary} text-sm font-semibold tracking-[0.08em] uppercase`;
  const headingMd = `${textPrimary} text-xl font-semibold leading-tight`;
  const bodySm = `${textBody} text-xs leading-[1.6]`;
  const bodyBase = `${textBody} text-sm leading-[1.75]`;
  const labelMuted = `${textMuted} text-[11px] tracking-[0.2em] uppercase`;

  const chip =
    "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] transition duration-150 ease-out";
  const chipActive =
    "bg-sky-500 text-slate-950 shadow-sm shadow-sky-500/30 border-sky-500";
  const pillButton =
    "inline-flex items-center justify-center rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.15em] transition duration-150 ease-out gap-2";
  const pillButtonActive = isDark
    ? "border-sky-500 bg-slate-900 text-sky-100 shadow-sm shadow-sky-500/30"
    : "border-sky-500 bg-white text-sky-700 shadow-sm shadow-sky-500/20";
  const focusRing =
    "focus:outline-none focus:ring-2 focus:ring-sky-400/60 focus:ring-offset-0";
  const cardGradient = isDark
    ? "bg-gradient-to-br from-white/[0.03] to-transparent"
    : "bg-gradient-to-br from-slate-50 to-white";

  const surfaceSubtle = isDark
    ? "bg-slate-900/60 border border-slate-800/70"
    : "bg-white/80 border border-slate-200/80";
  const surfaceElevated = isDark
    ? "bg-slate-900/80 border border-slate-800/70 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.8)]"
    : "bg-white border border-slate-200 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.15)]";
  const surfaceOutline = isDark
    ? "border border-slate-800"
    : "border border-slate-200";

  const brandLogoSrc = isDark
    ? "/syakir_brand_logo_black.svg"
    : "/syakir_brand_logo_white.svg";
  const brandLogoClass = isDark
    ? "h-20 md:h-24 w-auto shrink-0 drop-shadow-[0_0_10px_rgba(0,0,0,0.65)]"
    : "h-20 md:h-24 w-auto shrink-0";

  const quoteText =
    activeDomain === "trading"
      ? "“Gain more, spend less.”"
      : "“Any fool can write code that a computer can understand. Good programmers write code that humans can understand.”";
  const quoteAuthor = activeDomain === "trading" ? "Anonymous" : "Martin Fowler";

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = (e: KeyboardEvent) => {
      if (window.innerWidth < 1024) return;
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      const isFormField =
        target &&
        (tag === "input" ||
          tag === "textarea" ||
          tag === "select" ||
          target.isContentEditable);

      if (e.key === "/" && !isFormField) {
        e.preventDefault();
        searchRef.current?.focus();
        searchRef.current?.select?.();
        return;
      }

      if ((e.key === "j" || e.key === "k") && isFormField) return;

      if (e.key === "j") {
        const idx = filtered.findIndex((n) => n.id === activeNoteId);
        if (idx >= 0 && idx < filtered.length - 1) {
          e.preventDefault();
          setActiveNoteId(filtered[idx + 1].id);
        }
      }
      if (e.key === "k") {
        const idx = filtered.findIndex((n) => n.id === activeNoteId);
        if (idx > 0) {
          e.preventDefault();
          setActiveNoteId(filtered[idx - 1].id);
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, [filtered, activeNoteId]);

  const chaptersBySection = useMemo(() => {
    const map = new Map<
      SectionId,
      { section: SectionId; chapters: { id: string; title: string }[] }
    >();
    domainNotes.forEach((note) => {
      const entry = map.get(note.section) ?? {
        section: note.section,
        chapters: [],
      };
      if (!entry.chapters.some((c) => c.id === note.chapterId)) {
        entry.chapters.push({ id: note.chapterId, title: note.chapterTitle });
      }
      map.set(note.section, entry);
    });
    return Array.from(map.values());
  }, [domainNotes]);

  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className={`min-h-screen relative scroll-smooth ${bgClass}`}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-12 h-80 w-80 rounded-full bg-gradient-to-br from-sky-500/15 via-indigo-500/10 to-transparent blur-3xl opacity-60" />
        <div className="absolute right-[-6rem] top-32 h-[28rem] w-[28rem] rounded-full bg-gradient-to-tr from-indigo-500/12 via-fuchsia-500/8 to-transparent blur-3xl opacity-60" />
        <div className="absolute left-1/2 top-64 h-72 w-72 -translate-x-1/2 rounded-full bg-gradient-to-b from-slate-100/10 via-slate-400/5 to-transparent blur-3xl opacity-50" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[url('/noise.png')] opacity-[0.015] mix-blend-soft-light" />
      <header
        className={[
          "sticky top-0 z-10 border-b backdrop-blur",
          isDark
            ? "border-slate-800/60 bg-slate-950/85"
            : "border-slate-200/70 bg-white/85",
        ].join(" ")}
      >
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-6 pb-4">
          <div className="flex items-center justify-between gap-4 py-3">
            <Link href="/" aria-label="Home" className="flex items-center">
              <Image
                src={brandLogoSrc}
                alt="Mohamad Syakir"
                width={1200}
                height={300}
                priority
                className={brandLogoClass}
              />
            </Link>
            <div className="flex items-center gap-3">
              <div className="relative w-40 sm:w-56 lg:w-64">
                <input
                  ref={searchRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search notes..."
                  className={`w-full rounded-xl border px-3 py-2 text-sm outline-none ring-0 transition duration-150 ease-out ${inputClass}`}
                />
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] uppercase tracking-[0.15em] text-sky-400">
                  /
                </div>
              </div>
              <button
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className={[
                  pillButton,
                  isDark
                    ? "border-slate-800/80 bg-slate-900 text-slate-200 hover:border-sky-500/60"
                    : "border-slate-200 bg-white text-slate-700 hover:border-sky-500/60",
                  "shadow-sm shadow-slate-900/10 hover:brightness-105",
                  focusRing,
                ].join(" ")}
              >
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full ${
                    isDark ? "bg-slate-800" : "bg-slate-100"
                  }`}
                >
                  {isDark ? (
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="h-4 w-4 text-sky-200"
                    >
                      <path
                        fill="currentColor"
                        d="M21 12.79A9 9 0 0 1 11.21 3 7 7 0 1 0 21 12.79Z"
                      />
                    </svg>
                  ) : (
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="h-4 w-4 text-amber-500"
                    >
                      <circle cx="12" cy="12" r="4" fill="currentColor" />
                      <g
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      >
                        <line x1="12" y1="2" x2="12" y2="5" />
                        <line x1="12" y1="19" x2="12" y2="22" />
                        <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
                        <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
                        <line x1="2" y1="12" x2="5" y2="12" />
                        <line x1="19" y1="12" x2="22" y2="12" />
                        <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
                        <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
                      </g>
                    </svg>
                  )}
                </span>
                {isDark ? "Light mode" : "Dark mode"}
              </button>
            </div>
          </div>

          <div className="flex w-full flex-col items-start gap-3 sm:gap-4">
            <div className="flex flex-wrap justify-start gap-2">
              {domains.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => {
                    if (d.id === "trading") return;
                    setActiveDomain(d.id);
                  }}
                  className={[
                    chip,
                    activeDomain === d.id
                      ? chipActive +
                        " border border-sky-500/60 shadow-sky-500/30"
                      : isDark
                      ? "border-slate-800 bg-slate-900 text-slate-200 hover:border-slate-700 hover:bg-slate-800"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
                    focusRing,
                  ].join(" ")}
                >
                  {d.label}
                  {d.id === "trading" && (
                    <span
                      className={[
                        "ml-1 inline-flex items-center justify-center",
                        isDark ? "text-slate-200" : "text-slate-900",
                      ].join(" ")}
                    >
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="h-3 w-3"
                      >
                        <path
                          fill="currentColor"
                          d="M17 9h-1V7a4 4 0 10-8 0v2H7a2 2 0 00-2 2v7a2 2 0 002 2h10a2 2 0 002-2v-7a2 2 0 00-2-2zm-3 0h-4V7a2 2 0 114 0v2z"
                        />
                      </svg>
                    </span>
                  )}
                </button>
              ))}
            </div>

            <figure
              className={[
                "relative w-full max-w-xl self-start rounded-2xl px-4 py-2 sm:px-4 sm:py-3 shadow-md backdrop-blur-sm",
                surfaceElevated,
                cardGradient,
              ].join(" ")}
            >
              <p
                className={`${textPrimary} text-left text-[11px] sm:text-xs md:text-sm font-medium`}
              >
                {quoteText}
              </p>
              <figcaption
                className={`${textMuted} mt-1.5 text-[10px] sm:text-[11px] text-right`}
              >
                — {quoteAuthor}
              </figcaption>
            </figure>

            {/* search moved to top-right beside theme toggle */}
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-7xl grid-cols-[300px_minmax(0,1fr)_300px] gap-4 px-6 py-10">
        {/* Left tree */}
        <aside className="hidden lg:block">
          <div
            className={[
              "sticky top-[120px] space-y-4 rounded-2xl p-4 shadow-lg",
              surfaceElevated,
              cardGradient,
            ].join(" ")}
          >
            <h3 className={`${headingSm} ${textSubtle}`}>Sections</h3>
            <div className="space-y-4 text-sm">
              {chaptersBySection.map((group) => {
                const label =
                  sections.find((s) => s.id === group.section)?.label ??
                  group.section;
                return (
                  <div key={group.section} className="space-y-2">
                    <button
                      onClick={() => {
                        setActiveSection(group.section);
                        setActiveChapterId(null);
                      }}
                      className={[
                        "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-sky-500/60",
                        activeSection === group.section
                          ? "bg-sky-500/15 text-sky-100 ring-1 ring-sky-500/40 shadow-sm shadow-sky-500/20 border border-sky-500/40"
                          : `${textBody} ${hoverRow}`,
                      ].join(" ")}
                    >
                      <span className="font-semibold">{label}</span>
                    </button>
                    <div
                      className={`space-y-1.5 border-l border-dashed pl-3 text-xs ${borderDashedSoft} ${textMuted}`}
                    >
                      {group.chapters.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => {
                            setActiveSection(group.section);
                            setActiveChapterId(c.id);
                            const note = domainNotes.find(
                              (n) => n.chapterId === c.id
                            );
                            if (note) setActiveNoteId(note.id);
                          }}
                          className={[
                            "flex w-full items-center justify-between rounded-md px-2.5 py-1.5 transition duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-sky-500/60",
                            activeChapterId === c.id
                              ? "bg-sky-500/15 text-sky-100 ring-1 ring-sky-500/30 border border-sky-500/30 shadow-sky-500/15"
                              : hoverRow,
                          ].join(" ")}
                        >
                          <span className="truncate">{c.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Center content */}
        <section className="space-y-4">
          <div className="flex gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => setSectionsOpen(true)}
              className={[
                pillButton,
                isDark
                  ? "border-slate-800 bg-slate-900 text-slate-200 hover:border-slate-700"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
                "flex-1 shadow-sm",
                focusRing,
              ].join(" ")}
            >
              Browse sections
            </button>
            {activeNote && (
              <button
                type="button"
                onClick={() => setTocOpen(true)}
                className={[
                  pillButton,
                  isDark
                    ? "border-slate-800 bg-slate-900 text-slate-200 hover:border-slate-700"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
                  "flex-1 shadow-sm",
                  focusRing,
                ].join(" ")}
              >
                On this page
              </button>
            )}
          </div>
          {activeNote ? (
            <article
              className={[
                "mx-auto max-w-[920px] rounded-2xl border p-7 shadow-xl",
                surfaceElevated,
                cardGradient,
              ].join(" ")}
            >
              <p className={`${labelMuted} text-sky-400`}>
                {[
                  domains.find((d) => d.id === activeDomain)?.label,
                  sections.find((s) => s.id === activeNote.section)?.label,
                  activeNote.chapterTitle,
                ]
                  .filter(Boolean)
                  .join(" / ")}
              </p>
              <h1 className={`mt-1 text-3xl font-semibold ${textPrimary}`}>
                {activeNote.title}
              </h1>
              <div
                className={`mt-3 flex flex-wrap items-center gap-2 text-xs ${textMuted}`}
              >
                <span
                  className={`rounded-full px-2.5 py-1 text-xs ${badgeBg} ${textMuted}`}
                >
                  Updated {activeNote.updatedAt}
                </span>
              </div>
              <p className={`mt-4 ${bodyBase}`}>{activeNote.summary}</p>

              <div className="mt-7 space-y-12 md:space-y-14">
                {toc.map((sec) => (
                  <div
                    key={sec.title}
                    id={getSectionId(sec.title)}
                    className="scroll-mt-24 space-y-4"
                  >
                    <h2 className={`${headingMd} leading-tight`}>
                      {sec.title}
                    </h2>
                    <p className={`${bodyBase} text-[15px]`}>{sec.content}</p>
                  </div>
                ))}
              </div>
            </article>
          ) : (
            <div
              className={`mx-auto max-w-[920px] rounded-xl border border-dashed p-8 text-center ${borderSoft} ${textMuted}`}
            >
              Select a note to start reading.
            </div>
          )}
        </section>

        {/* Right TOC */}
        <aside className="hidden xl:block">
          <div
            className={[
              "sticky top-[120px] space-y-4 rounded-2xl p-4 shadow-lg",
              surfaceElevated,
              cardGradient,
            ].join(" ")}
          >
            <h3 className={`${headingSm} ${textSubtle}`}>On this page</h3>
            <ul className={`space-y-2 text-xs ${textBody}`}>
              {toc.map((sec) => {
                const id = getSectionId(sec.title);
                const isActiveSec = activeSectionId === id;
                return (
                  <li key={sec.title}>
                    <a
                      href={`#${id}`}
                      className={[
                        "block rounded-lg px-3 py-2 transition duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-sky-500/60",
                        isActiveSec
                          ? "bg-sky-500/15 font-semibold text-sky-500 border border-sky-500/30 shadow-sm shadow-sky-500/20"
                          : `${hoverRow} ${textBody}`,
                      ].join(" ")}
                    >
                      {sec.title}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>
      </main>

      {sectionsOpen && (
        <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/40 px-4 pb-4 pt-10 sm:items-center backdrop-blur-[2px] transition duration-200 ease-out">
          <div
            className={[
              "w-full max-w-md rounded-2xl border p-4 shadow-xl transition duration-200 ease-out",
              surfaceElevated,
              cardGradient,
            ].join(" ")}
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className={`${headingSm} ${textSubtle}`}>Browse sections</h2>
              <button
                type="button"
                onClick={() => setSectionsOpen(false)}
                className={`text-xs font-medium ${textMuted} ${focusRing} rounded-full px-2 py-1 ${hoverRow}`}
              >
                Close
              </button>
            </div>
            <div className="max-h-[60vh] space-y-3 overflow-y-auto text-sm">
              {chaptersBySection.map((group) => {
                const label =
                  sections.find((s) => s.id === group.section)?.label ??
                  group.section;
                return (
                  <div key={group.section} className="space-y-2">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveSection(group.section);
                        setActiveChapterId(null);
                        setSectionsOpen(false);
                      }}
                      className={[
                        "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium transition duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-sky-500/60",
                        activeSection === group.section
                          ? "bg-sky-500/20 text-sky-100 ring-1 ring-sky-500/40 border border-sky-500/40 shadow-sm shadow-sky-500/25"
                          : `${hoverRow} ${textBody}`,
                      ].join(" ")}
                    >
                      <span>{label}</span>
                    </button>
                    {group.chapters.length > 0 && (
                      <div
                        className={`space-y-1 border-l border-dashed pl-3 text-xs ${borderDashedSoft} ${textMuted}`}
                      >
                        {group.chapters.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => {
                              setActiveSection(group.section);
                              setActiveChapterId(c.id);
                              const note = domainNotes.find(
                                (n) => n.chapterId === c.id
                              );
                              if (note) setActiveNoteId(note.id);
                              setSectionsOpen(false);
                            }}
                            className={[
                              "flex w-full items-center justify-between rounded-md px-2 py-1 text-left transition duration-150 ease-out",
                              activeChapterId === c.id
                                ? "bg-sky-500/20 text-sky-100 ring-1 ring-sky-500/30 border border-sky-500/30 shadow-sky-500/20"
                                : hoverRow,
                              focusRing,
                            ].join(" ")}
                          >
                            <span className="truncate">{c.title}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {tocOpen && activeNote && (
        <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/40 px-4 pb-4 pt-10 sm:items-center backdrop-blur-[2px] transition duration-200 ease-out">
          <div
            className={[
              "w-full max-w-md rounded-2xl border p-4 shadow-xl transition duration-200 ease-out",
              surfaceElevated,
              cardGradient,
            ].join(" ")}
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className={`${headingSm} ${textSubtle}`}>On this page</h2>
              <button
                type="button"
                onClick={() => setTocOpen(false)}
                className={`text-xs font-medium ${textMuted} ${focusRing} rounded-full px-2 py-1 ${hoverRow}`}
              >
                Close
              </button>
            </div>
            <div className="max-h-[60vh] space-y-1 overflow-y-auto text-sm">
              {toc.map((sec) => {
                const id = getSectionId(sec.title);
                const isActiveSec = activeSectionId === id;
                return (
                  <button
                    key={sec.title}
                    type="button"
                    onClick={() => {
                      const el = document.getElementById(id);
                      if (el) {
                        el.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }
                      setActiveSectionId(id);
                      setTocOpen(false);
                    }}
                    className={[
                      "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition duration-150 ease-out",
                      isActiveSec
                        ? "bg-sky-500/15 font-semibold text-sky-500 border border-sky-500/30 shadow-sky-500/20"
                        : `${hoverRow} ${textBody}`,
                      focusRing,
                    ].join(" ")}
                  >
                    <span>{sec.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {showScrollTop && (
        <button
          type="button"
          aria-label="Back to top"
          onClick={() => {
            if (typeof window === "undefined") return;
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className={[
            "fixed bottom-6 right-6 z-40",
            pillButton,
            isDark
              ? "border-slate-700 bg-slate-900/95 text-slate-100 hover:border-sky-500/70"
              : "border-slate-300 bg-white/95 text-slate-800 hover:border-sky-500/70",
            focusRing,
            "gap-1",
          ].join(" ")}
        >
          <span className="inline-flex items-center">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-4 w-4"
            >
              <path
                d="M12 4l-6 6h4v6h4v-6h4z"
                fill="currentColor"
              />
            </svg>
          </span>
          <span className="text-xs font-semibold tracking-[0.18em] uppercase">
            Top
          </span>
        </button>
      )}

      <footer
        className={`mx-auto flex w-full max-w-7xl items-center justify-between border-t px-6 py-4 text-xs ${borderSoft} ${textMuted}`}
      >
        <span>Notes area • UI prototype only</span>
        <span>
          Total visitors (placeholder):{" "}
          <span className={textPrimary}>1,234</span>
        </span>
      </footer>
    </div>
  );
}
