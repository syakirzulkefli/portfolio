"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  DomainId,
  Level,
  Note,
  SectionId,
  SortBy,
  domains,
} from "./data";
import type { NotesOutlineGroup } from "./outline";

type NotesClientProps = {
  initialNotes: Note[];
  outline: NotesOutlineGroup[];
  initialActiveNoteId?: string | null;
  children?: ReactNode;
};

const JsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    width="50"
    height="50"
    viewBox="0 0 50 50"
    className="w-10 h-10"
    aria-hidden="true"
  >
    <path
      fill="currentColor"
      d="M 6.667969 4 C 5.207031 4 4 5.207031 4 6.667969 L 4 43.332031 C 4 44.792969 5.207031 46 6.667969 46 L 43.332031 46 C 44.792969 46 46 44.796875 46 43.332031 L 46 6.667969 C 46 5.207031 44.796875 4 43.332031 4 Z M 6.667969 6 L 43.332031 6 C 43.703125 6 44 6.296875 44 6.667969 L 44 43.332031 C 44 43.703125 43.703125 44 43.332031 44 L 6.667969 44 C 6.296875 44 6 43.703125 6 43.332031 L 6 6.667969 C 6 6.296875 6.296875 6 6.667969 6 Z M 23 23 L 23 35.574219 C 23 37.503906 22.269531 38 21 38 C 19.671875 38 18.75 37.171875 18.140625 36.097656 L 15 38 C 15.910156 39.925781 18.140625 42 21.234375 42 C 24.65625 42 27 40.179688 27 36.183594 L 27 23 Z M 35.453125 23 C 32.046875 23 29.863281 25.179688 29.863281 28.042969 C 29.863281 31.148438 31.695313 32.617188 34.449219 33.789063 L 35.402344 34.199219 C 37.140625 34.960938 38 35.425781 38 36.734375 C 38 37.824219 37.171875 38.613281 35.589844 38.613281 C 33.707031 38.613281 32.816406 37.335938 32 36 L 29 38 C 30.121094 40.214844 32.132813 42 35.675781 42 C 39.300781 42 42 40.117188 42 36.683594 C 42 33.496094 40.171875 32.078125 36.925781 30.6875 L 35.972656 30.28125 C 34.335938 29.570313 33.625 29.109375 33.625 27.964844 C 33.625 27.039063 34.335938 26.328125 35.453125 26.328125 C 36.550781 26.328125 37.253906 26.792969 37.90625 27.964844 L 40.878906 26.058594 C 39.625 23.84375 37.878906 23 35.453125 23 Z"
    />
  </svg>
);

const TsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    width="50"
    height="50"
    viewBox="0 0 50 50"
    className="w-10 h-10"
    aria-hidden="true"
  >
    <path
      fill="currentColor"
      d="M 5 4 A 1.0001 1.0001 0 0 0 4 5 L 4 45 A 1.0001 1.0001 0 0 0 5 46 L 45 46 A 1.0001 1.0001 0 0 0 46 45 L 46 5 A 1.0001 1.0001 0 0 0 45 4 L 5 4 z M 6 6 L 44 6 L 44 44 L 6 44 L 6 6 z M 15 23 L 15 26.445312 L 20 26.445312 L 20 42 L 24 42 L 24 26.445312 L 29 26.445312 L 29 23 L 15 23 z M 36.691406 23.009766 C 33.576782 22.997369 30.017578 23.941219 30.017578 28.324219 C 30.017578 34.054219 37.738281 34.055625 37.738281 36.640625 C 37.738281 36.885625 37.842187 38.666016 35.117188 38.666016 C 32.392187 38.666016 30.121094 36.953125 30.121094 36.953125 L 30.121094 41.111328 C 30.121094 41.111328 42.001953 44.954062 42.001953 36.289062 C 42.000953 30.664063 34.208984 30.945391 34.208984 28.150391 C 34.208984 27.067391 34.978375 26.054687 37.109375 26.054688 C 39.240375 26.054688 41.126953 27.3125 41.126953 27.3125 L 41.267578 23.607422 C 41.267578 23.607422 39.113892 23.019408 36.691406 23.009766 z"
    />
  </svg>
	);

	const NODE_JS_PATH = `M 21.300781 6 C 21.143781 6 21 6.1257812 21 6.3007812 L 21 11.796875 L 19.753906 11.070312 C 19.675906 11.024313 19.588 11.001953 19.5 11.001953 C 19.412 11.001953 19.324094
	11.024312 19.246094 11.070312 L 16.251953 12.816406 C 16.095953 12.906406 16 13.072953 16 13.251953 L 16 16.748047 C 16 16.928047 16.095953 17.093594 16.251953 17.183594 L
	19.246094 18.929688 C 19.324094 18.975687 19.412 18.998047 19.5 18.998047 C 19.588 18.998047 19.675906 18.975688 19.753906 18.929688 L 22.748047 17.183594 C 22.904047 17.093594 23
16.927047 23 16.748047 L 23 15 L 23 13.251953 L 23 7.2304688 C 23 7.0524688 22.904953 6.8888281 22.751953 6.7988281 L 21.449219 6.0410156 C 21.400219 6.0130156 21.350781 6
21.300781 6 z M 11.5 11.001953 C 11.41225 11.001953 11.324594 11.024813 11.246094 11.070312 L 8.2519531 12.816406 C 8.0959531 12.906406 8 13.072953 8 13.251953 L 8 16.748047 C 8
16.928047 8.0959531 17.093594 8.2519531 17.183594 L 11.246094 18.929688 C 11.403094 19.020688 11.596906 19.020688 11.753906 18.929688 L 14.748047 17.183594 C 14.904047 17.093594 15
16.927047 15 16.748047 L 15 13.251953 C 15 13.071953 14.904047 12.906406 14.748047 12.816406 L 11.753906 11.070312 C 11.675406 11.024812 11.58775 11.001953 11.5 11.001953 z M 27.5
11.001953 C 27.412 11.001953 27.324094 11.024312 27.246094 11.070312 L 24.251953 12.816406 C 24.095953 12.906406 24 13.072953 24 13.251953 L 24 16.748047 C 24 16.928047 24.095953
17.093594 24.251953 17.183594 L 27.15625 18.939453 C 27.31225 19.034453 27.508016 19.035359 27.666016 18.943359 L 29.09375 18.113281 C 29.24175 18.028281 29.24275 17.813562
29.09375 17.726562 L 26 15.904297 L 26 14.109375 L 27.5 13.236328 L 29 14.109375 L 29 15.359375 C 29 15.526375 29.140375 15.552094 29.234375 15.496094 C 29.612375 15.274094
30.751953 14.613281 30.751953 14.613281 C 30.904953 14.524281 31 14.359641 31 14.181641 L 31 13.251953 C 31 13.071953 30.904047 12.906406 30.748047 12.816406 L 27.753906 11.070312
C 27.674906 11.024313 27.588 11.001953 27.5 11.001953 z M 3.5 11.003906 C 3.412 11.003906 3.3240937 11.026266 3.2460938 11.072266 L 0.25195312 12.816406 C 0.095953125 12.907406 0
13.073906 0 13.253906 L 0 17.716797 C 0 17.934797 0.23582812 18.069938 0.42382812 17.960938 L 1.7519531 17.1875 C 1.9049531 17.0975 2 16.933859 2 16.755859 L 2 14.113281 L 3.5
13.238281 L 5 14.113281 L 5 16.755859 C 5 16.933859 5.0950469 17.0975 5.2480469 17.1875 L 6.5761719 17.960938 C 6.7641719 18.070938 7 17.934797 7 17.716797 L 7 13.253906 C 7
13.073906 6.9040469 12.907406 6.7480469 12.816406 L 3.7539062 11.072266 C 3.6759063 11.026266 3.588 11.003906 3.5 11.003906 z M 19.5 13.236328 L 21 14.111328 L 21 15 L 21 15.888672
L 19.5 16.763672 L 18 15.888672 L 18 14.111328 L 19.5 13.236328 z M 27.5 14.003906 L 26.642578 14.503906 L 26.642578 15.501953 L 27.5 16 L 28.357422 15.501953 L 28.357422 14.503906
L 27.5 14.003906 z M 15.40625 17.998047 C 15.303375 17.998047 15.199375 18.023219 15.109375 18.074219 L 12.296875 19.699219 C 12.111875 19.801219 12 20.001938 12 20.210938 L 12
23.457031 C 12 23.666031 12.116875 23.86275 12.296875 23.96875 L 13.037109 24.390625 C 13.392109 24.565625 13.522594 24.566406 13.683594 24.566406 C 14.213594 24.566406 14.515625
24.249453 14.515625 23.689453 L 14.515625 20.482422 C 14.515625 20.433422 14.477594 20.398438 14.433594 20.398438 L 14.078125 20.398438 C 14.029125 20.398438 13.994141 20.438422
13.994141 20.482422 L 13.994141 23.689453 C 13.994141 23.932453 13.737359 24.181656 13.318359 23.972656 L 12.548828 23.529297 C 12.523828 23.514297 12.505859 23.484078 12.505859
23.455078 L 12.505859 20.208984 C 12.505859 20.179984 12.519828 20.145859 12.548828 20.130859 L 15.361328 18.509766 C 15.391328 18.494766 15.425219 18.494766 15.449219 18.509766 L
18.263672 20.130859 C 18.292672 20.145859 18.306641 20.174984 18.306641 20.208984 L 18.306641 23.455078 C 18.306641 23.489078 18.287672 23.518203 18.263672 23.533203 L 15.449219
25.160156 C 15.424219 25.175156 15.385328 25.175156 15.361328 25.160156 L 14.642578 24.732422 C 14.623578 24.722422 14.593219 24.716562 14.574219 24.726562 C 14.375219 24.843563
14.335391 24.858875 14.150391 24.921875 C 14.101391 24.936875 14.034781 24.966922 14.175781 25.044922 L 15.109375 25.599609 C 15.202375 25.648609 15.30425 25.677734 15.40625
25.677734 C 15.51325 25.677734 15.617219 25.648703 15.699219 25.595703 L 18.511719 23.96875 C 18.696719 23.86675 18.808594 23.666031 18.808594 23.457031 L 18.808594 20.210938 C
18.808594 20.001938 18.691719 19.806219 18.511719 19.699219 L 15.699219 18.074219 C 15.611719 18.023219 15.509125 17.998047 15.40625 17.998047 z M 19.792969 19.496094 C 19.505969
19.496094 19.253906 19.728156 19.253906 20.035156 C 19.253906 20.332156 19.495969 20.576172 19.792969 20.576172 C 20.089969 20.576172 20.332031 20.332156 20.332031 20.035156 C
20.332031 19.728156 20.084969 19.491094 19.792969 19.496094 z M 19.787109 19.582031 C 20.041109 19.582031 20.246094 19.782156 20.246094 20.035156 C 20.246094 20.283156 20.040109
20.488141 19.787109 20.494141 C 19.538109 20.494141 19.335938 20.288156 19.335938 20.035156 C 19.335938 19.782156 19.539109 19.582031 19.787109 19.582031 z M 19.589844 19.728516 L
19.589844 20.335938 L 19.705078 20.335938 L 19.705078 20.09375 L 19.8125 20.09375 C 19.8565 20.09375 19.866953 20.112484 19.876953 20.146484 C 19.876953 20.151484 19.895391
20.308891 19.900391 20.337891 L 20.025391 20.337891 C 20.011391 20.308891 20.001094 20.225781 19.996094 20.175781 C 19.982094 20.097781 19.977531 20.044062 19.894531 20.039062 C
19.938531 20.024063 20.011719 20.000672 20.011719 19.888672 C 20.011719 19.727672 19.871828 19.728516 19.798828 19.728516 L 19.589844 19.728516 z M 19.705078 19.826172 L 19.802734
19.826172 C 19.832734 19.826172 19.890625 19.825203 19.890625 19.908203 C 19.890625 19.942203 19.875875 19.997094 19.796875 19.996094 L 19.705078 19.996094 L 19.705078 19.826172 z
M 16.160156 20.322266 C 15.357156 20.322266 14.880859 20.664516 14.880859 21.228516 C 14.880859 21.846516 15.357953 22.011844 16.126953 22.089844 C 17.046953 22.181844 17.119141
22.314141 17.119141 22.494141 C 17.119141 22.810141 16.865484 22.941406 16.271484 22.941406 C 15.526484 22.941406 15.362594 22.756719 15.308594 22.386719 C 15.303594 22.347719
15.268609 22.318359 15.224609 22.318359 L 14.859375 22.318359 C 14.815375 22.318359 14.777344 22.353344 14.777344 22.402344 C 14.777344 22.874344 15.034625 23.439453 16.265625
23.439453 C 17.168625 23.438453 17.679688 23.088609 17.679688 22.474609 C 17.679688 21.866609 17.270297 21.704891 16.404297 21.587891 C 15.528297 21.470891 15.441406 21.412031
15.441406 21.207031 C 15.441406 21.037031 15.513156 20.814453 16.160156 20.814453 C 16.739156 20.814453 16.954969 20.941078 17.042969 21.330078 C 17.052969 21.369078 17.080141
21.392578 17.119141 21.392578 L 17.484375 21.392578 C 17.508375 21.392578 17.528969 21.383141 17.542969 21.369141 C 17.557969 21.350141 17.5675 21.330641 17.5625 21.306641 C
17.5045 20.634641 17.061156 20.322266 16.160156 20.322266 z`;

const NodeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    width="32"
    height="32"
    viewBox="0 0 32 32"
    className="w-10 h-10"
    aria-hidden="true"
  >
    <path fill="currentColor" d={NODE_JS_PATH} />
  </svg>
);

const CssIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    width="50"
    height="50"
    viewBox="0 0 50 50"
    className="w-10 h-10"
    aria-hidden="true"
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M 39 40 L 25 44 L 11 40 L 8 6 L 42 6 C 41 17.332031 40 28.667969 39 40 Z M 39.816406 8 L 10.183594 8 L 12.871094 38.453125 L 25 41.921875 L 37.128906 38.453125 Z M 16.800781 28 L 20.800781 28 L 20.898438 30.5 L 25 31.898438 L 29.101563 30.5 L 29.398438 26 L 20.601563 26 L 20.398438 22 L 29.601563 22 L 29.898438 18 L 16.101563 18 L 15.800781 14 L 34.101563 14 L 33.601563 22 L 32.898438 33.5 L 25 36.101563 L 17.101563 33.5 Z"
    />
  </svg>
);

const JavaIcon = ({ isDark }: { isDark: boolean }) => (
  <img
    width="50"
    height="50"
    src="https://img.icons8.com/ios-filled/50/java-coffee-cup-logo--v1.png"
    alt="Java"
    loading="lazy"
    decoding="async"
    className="h-10 w-10"
    style={{ filter: isDark ? "invert(1)" : "none" }}
  />
);

const Icons8MonoIcon = ({
  iconId,
  label,
  isDark,
}: {
  iconId: string;
  label: string;
  isDark: boolean;
}) => (
  <img
    width="50"
    height="50"
    src={`https://img.icons8.com/?size=50&id=${iconId}&format=png&color=${
      isDark ? "FFFFFF" : "000000"
    }`}
    alt={label}
    loading="lazy"
    decoding="async"
    className="h-10 w-10"
  />
);

const InvertingImgIcon = ({
  src,
  label,
  isDark,
}: {
  src: string;
  label: string;
  isDark: boolean;
}) => (
  <img
    width="50"
    height="50"
    src={src}
    alt={label}
    loading="lazy"
    decoding="async"
    className="h-10 w-10"
    style={{ filter: isDark ? "invert(1)" : "none" }}
  />
);

export default function NotesClient({
  initialNotes,
  outline,
  initialActiveNoteId,
  children,
}: NotesClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();

  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [query, setQuery] = useState("");
  const [notes] = useState<Note[]>(initialNotes);
  const [activeDomain, setActiveDomain] = useState<DomainId>("software");
  const [activeSection, setActiveSection] = useState<SectionId | "all">("all");
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(
    initialActiveNoteId ?? initialNotes[0]?.id ?? null
  );
  const [activeLevel, setActiveLevel] = useState<Level | "all">("all");
  const [sortBy] = useState<SortBy>("recent");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [sectionsOpen, setSectionsOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const lastDomainRef = useRef<DomainId | null>(null);

  useEffect(() => {
    if (!initialActiveNoteId) return;
    setActiveNoteId(initialActiveNoteId);
  }, [initialActiveNoteId]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const urlNoteId = searchParams.get("note");
    if (!activeNoteId) {
      if (urlNoteId) {
        const next = new URLSearchParams(searchParamsString);
        next.delete("note");
        router.replace(`?${next.toString()}`, { scroll: false });
      }
      return;
    }
    if (activeNoteId === urlNoteId) return;

    const next = new URLSearchParams(searchParamsString);
    next.set("note", activeNoteId);
    router.replace(`?${next.toString()}`, { scroll: false });
  }, [activeNoteId, router, searchParams, searchParamsString]);

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
    setActiveChapterId(null);
    setActiveTag(null);
    setActiveSection((prev) => {
      if (prev === "all") return "all";
      const existsInDomain = notes.some(
        (note) => note.domain === activeDomain && note.section === prev
      );
      return existsInDomain ? prev : "all";
    });
  }, [activeDomain, notes]);

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
  const hasNotes = filtered.length > 0;

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

  const isDark = theme === "dark";
  const bgClass = isDark
    ? "bg-slate-950 text-slate-100"
    : "bg-slate-50 text-slate-900";
  const inputClass = isDark
    ? "border-slate-800 bg-slate-900 text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:ring focus:ring-sky-500/20"
    : "border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:ring focus:ring-sky-500/20";

  const textPrimary = isDark ? "text-slate-50" : "text-slate-900";
  const textBody = isDark ? "text-slate-200" : "text-slate-700";
  const textMuted = isDark ? "text-slate-400" : "text-slate-500";
  const textSubtle = isDark ? "text-slate-500" : "text-slate-500";
  const hoverRow = isDark ? "hover:bg-slate-800" : "hover:bg-slate-100";
  const borderSoft = isDark ? "border-slate-800" : "border-slate-200";
  const borderDashedSoft = isDark ? "border-slate-600/80" : "border-slate-300";

  const headingSm = `${textPrimary} text-sm font-semibold tracking-[0.08em] uppercase`;
  const bodyBase = `${textBody} text-sm leading-[1.75]`;

  const chip =
    "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] transition duration-150 ease-out";
  const chipActive =
    "bg-sky-500 text-slate-950 shadow-sm shadow-sky-500/30 border-sky-500";
  const pillButton =
    "inline-flex items-center justify-center rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.15em] transition duration-150 ease-out gap-2";
  const focusRing =
    "focus:outline-none focus:ring-2 focus:ring-sky-400/60 focus:ring-offset-0";
  const cardGradient = isDark
    ? "bg-gradient-to-br from-white/[0.03] to-transparent"
    : "bg-gradient-to-br from-slate-50 to-white";

  const mdxVars = (isDark
    ? {
        "--note-heading-text": "rgb(248, 250, 252)",
        "--note-inline-code-bg": "rgba(2, 6, 23, 0.6)",
        "--note-inline-code-border": "rgba(30, 41, 59, 0.8)",
        "--note-inline-code-text": "rgb(241, 245, 249)",
        "--note-code-bg": "rgba(2, 6, 23, 0.6)",
        "--note-code-border": "rgba(30, 41, 59, 1)",
        "--note-code-text": "rgb(241, 245, 249)",
        "--note-blockquote-border": "rgba(56, 189, 248, 0.5)",
        "--note-blockquote-text": "rgb(226, 232, 240)",
        "--note-img-border": "rgba(30, 41, 59, 0.7)",
        "--note-hr": "rgba(30, 41, 59, 0.7)",
      }
    : {
        "--note-heading-text": "rgb(15, 23, 42)",
        "--note-inline-code-bg": "rgb(241, 245, 249)",
        "--note-inline-code-border": "rgb(226, 232, 240)",
        "--note-inline-code-text": "rgb(15, 23, 42)",
        "--note-code-bg": "rgb(248, 250, 252)",
        "--note-code-border": "rgb(226, 232, 240)",
        "--note-code-text": "rgb(15, 23, 42)",
        "--note-blockquote-border": "rgba(14, 165, 233, 0.45)",
        "--note-blockquote-text": "rgb(51, 65, 85)",
        "--note-img-border": "rgb(226, 232, 240)",
        "--note-hr": "rgb(226, 232, 240)",
      }) as CSSProperties;

  const surfaceElevated = isDark
    ? "bg-slate-900/80 border border-slate-800/70 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.8)]"
    : "bg-white border border-slate-200 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.15)]";

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
  const quoteAuthor =
    activeDomain === "trading" ? "Anonymous" : "Martin Fowler";

  const availableSections = useMemo(() => {
    const set = new Set<SectionId>();
    domainNotes.forEach((note) => set.add(note.section));
    return set;
  }, [domainNotes]);

  const availableTags = useMemo(() => {
    const set = new Set<string>();
    domainNotes.forEach((note) => note.tags.forEach((t) => set.add(t)));
    return set;
  }, [domainNotes]);

  type QuickIconItem =
    | { kind: "section"; id: SectionId; label: string; icon: ReactNode }
    | { kind: "tag"; tag: string; label: string; icon: ReactNode };

  const sectionQuickIcons = [
    {
      kind: "section",
      id: "java",
      label: "Java",
      icon: <JavaIcon isDark={isDark} />,
    },
    {
      kind: "section",
      id: "javascript",
      label: "JavaScript",
      icon: <JsIcon />,
    },
    {
      kind: "section",
      id: "typescript",
      label: "TypeScript",
      icon: <TsIcon />,
    },
    {
      kind: "section",
      id: "react",
      label: "React",
      icon: <Icons8MonoIcon iconId="122637" label="React" isDark={isDark} />,
    },
    { kind: "section", id: "node", label: "Node.js", icon: <NodeIcon /> },
    { kind: "section", id: "css", label: "CSS", icon: <CssIcon /> },
    {
      kind: "section",
      id: "algorithms",
      label: "Data Structures & Algorithms",
      icon: (
        <Icons8MonoIcon
          iconId="HZB8wT2XgRNp"
          label="Data Structures & Algorithms"
          isDark={isDark}
        />
      ),
    },
    {
      kind: "tag",
      tag: "design-patterns",
      label: "Design Patterns",
      icon: (
        <InvertingImgIcon
          src="https://img.icons8.com/wired/64/design.png"
          label="Design Patterns"
          isDark={isDark}
        />
      ),
    },
    {
      kind: "tag",
      tag: "nextjs",
      label: "Next.js",
      icon: (
        <Icons8MonoIcon iconId="MWiBjkuHeMVq" label="Next.js" isDark={isDark} />
      ),
    },
    {
      kind: "tag",
      tag: "docker",
      label: "Docker",
      icon: (
        <Icons8MonoIcon iconId="xwH6LOQ7Ckfn" label="Docker" isDark={isDark} />
      ),
    },
    {
      kind: "tag",
      tag: "git",
      label: "Git",
      icon: <Icons8MonoIcon iconId="38388" label="Git" isDark={isDark} />,
    },
  ] satisfies ReadonlyArray<QuickIconItem>;

  const sortForPicker = (list: Note[]) =>
    [...list].sort((a, b) => {
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

  const onQuickIconClick = (item: QuickIconItem) => {
    setQuery("");
    setActiveChapterId(null);
    setActiveLevel("all");

    const next =
      item.kind === "section"
        ? sortForPicker(
            domainNotes.filter((note) => note.section === item.id)
          )[0]
        : sortForPicker(
            domainNotes.filter((note) => note.tags.includes(item.tag))
          )[0];

    if (item.kind === "section") {
      setActiveTag(null);
      setActiveSection(item.id);
    } else {
      setActiveSection("all");
      setActiveTag(item.tag);
    }

    setActiveNoteId(next?.id ?? null);
  };

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

  const sidebarGroups = useMemo(() => {
    const availableIds = new Set(filtered.map((note) => note.id));
    return outline
      .filter((g) => g.domain === activeDomain)
      .map((g) => ({
        id: g.id,
        label: g.label,
        items: g.items.filter((it) => availableIds.has(it.id)),
      }))
      .filter((g) => g.items.length > 0);
  }, [outline, activeDomain, filtered]);

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
          <div className="flex items-center justify-between gap-4 py-4">
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

            <div
              className={[
                "w-full max-w-7xl pb-1",
                "overflow-x-auto sm:overflow-visible",
                "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
              ].join(" ")}
            >
              <div className="flex w-max flex-nowrap items-center gap-6 sm:gap-7 sm:w-full sm:flex-wrap">
                {sectionQuickIcons.map((item) => {
                  const key =
                    item.kind === "section"
                      ? `section:${item.id}`
                      : `tag:${item.tag}`;
                  const isAvailable =
                    item.kind === "section"
                      ? availableSections.has(item.id)
                      : availableTags.has(item.tag);
                  const isActive =
                    item.kind === "section"
                      ? activeSection === item.id
                      : activeTag === item.tag;
                  const base = [
                    "group relative inline-flex items-center justify-center transition duration-150 ease-out",
                    isDark ? "text-white" : "text-black",
                    "cursor-pointer",
                    "hover:opacity-90",
                    focusRing,
                  ];
                  const stateClass = isActive ? "opacity-100" : "opacity-80";
                  const availabilityClass = isAvailable ? "" : "opacity-50";

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        onQuickIconClick(item);
                      }}
                      className={[...base, stateClass, availabilityClass].join(
                        " "
                      )}
                      aria-label={item.label}
                    >
                      {item.icon}
                      <span className="sr-only">{item.label}</span>
                      <span
                        role="tooltip"
                        className={[
                          "hidden sm:block",
                          "pointer-events-none absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md border px-2 py-1 text-[11px] font-semibold shadow-sm transition duration-150 ease-out",
                          "translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100",
                          isDark
                            ? "border-slate-800 bg-slate-950/95 text-slate-100"
                            : "border-slate-200 bg-white text-slate-900",
                        ].join(" ")}
                      >
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* search moved to top-right beside theme toggle */}
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 px-6 py-10 lg:grid-cols-[300px_minmax(0,1fr)]">
        {/* Left tree */}
        <aside
          className={[
            "hidden lg:block",
            hasNotes ? "" : "invisible pointer-events-none",
          ].join(" ")}
        >
          <div
            className={[
              "sticky top-[120px] space-y-4 rounded-2xl p-4 shadow-lg",
              surfaceElevated,
              cardGradient,
            ].join(" ")}
          >
            <h3 className={`${headingSm} ${textSubtle}`}>Sections</h3>
            <div className="space-y-4 text-sm">
              {sidebarGroups.map((group) => {
                return (
                  <div key={group.id} className="space-y-2">
                    <button
                      onClick={() => {
                        setQuery("");
                        setActiveTag(null);
                        setActiveLevel("all");
                        setActiveSection("all");
                        setActiveChapterId(group.id);
                        const first = filtered.find((n) => n.chapterId === group.id);
                        setActiveNoteId(first?.id ?? null);
                      }}
                      className={[
                        "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-sky-500/60",
                        activeChapterId === group.id
                          ? "bg-sky-500/15 text-sky-100 ring-1 ring-sky-500/40 shadow-sm shadow-sky-500/20 border border-sky-500/40"
                          : `${textBody} ${hoverRow}`,
                      ].join(" ")}
                    >
                      <span className="font-semibold">{group.label}</span>
                    </button>
                    <div
                      className={`space-y-1.5 border-l border-dashed pl-3 text-xs ${borderDashedSoft} ${textMuted}`}
                    >
                      {group.items.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            setQuery("");
                            setActiveTag(null);
                            setActiveLevel("all");
                            setActiveSection("all");
                            setActiveChapterId(group.id);
                            setActiveNoteId(item.id);
                          }}
                          className={[
                            "flex w-full items-center justify-between rounded-md px-2.5 py-1.5 transition duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-sky-500/60",
                            activeNoteId === item.id
                              ? "bg-sky-500/15 text-sky-100 ring-1 ring-sky-500/30 border border-sky-500/30 shadow-sky-500/15"
                              : hoverRow,
                          ].join(" ")}
                        >
                          <span className="truncate">{item.label}</span>
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
          </div>
          {activeNote ? (
            <article
              className={[
                "mx-auto max-w-[920px] rounded-2xl border p-7 shadow-xl",
                surfaceElevated,
                cardGradient,
              ].join(" ")}
              style={mdxVars}
	            >
	              <div className={`${bodyBase} text-[15px]`}>{children}</div>
	            </article>
	          ) : (
            <div
              className={`mx-auto max-w-[920px] rounded-xl border border-dashed p-8 text-center ${borderSoft} ${textMuted}`}
            >
              Notes coming soon.
            </div>
          )}
        </section>

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
              {sidebarGroups.map((group) => {
                return (
                  <div key={group.id} className="space-y-2">
                    <button
                      type="button"
                      onClick={() => {
                        setQuery("");
                        setActiveTag(null);
                        setActiveLevel("all");
                        setActiveSection("all");
                        setActiveChapterId(group.id);
                        const first = filtered.find((n) => n.chapterId === group.id);
                        setActiveNoteId(first?.id ?? null);
                        setSectionsOpen(false);
                      }}
                      className={[
                        "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium transition duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-sky-500/60",
                        activeChapterId === group.id
                          ? "bg-sky-500/20 text-sky-100 ring-1 ring-sky-500/40 border border-sky-500/40 shadow-sm shadow-sky-500/25"
                          : `${hoverRow} ${textBody}`,
                      ].join(" ")}
                    >
                      <span>{group.label}</span>
                    </button>
                    {group.items.length > 0 && (
                      <div
                        className={`space-y-1 border-l border-dashed pl-3 text-xs ${borderDashedSoft} ${textMuted}`}
                      >
                        {group.items.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              setQuery("");
                              setActiveTag(null);
                              setActiveLevel("all");
                              setActiveSection("all");
                              setActiveChapterId(group.id);
                              setActiveNoteId(item.id);
                              setSectionsOpen(false);
                            }}
                            className={[
                              "flex w-full items-center justify-between rounded-md px-2 py-1 text-left transition duration-150 ease-out",
                              activeNoteId === item.id
                                ? "bg-sky-500/20 text-sky-100 ring-1 ring-sky-500/30 border border-sky-500/30 shadow-sky-500/20"
                                : hoverRow,
                              focusRing,
                            ].join(" ")}
                          >
                            <span className="truncate">{item.label}</span>
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
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
              <path d="M12 4l-6 6h4v6h4v-6h4z" fill="currentColor" />
            </svg>
          </span>
          <span className="text-xs font-semibold tracking-[0.18em] uppercase">
            Top
          </span>
        </button>
      )}

      {/* <footer
        className={`mx-auto flex w-full max-w-7xl items-center justify-between border-t px-6 py-4 text-xs ${borderSoft} ${textMuted}`}
      >
        <span>Notes area • UI prototype only</span>
        <span>
          Total visitors (placeholder):{" "}
          <span className={textPrimary}>1,234</span>
        </span>
      </footer> */}
    </div>
  );
}
