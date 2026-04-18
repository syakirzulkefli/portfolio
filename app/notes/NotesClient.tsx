"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import AdminNoteDrawer, { type AdminNoteRecord } from "./AdminNoteDrawer";
import NoteContent from "./NoteContent";
import TrashDrawer from "./TrashDrawer";
import { requiresNotesOwnerAccess } from "./access";
import {
  firstSectionForDomain,
  DomainId,
  isSectionInDomain,
  Level,
  Note,
  NoteNode,
  SectionId,
  SortBy,
  domains,
  sectionLabelForId,
  sections,
} from "./data";

type NotesClientProps = {
  initialNotes: Note[];
  initialNodes: NoteNode[];
  initialDomain?: DomainId;
  initialSection?: SectionId;
  initialActiveNoteId?: string | null;
  initialIsAuthenticated?: boolean;
  initialIsAdmin?: boolean;
  initialDataNotice?: string | null;
  initialAuthAvailable?: boolean;
  children?: ReactNode;
};

const normalizeForSearch = (input: string) =>
  input
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const noteSearchHaystack = (note: Note) =>
  normalizeForSearch(
    [
      note.id,
      note.title,
      note.summary,
      note.chapterTitle ?? "",
      note.section,
      note.tags.join(" "),
    ].join(" ")
  );

const noteMatchesQuery = (note: Note, normalizedTerms: string[]) => {
  if (normalizedTerms.length === 0) return true;
  const haystack = noteSearchHaystack(note);
  return normalizedTerms.every((term) => haystack.includes(term));
};

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const stripSectionPrefixFromTitle = (title: string, section: SectionId) => {
  const sectionLabel = sectionLabelForId(section);
  const sectionPrefix = new RegExp(`^${escapeRegExp(sectionLabel)}\\s*:\\s*`, "i");
  const stripped = title.replace(sectionPrefix, "").trim();
  return stripped || title;
};

const highlightSnippetParts = (text: string, terms: string[]) => {
  if (!terms.length) return [text];
  const escaped = terms.map(escapeRegExp).join("|");
  if (!escaped) return [text];
  const regex = new RegExp(`(${escaped})`, "gi");
  const lowerTerms = terms.map((t) => t.toLowerCase());
  return text.split(regex).filter(Boolean).map((part, idx) => {
    const isMatch = lowerTerms.includes(part.toLowerCase());
    return isMatch ? (
      <mark
        key={`${part}-${idx}`}
        className="bg-amber-200/80 text-slate-900"
      >
        {part}
      </mark>
    ) : (
      <span key={`${part}-${idx}`}>{part}</span>
    );
  });
};

const domainRank: Record<DomainId, number> = {
  software: 0,
  trading: 1,
  motivation: 2,
};

const toSortRank = (value: number | undefined) => {
  if (!Number.isFinite(value)) return Number.MAX_SAFE_INTEGER;
  const normalized = Math.trunc(value as number);
  return normalized > 0 ? normalized : Number.MAX_SAFE_INTEGER;
};

type TreeNode = NoteNode & { children: TreeNode[] };

const compareTreeNodes = (a: NoteNode, b: NoteNode) => {
  const aOrder = toSortRank(a.sortOrder);
  const bOrder = toSortRank(b.sortOrder);
  if (aOrder !== bOrder) return aOrder - bOrder;
  if (a.kind !== b.kind) return a.kind === "folder" ? -1 : 1;
  return a.title.localeCompare(b.title);
};

const buildTreeForSection = (
  nodes: NoteNode[],
  domain: DomainId,
  section: SectionId
) => {
  const scoped = nodes.filter(
    (node) => node.domain === domain && node.section === section
  );
  const nodeById = new Map(scoped.map((node) => [node.id, node]));
  const childrenByParentId = new Map<string | null, NoteNode[]>();

  for (const node of scoped) {
    const parentId =
      node.parentId && nodeById.has(node.parentId) ? node.parentId : null;
    const siblings = childrenByParentId.get(parentId) ?? [];
    siblings.push({ ...node, parentId });
    childrenByParentId.set(parentId, siblings);
  }

  for (const siblings of childrenByParentId.values()) {
    siblings.sort(compareTreeNodes);
  }

  const build = (parentId: string | null): TreeNode[] =>
    (childrenByParentId.get(parentId) ?? []).map((node) => ({
      ...node,
      children: build(node.id),
    }));

  const ancestorIdsForNode = (nodeId: string) => {
    const ids: string[] = [];
    let cursor = nodeById.get(nodeId) ?? null;
    let safety = 0;
    while (cursor?.parentId && safety < 100) {
      ids.unshift(cursor.parentId);
      cursor = nodeById.get(cursor.parentId) ?? null;
      safety += 1;
    }
    return ids;
  };

  return {
    roots: build(null),
    nodeById,
    childrenByParentId,
    ancestorIdsForNode,
    scoped,
  };
};

const compareNotesForList = (a: Note, b: Note) => {
  const domainDiff = domainRank[a.domain] - domainRank[b.domain];
  if (domainDiff !== 0) return domainDiff;

  const chapterDiff = (a.chapterTitle ?? "").localeCompare(b.chapterTitle ?? "");
  if (chapterDiff !== 0) return chapterDiff;

  const aOrder = toSortRank(a.sortOrder);
  const bOrder = toSortRank(b.sortOrder);
  if (aOrder !== bOrder) return aOrder - bOrder;

  return a.title.localeCompare(b.title);
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

const IconImage = ({
  src,
  alt,
  invert,
}: {
  src: string;
  alt: string;
  invert?: boolean;
}) => (
  <Image
    width={50}
    height={50}
    src={src}
    alt={alt}
    unoptimized
    sizes="50px"
    className="h-10 w-10"
    style={invert ? { filter: "invert(1)" } : undefined}
  />
);

const JavaIcon = ({ isDark }: { isDark: boolean }) => (
  <IconImage
    src="https://img.icons8.com/ios-filled/50/java-coffee-cup-logo--v1.png"
    alt="Java"
    invert={isDark}
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
  <IconImage
    src={`https://img.icons8.com/?size=50&id=${iconId}&format=png&color=${
      isDark ? "FFFFFF" : "000000"
    }`}
    alt={label}
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
  <IconImage src={src} alt={label} invert={isDark} />
);

const FundamentalIcon = () => (
  <svg viewBox="0 0 40 40" aria-hidden="true" className="w-10 h-10">
    <rect
      x="6"
      y="7"
      width="28"
      height="26"
      rx="5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M12 24h4M20 24h8M12 19h8M23 19h5M12 14h16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const TechnicalIcon = () => (
  <svg viewBox="0 0 40 40" aria-hidden="true" className="w-10 h-10">
    <path
      d="M7 29h26M12 24v-8M20 27v-13M28 22v-9"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <rect x="10" y="19" width="4" height="5" rx="1" fill="currentColor" />
    <rect x="18" y="16" width="4" height="8" rx="1" fill="currentColor" />
    <rect x="26" y="18" width="4" height="4" rx="1" fill="currentColor" />
  </svg>
);

const PastWinnerIcon = () => (
  <svg viewBox="0 0 40 40" aria-hidden="true" className="w-10 h-10">
    <path
      d="M14 11h12v4a6 6 0 01-12 0v-4Zm-3 1h3v2a4 4 0 01-3 4v-6Zm18 0h3v6a4 4 0 01-3-4v-2Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20 21v4M16 29h8"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="20" cy="31" r="2" fill="currentColor" />
  </svg>
);

const CurrentCounterIcon = () => (
  <svg viewBox="0 0 40 40" aria-hidden="true" className="w-10 h-10">
    <path
      d="M8 28h24M11 25l6-6 5 3 7-8"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M26 14h4v4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="11" cy="25" r="1.8" fill="currentColor" />
    <circle cx="17" cy="19" r="1.8" fill="currentColor" />
    <circle cx="22" cy="22" r="1.8" fill="currentColor" />
  </svg>
);

const FcpoIcon = () => (
  <svg viewBox="0 0 40 40" aria-hidden="true" className="w-10 h-10">
    <circle
      cx="20"
      cy="21"
      r="11"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M18 27c3-2 5-6 5-11-4 1-8 5-9 9 1 1 2 2 4 2Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="27" cy="14" r="2" fill="currentColor" />
  </svg>
);

const MindsetIcon = () => (
  <svg viewBox="0 0 40 40" aria-hidden="true" className="w-10 h-10">
    <circle cx="20" cy="20" r="11" fill="none" stroke="currentColor" strokeWidth="2" />
    <path
      d="M16 20h8M20 16v8M13 27l2.5-2.5M27 13l-2.5 2.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const DisciplineIcon = () => (
  <svg viewBox="0 0 40 40" aria-hidden="true" className="w-10 h-10">
    <rect
      x="10"
      y="8"
      width="20"
      height="24"
      rx="3"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M14 16l4 4 8-8M14 25h12"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const HabitIcon = () => (
  <svg viewBox="0 0 40 40" aria-hidden="true" className="w-10 h-10">
    <rect
      x="9"
      y="11"
      width="22"
      height="20"
      rx="4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M9 17h22M15 8v6M25 8v6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="16" cy="23" r="1.5" fill="currentColor" />
    <circle cx="21" cy="23" r="1.5" fill="currentColor" />
    <circle cx="26" cy="23" r="1.5" fill="currentColor" />
  </svg>
);

const FocusIcon = () => (
  <svg viewBox="0 0 40 40" aria-hidden="true" className="w-10 h-10">
    <circle cx="20" cy="20" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
    <circle cx="20" cy="20" r="5" fill="none" stroke="currentColor" strokeWidth="2" />
    <circle cx="20" cy="20" r="1.8" fill="currentColor" />
  </svg>
);

const GrowthIcon = () => (
  <svg viewBox="0 0 40 40" aria-hidden="true" className="w-10 h-10">
    <path
      d="M9 29h22M12 25l5-5 4 3 7-8M26 15h5v5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const GitHubLogo = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
    <path
      fill="currentColor"
      d="M12 .5A11.5 11.5 0 0 0 .5 12.14c0 5.17 3.29 9.55 7.86 11.1.57.1.78-.25.78-.56v-2.16c-3.2.71-3.88-1.4-3.88-1.4-.52-1.36-1.29-1.72-1.29-1.72-1.05-.73.08-.71.08-.71 1.16.09 1.77 1.22 1.77 1.22 1.04 1.82 2.73 1.3 3.39.99.1-.78.4-1.3.73-1.6-2.56-.3-5.25-1.3-5.25-5.83 0-1.3.46-2.36 1.2-3.2-.12-.31-.52-1.56.11-3.24 0 0 .98-.32 3.2 1.22a10.96 10.96 0 0 1 5.84 0c2.22-1.54 3.2-1.22 3.2-1.22.63 1.68.23 2.93.11 3.24.75.84 1.2 1.9 1.2 3.2 0 4.54-2.7 5.52-5.26 5.82.41.37.79 1.09.79 2.2v3.27c0 .31.2.67.79.56a11.63 11.63 0 0 0 7.85-11.1A11.5 11.5 0 0 0 12 .5Z"
    />
  </svg>
);

const GoogleLogo = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
    <path
      fill="#EA4335"
      d="M12 10.2v3.9h5.5a4.7 4.7 0 0 1-2 3.1l3.2 2.5c1.9-1.8 3-4.4 3-7.5 0-.7-.1-1.3-.2-2H12z"
    />
    <path
      fill="#34A853"
      d="M12 22c2.7 0 4.9-.9 6.5-2.4l-3.2-2.5c-.9.6-2 .9-3.3.9-2.5 0-4.6-1.7-5.3-4H3.4v2.6A10 10 0 0 0 12 22z"
    />
    <path
      fill="#4A90E2"
      d="M6.7 14c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V7.4H3.4A10 10 0 0 0 2 12c0 1.6.4 3.1 1.4 4.6L6.7 14z"
    />
    <path
      fill="#FBBC05"
      d="M12 5.9c1.5 0 2.8.5 3.9 1.5l2.9-2.9C16.8 2.7 14.6 2 12 2a10 10 0 0 0-8.6 5.4L6.7 10c.7-2.4 2.8-4.1 5.3-4.1z"
    />
  </svg>
);

export default function NotesClient({
  initialNotes,
  initialNodes,
  initialDomain = "software",
  initialSection = firstSectionForDomain(initialDomain),
  initialActiveNoteId,
  initialIsAuthenticated = false,
  initialIsAdmin = false,
  initialDataNotice = null,
  initialAuthAvailable = true,
  children,
}: NotesClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();

  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [query, setQuery] = useState("");
  const [contentMatchQuery, setContentMatchQuery] = useState("");
  const [contentMatchIds, setContentMatchIds] = useState<Set<string> | null>(
    null
  );
  const [contentSnippets, setContentSnippets] = useState<
    Record<string, string[]>
  >({});
  const [isSearchingContent, setIsSearchingContent] = useState(false);
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [nodes, setNodes] = useState<NoteNode[]>(initialNodes);
  const [activeDomain, setActiveDomain] = useState<DomainId>(initialDomain);
  const [activeSection, setActiveSection] = useState<SectionId>(initialSection);
  const [selectedTreeNodeId, setSelectedTreeNodeId] = useState<string | null>(
    initialActiveNoteId ?? null
  );
  const [activeNoteId, setActiveNoteId] = useState<string | null>(
    initialActiveNoteId ?? initialNotes[0]?.id ?? null
  );
  const [activeLevel, setActiveLevel] = useState<Level | "all">("all");
  const [sortBy] = useState<SortBy>("recent");
  const [sectionsOpen, setSectionsOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [adminDrawerOpen, setAdminDrawerOpen] = useState(false);
  const [adminDrawerMode, setAdminDrawerMode] = useState<"new" | "edit">("edit");
  const [adminDrawerNoteId, setAdminDrawerNoteId] = useState<string | null>(null);
  const [adminDrawerSessionKey, setAdminDrawerSessionKey] = useState(0);
  const [trashDrawerOpen, setTrashDrawerOpen] = useState(false);
  const [adminActionError, setAdminActionError] = useState<string | null>(null);
  const [adminActionMessage, setAdminActionMessage] = useState<string | null>(null);
  const [adminDeletePending, setAdminDeletePending] = useState(false);
  const [liveMarkdownById, setLiveMarkdownById] = useState<Record<string, string>>(
    {}
  );
  const searchRef = useRef<HTMLInputElement | null>(null);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);
  const sectionsSheetTouchStartYRef = useRef<number | null>(null);
  const sectionsSheetTouchDeltaYRef = useRef(0);
  const lastDomainRef = useRef<DomainId | null>(null);
  const [isResultsOpen, setIsResultsOpen] = useState(false);

  const clearFilters = () => {
    setQuery("");
    setActiveLevel("all");
  };

  const closeSectionsSheet = () => {
    setSectionsOpen(false);
    sectionsSheetTouchStartYRef.current = null;
    sectionsSheetTouchDeltaYRef.current = 0;
  };

  useEffect(() => {
    const normalizedQuery = normalizeForSearch(query);
    if (!normalizedQuery) {
      setContentMatchQuery("");
      setContentMatchIds(null);
      setContentSnippets({});
      setIsSearchingContent(false);
      setIsResultsOpen(false);
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setIsSearchingContent(true);
      try {
        const url = new URL("/api/notes/search", window.location.origin);
        url.searchParams.set("q", query);
        url.searchParams.set("domain", activeDomain);
        const res = await fetch(url.toString(), { signal: controller.signal });
        if (!res.ok) throw new Error(`Search failed: ${res.status}`);
        const data = (await res.json()) as {
          results?: {
            id?: unknown;
            snippets?: unknown;
            matchesCount?: unknown;
          }[];
        };
        const ids =
          data.results
            ?.map((r) => r?.id)
            .filter((v): v is string => typeof v === "string") ?? [];
        const snippets: Record<string, string[]> = {};
        data.results?.forEach((r) => {
          if (typeof r?.id === "string" && Array.isArray(r?.snippets)) {
            snippets[r.id] = r.snippets
              .filter((s): s is string => typeof s === "string")
              .slice(0, 5);
          }
        });
        setContentSnippets(snippets);
        setContentMatchQuery(normalizedQuery);
        setContentMatchIds(new Set(ids));
        setIsResultsOpen(true);
      } catch (err) {
        if ((err as { name?: string } | null)?.name !== "AbortError") {
          setContentMatchQuery(normalizedQuery);
          setContentMatchIds(new Set());
          setContentSnippets({});
        }
      } finally {
        setIsSearchingContent(false);
      }
    }, 175);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [query, activeDomain]);

  useEffect(() => {
    if (!initialActiveNoteId) return;
    setActiveNoteId(initialActiveNoteId);
    setSelectedTreeNodeId(initialActiveNoteId);
  }, [initialActiveNoteId]);

  useEffect(() => {
    setNotes(initialNotes);
    setNodes(initialNodes);
  }, [initialNotes, initialNodes]);

  useEffect(() => {
    setActiveDomain(initialDomain);
    setActiveSection(initialSection);
  }, [initialDomain, initialSection]);

  useEffect(() => {
    const next = new URLSearchParams(searchParamsString);
    let changed = false;
    const activeNoteInCurrentSection =
      !!activeNoteId &&
      notes.some(
        (note) =>
          note.id === activeNoteId &&
          note.domain === activeDomain &&
          note.section === activeSection
      );

    if (next.get("domain") !== activeDomain) {
      next.set("domain", activeDomain);
      changed = true;
    }

    if (next.get("section") !== activeSection) {
      next.set("section", activeSection);
      changed = true;
    }

    if (activeNoteInCurrentSection && activeNoteId) {
      if (next.get("note") !== activeNoteId) {
        next.set("note", activeNoteId);
        changed = true;
      }
    } else if (next.has("note")) {
      next.delete("note");
      changed = true;
    }

    if (!changed) return;
    router.replace(`?${next.toString()}`, { scroll: false });
  }, [activeDomain, activeNoteId, activeSection, notes, router, searchParamsString]);

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
    setActiveSection((prev) => {
      const valid = isSectionInDomain(activeDomain, prev);
      return valid ? prev : firstSectionForDomain(activeDomain);
    });
  }, [activeDomain]);

  useEffect(() => {
    setSelectedTreeNodeId((prev) => {
      if (!prev) return null;
      const stillVisible = nodes.some(
        (node) =>
          node.id === prev &&
          node.domain === activeDomain &&
          node.section === activeSection
      );
      return stillVisible ? prev : null;
    });
  }, [activeDomain, activeSection, nodes]);

  const domainNotes = useMemo(
    () => notes.filter((note) => note.domain === activeDomain),
    [notes, activeDomain]
  );
  const domainNodes = useMemo(
    () => nodes.filter((node) => node.domain === activeDomain),
    [nodes, activeDomain]
  );
  const sectionNotes = useMemo(
    () => domainNotes.filter((note) => note.section === activeSection),
    [domainNotes, activeSection]
  );
  const sectionNodes = useMemo(
    () => domainNodes.filter((node) => node.section === activeSection),
    [domainNodes, activeSection]
  );
  const isNoteLocked = (noteId: string) => {
    if (initialIsAdmin) return false;
    const note = notes.find((item) => item.id === noteId);
    return note ? requiresNotesOwnerAccess(note.domain) : false;
  };

  const filtered = useMemo(() => {
    const normalizedQuery = normalizeForSearch(query);
    const terms = normalizedQuery.split(" ").filter(Boolean);
    const contentMatchesReady =
      !!normalizedQuery && contentMatchQuery === normalizedQuery;
    return [...domainNotes]
      .filter((note) => {
        if (note.section !== activeSection) return false;
        if (activeLevel !== "all" && note.level !== activeLevel) return false;
        const metaMatch = noteMatchesQuery(note, terms);
        if (!terms.length) return true;
        if (metaMatch) return true;
        if (!contentMatchesReady) return false;
        return contentMatchIds?.has(note.id) ?? false;
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
    activeLevel,
    query,
    sortBy,
    contentMatchQuery,
    contentMatchIds,
  ]);

  const filtersActive =
    normalizeForSearch(query).length > 0 ||
    activeLevel !== "all";

  const queryNormalized = normalizeForSearch(query);
  const contentSearchPending =
    !!queryNormalized && contentMatchQuery !== queryNormalized;
  const searchTerms = useMemo(
    () => queryNormalized.split(" ").filter(Boolean),
    [queryNormalized]
  );

  const searchResults = useMemo(() => {
    if (!queryNormalized) return [];
    const contentMatchesReady = contentMatchQuery === queryNormalized;
    return [...domainNotes]
      .filter((note) => {
        if (activeLevel !== "all" && note.level !== activeLevel) return false;
        if (noteMatchesQuery(note, searchTerms)) return true;
        if (!contentMatchesReady) return false;
        return contentMatchIds?.has(note.id) ?? false;
      })
      .sort(compareNotesForList)
      .map((note) => ({
        note,
        snippets: contentSnippets[note.id] || [note.summary],
      }));
  }, [
    activeLevel,
    contentMatchIds,
    contentMatchQuery,
    contentSnippets,
    domainNotes,
    queryNormalized,
    searchTerms,
  ]);

  const tree = useMemo(
    () => buildTreeForSection(nodes, activeDomain, activeSection),
    [nodes, activeDomain, activeSection]
  );

  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});

  const handleResultClick = (note: Note) => {
    setActiveLevel("all");
    setActiveSection(note.section);
    setSelectedTreeNodeId(note.id);
    setActiveNoteId(note.id);
    setSectionsOpen(false);
    setIsResultsOpen(false);
    const main = document.getElementById("notes-main");
    main?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const targetId = selectedTreeNodeId ?? activeNoteId;
    if (!targetId) return;
    const ancestors = tree.ancestorIdsForNode(targetId);
    if (!ancestors.length) return;
    setExpandedFolders((prev) => {
      const next = { ...prev };
      let changed = false;
      for (const id of ancestors) {
        if (!next[id]) {
          next[id] = true;
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [activeNoteId, selectedTreeNodeId, tree]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const domainChanged = lastDomainRef.current !== activeDomain;
    lastDomainRef.current = activeDomain;

    const selectedNode =
      selectedTreeNodeId ? tree.nodeById.get(selectedTreeNodeId) ?? null : null;
    if (selectedNode?.kind === "folder" && !domainChanged) {
      setActiveNoteId(null);
      return;
    }

    const hasActiveInSection =
      !!activeNoteId && sectionNotes.some((note) => note.id === activeNoteId);
    const stored = window.localStorage.getItem(
      `notes-last-note-${activeDomain}`
    );
    const storedValid =
      !!stored && sectionNotes.some((note) => note.id === stored);

    const selectionPool = queryNormalized ? sectionNotes : filtered;

    if ((domainChanged || !hasActiveInSection) && storedValid) {
      setActiveNoteId(stored);
      setSelectedTreeNodeId(stored);
      return;
    }
    if (domainChanged || !hasActiveInSection) {
      if (selectionPool[0]?.id) {
        setActiveNoteId(selectionPool[0].id);
        setSelectedTreeNodeId(selectionPool[0].id);
      } else {
        setActiveNoteId(null);
        setSelectedTreeNodeId(null);
      }
    }
  }, [activeDomain, sectionNotes, filtered, activeNoteId, queryNormalized, selectedTreeNodeId, tree]);

  const activeNote =
    filtered.find((note) => note.id === activeNoteId) || filtered[0] || null;
  const activeNoteLocked = !!activeNote && isNoteLocked(activeNote.id);
  const isDomainLocked = requiresNotesOwnerAccess(activeDomain) && !initialIsAdmin;
  const hasAnyNotes = sectionNotes.length > 0;
  const showSidebar = sectionNodes.length > 0 && !isDomainLocked;
  const loginNextParams = new URLSearchParams();
  loginNextParams.set("domain", activeDomain);
  if (activeNote?.id) loginNextParams.set("note", activeNote.id);
  const loginNext = `/notes?${loginNextParams.toString()}`;
  const loginHrefFor = (nextPath: string) => {
    const params = new URLSearchParams({ next: nextPath });
    if (!initialAuthAvailable) {
      params.set("error", "provider_unavailable");
    }
    return `/login?${params.toString()}`;
  };
  const loginHref = loginHrefFor(loginNext);
  const ownerLoginHref = loginHrefFor(loginNext);

  const handleSignOut = async () => {
    await fetch("/api/auth/signout", { method: "POST" });
    window.location.href = `/notes?domain=${encodeURIComponent(activeDomain)}`;
  };

  const openAdminNew = () => {
    if (!initialIsAdmin) return;
    setAdminActionError(null);
    setAdminActionMessage(null);
    setAdminDrawerSessionKey((prev) => prev + 1);
    setAdminDrawerMode("new");
    setAdminDrawerNoteId(null);
    setAdminDrawerOpen(true);
  };

  const openAdminEdit = (noteId: string) => {
    if (!initialIsAdmin) return;
    setAdminActionError(null);
    setAdminActionMessage(null);
    setAdminDrawerSessionKey((prev) => prev + 1);
    setAdminDrawerMode("edit");
    setAdminDrawerNoteId(noteId);
    setAdminDrawerOpen(true);
  };

  const adminRecordToNode = (item: AdminNoteRecord): NoteNode => ({
    id: item.id,
    kind: item.kind,
    domain: item.domain,
    title: item.title,
    section: item.section,
    parentId: item.parent_id ?? null,
    chapterId: item.parent_id ?? null,
    chapterTitle: item.parent_id
      ? nodes.find((node) => node.id === item.parent_id)?.title ?? null
      : null,
    level: item.level,
    summary: item.summary,
    tags: Array.isArray(item.tags) ? item.tags : [],
    updatedAt: item.updated_at
      ? new Date(item.updated_at).toISOString()
      : new Date().toISOString(),
    pinned: item.pinned,
    sortOrder: item.sort_order,
    isPublished: item.is_published,
  });

  const applyAdminRecord = (item: AdminNoteRecord) => {
    const normalizedNode = adminRecordToNode(item);

    setNodes((prev) => {
      const next = [...prev];
      const idx = next.findIndex((node) => node.id === normalizedNode.id);
      if (idx >= 0) {
        next[idx] = { ...next[idx], ...normalizedNode };
      } else {
        next.push(normalizedNode);
      }
      next.sort(compareTreeNodes);
      return next;
    });

    if (item.kind === "note") {
      const normalizedNote = normalizedNode as Note;
      setNotes((prev) => {
        const next = [...prev];
        const idx = next.findIndex((existing) => existing.id === normalizedNote.id);
        if (idx >= 0) {
          next[idx] = { ...next[idx], ...normalizedNote };
        } else {
          next.push(normalizedNote);
        }
        next.sort(compareNotesForList);
        return next;
      });
      setLiveMarkdownById((prev) => ({ ...prev, [item.id]: item.content ?? "" }));
    }
  };

  const handleAdminSaved = (note: AdminNoteRecord) => {
    setAdminDrawerOpen(false);
    setAdminActionError(null);
    setAdminActionMessage("Saved.");
    applyAdminRecord(note);

    setQuery("");
    setActiveLevel("all");
    setActiveDomain(note.domain);
    setActiveSection(note.section);
    setSelectedTreeNodeId(note.id);
    if (note.kind === "folder") {
      setExpandedFolders((prev) => ({ ...prev, [note.id]: true }));
    } else {
      setActiveNoteId(note.id);
    }
    router.refresh();
  };

  const handleAdminPersisted = (note: AdminNoteRecord) => {
    applyAdminRecord(note);
    setQuery("");
    setActiveLevel("all");
    setActiveDomain(note.domain);
    setActiveSection(note.section);
    setSelectedTreeNodeId(note.id);
    if (note.kind === "folder") {
      setExpandedFolders((prev) => ({ ...prev, [note.id]: true }));
    } else {
      setActiveNoteId(note.id);
    }
  };

  const handleAdminDeleted = (deletedId: string) => {
    setAdminDrawerOpen(false);
    setAdminActionError(null);
    setAdminActionMessage("Moved to Trash.");
    const deletedNode = nodes.find((item) => item.id === deletedId) ?? null;
    const nextParentId = deletedNode?.parentId ?? null;
    let nextNoteId: string | null = null;
    let nextDomain: DomainId | null = null;

    setNodes((prev) =>
      prev
        .filter((item) => item.id !== deletedId)
        .map((item) =>
          item.parentId === deletedId ? { ...item, parentId: nextParentId } : item
        )
    );
    setNotes((prev) => {
      const remaining = prev
        .filter((item) => item.id !== deletedId)
        .map((item) =>
          item.parentId === deletedId
            ? {
                ...item,
                parentId: nextParentId,
                chapterId: nextParentId,
                chapterTitle: nextParentId
                  ? nodes.find((node) => node.id === nextParentId)?.title ?? null
                  : null,
              }
            : item
        );
      const preferred =
        remaining.find(
          (item) => item.domain === activeDomain && item.section === activeSection
        )?.id ??
        remaining.find((item) => item.domain === activeDomain)?.id ??
        remaining[0]?.id ??
        null;
      nextNoteId = preferred;
      nextDomain =
        preferred
          ? (remaining.find((item) => item.id === preferred)?.domain ?? null)
          : null;
      return remaining;
    });

    if (nextDomain) setActiveDomain(nextDomain);
    setSelectedTreeNodeId(nextNoteId);
    setActiveNoteId(nextNoteId);
    router.refresh();
  };

  const handleAdminRestored = (note: AdminNoteRecord) => {
    setAdminActionError(null);
    setAdminActionMessage(null);
    applyAdminRecord(note);

    router.refresh();
  };

  const handleAdminHardDeleted = (noteId: string) => {
    setAdminActionError(null);
    setAdminActionMessage("Deleted forever.");
    const deletedNode = nodes.find((item) => item.id === noteId) ?? null;
    const nextParentId = deletedNode?.parentId ?? null;
    setNodes((prev) =>
      prev
        .filter((item) => item.id !== noteId)
        .map((item) =>
          item.parentId === noteId ? { ...item, parentId: nextParentId } : item
        )
    );
    setNotes((prev) =>
      prev
        .filter((item) => item.id !== noteId)
        .map((item) =>
          item.parentId === noteId
            ? {
                ...item,
                parentId: nextParentId,
                chapterId: nextParentId,
                chapterTitle: nextParentId
                  ? nodes.find((node) => node.id === nextParentId)?.title ?? null
                  : null,
              }
            : item
        )
    );
    setLiveMarkdownById((prev) => {
      if (!(noteId in prev)) return prev;
      const next = { ...prev };
      delete next[noteId];
      return next;
    });
    router.refresh();
  };

  const handleDeleteActiveNote = async () => {
    if (!initialIsAdmin) return;
    if (!activeNote || activeNoteLocked) return;
    if (adminDeletePending) return;

    if (!window.confirm(`Move note "${activeNote.title}" to Trash?`)) return;

    setAdminDeletePending(true);
    setAdminActionError(null);
    setAdminActionMessage(null);

    try {
      const response = await fetch(
        `/api/notes/admin/notes/${encodeURIComponent(activeNote.id)}`,
        { method: "DELETE" }
      );
      const payload = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !payload.ok) {
        setAdminActionError(payload.error || "Delete failed.");
        return;
      }
      handleAdminDeleted(activeNote.id);
    } catch {
      setAdminActionError("Delete failed.");
    } finally {
      setAdminDeletePending(false);
    }
  };

  useEffect(() => {
    const selectedNode =
      selectedTreeNodeId ? tree.nodeById.get(selectedTreeNodeId) ?? null : null;
    if (selectedNode?.kind === "folder") {
      setActiveNoteId(null);
      return;
    }
    if (queryNormalized) return;
    if (filtersActive && filtered[0] && activeNoteId !== filtered[0].id) {
      setActiveNoteId(filtered[0].id);
      setSelectedTreeNodeId(filtered[0].id);
      return;
    }
    if (activeNote) return;
    setActiveNoteId(filtered[0]?.id ?? null);
    setSelectedTreeNodeId(filtered[0]?.id ?? null);
  }, [filtered, activeNote, filtersActive, activeNoteId, queryNormalized, selectedTreeNodeId, tree]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!activeNoteId) return;
    const existsInSection = sectionNotes.some((note) => note.id === activeNoteId);
    if (!existsInSection) return;
    window.localStorage.setItem(
      `notes-last-note-${activeDomain}`,
      activeNoteId
    );
  }, [activeNoteId, activeDomain, sectionNotes]);

  useEffect(() => {
    setAdminActionError(null);
    setAdminActionMessage(null);
  }, [activeNoteId]);

  const activeLiveMarkdown = activeNote ? liveMarkdownById[activeNote.id] : undefined;

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const container = searchContainerRef.current;
      if (container && container.contains(target)) return;
      setIsResultsOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsResultsOpen(false);
    };
    window.addEventListener("click", handleClick);
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("click", handleClick);
      window.removeEventListener("keydown", handleKey);
    };
  }, []);

  const isDark = theme === "dark";
  const bgClass = isDark
    ? "bg-slate-950 text-slate-100"
    : "bg-slate-100 text-slate-900";
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

  const itemActiveClass = isDark
    ? "bg-sky-500/15 text-sky-100 ring-1 ring-sky-500/30 border border-sky-500/30 shadow-sky-500/15"
    : "bg-sky-500/10 text-sky-950 ring-1 ring-sky-500/25 border border-sky-500/25";

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
    ? "h-14 sm:h-16 md:h-24 w-auto shrink-0 drop-shadow-[0_0_10px_rgba(0,0,0,0.65)]"
    : "h-14 sm:h-16 md:h-24 w-auto shrink-0";

  const availableSections = useMemo(() => {
    const set = new Set<SectionId>();
    domainNodes.forEach((node) => set.add(node.section));
    return set;
  }, [domainNodes]);

  type QuickIconItem = { id: SectionId; label: string; icon: ReactNode };

  const sectionQuickIcons = [
    {
      id: "java",
      label: "Java",
      icon: <JavaIcon isDark={isDark} />,
    },
    {
      id: "javascript",
      label: "JavaScript",
      icon: <JsIcon />,
    },
    {
      id: "typescript",
      label: "TypeScript",
      icon: <TsIcon />,
    },
    {
      id: "react",
      label: "React",
      icon: <Icons8MonoIcon iconId="122637" label="React" isDark={isDark} />,
    },
    { id: "node", label: "Node.js", icon: <NodeIcon /> },
    { id: "css", label: "CSS", icon: <CssIcon /> },
    {
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
      id: "designPatterns",
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
      id: "nextjs",
      label: "Next.js",
      icon: (
        <Icons8MonoIcon iconId="MWiBjkuHeMVq" label="Next.js" isDark={isDark} />
      ),
    },
    {
      id: "docker",
      label: "Docker",
      icon: (
        <Icons8MonoIcon iconId="xwH6LOQ7Ckfn" label="Docker" isDark={isDark} />
      ),
    },
    {
      id: "git",
      label: "Git",
      icon: <Icons8MonoIcon iconId="38388" label="Git" isDark={isDark} />,
    },
  ] satisfies ReadonlyArray<QuickIconItem>;

  const tradingQuickIcons = [
    {
      id: "tradingFundamentals",
      label: "Fundamental",
      icon: <FundamentalIcon />,
    },
    {
      id: "tradingTechnical",
      label: "Technical",
      icon: <TechnicalIcon />,
    },
    {
      id: "pastWinner",
      label: "Past Winner",
      icon: <PastWinnerIcon />,
    },
    {
      id: "currentCounter",
      label: "Current Counter",
      icon: <CurrentCounterIcon />,
    },
    {
      id: "fcpo",
      label: "FCPO",
      icon: <FcpoIcon />,
    },
  ] satisfies ReadonlyArray<QuickIconItem>;

  const motivationQuickIcons = [
    {
      id: "mindset",
      label: "Mindset",
      icon: <MindsetIcon />,
    },
    {
      id: "discipline",
      label: "Discipline",
      icon: <DisciplineIcon />,
    },
    {
      id: "habits",
      label: "Habits",
      icon: <HabitIcon />,
    },
    {
      id: "focus",
      label: "Focus",
      icon: <FocusIcon />,
    },
    {
      id: "growth",
      label: "Growth",
      icon: <GrowthIcon />,
    },
  ] satisfies ReadonlyArray<QuickIconItem>;

  const quickSubmenuIcons =
    activeDomain === "trading"
      ? tradingQuickIcons
      : activeDomain === "motivation"
      ? motivationQuickIcons
      : sectionQuickIcons;

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
    setActiveLevel("all");
    setActiveSection(item.id);
    const next = sortForPicker(
      domainNotes.filter((note) => note.section === item.id)
    )[0];
    const nextTree = buildTreeForSection(nodes, activeDomain, item.id);
    setSelectedTreeNodeId(next?.id ?? nextTree.roots[0]?.id ?? null);
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

  const filteredIds = useMemo(
    () => new Set(filtered.map((note) => note.id)),
    [filtered]
  );

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

  const selectedTreeNode = selectedTreeNodeId
    ? tree.nodeById.get(selectedTreeNodeId) ?? null
    : null;
  const selectedFolderNode =
    selectedTreeNode?.kind === "folder" ? selectedTreeNode : null;
  const createParentId =
    selectedTreeNode?.kind === "folder"
      ? selectedTreeNode.id
      : selectedTreeNode?.parentId ?? null;

  const renderTreeNodes = (
    items: TreeNode[],
    mobile: boolean,
    depth = 0
  ): ReactNode =>
    items.map((item) => {
      const isFolder = item.kind === "folder";
      const isExpanded = isFolder ? expandedFolders[item.id] !== false : false;
      const isSelected = selectedTreeNodeId === item.id;
      const isActiveNoteItem = activeNoteId === item.id;
      const matchesFilter = item.kind === "note" ? filteredIds.has(item.id) : true;
      const dimClass = queryNormalized && !matchesFilter ? "opacity-60" : "";
      const showDraft = item.kind === "note" && initialIsAdmin && item.isPublished === false;
      const showLocked = item.kind === "note" && isNoteLocked(item.id);

      return (
        <div key={item.id} className="space-y-1.5">
          <button
            type="button"
            onClick={() => {
              if (isFolder) {
                setSelectedTreeNodeId(item.id);
                setActiveNoteId(null);
                setExpandedFolders((prev) => ({
                  ...prev,
                  [item.id]: !(prev[item.id] !== false),
                }));
                return;
              }

              clearFilters();
              setSelectedTreeNodeId(item.id);
              setActiveNoteId(item.id);
              if (mobile) setSectionsOpen(false);
            }}
            className={[
              "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition duration-150 ease-out",
              isSelected || isActiveNoteItem ? itemActiveClass : `${textBody} ${hoverRow}`,
              dimClass,
              focusRing,
            ].join(" ")}
            style={depth > 0 ? { paddingLeft: `${depth * 16 + 12}px` } : undefined}
          >
            <span className="truncate font-medium">
              {stripSectionPrefixFromTitle(item.title, item.section)}
            </span>
            {isFolder ? (
              <span
                className={`ml-3 inline-flex h-8 w-8 items-center justify-center rounded-md transition-transform ${
                  isExpanded ? "rotate-0" : "-rotate-90"
                }`}
                aria-hidden="true"
              >
                ▼
              </span>
            ) : showDraft || showLocked ? (
              <span className="ml-2 flex items-center gap-2">
                {showDraft ? (
                  <span
                    className={[
                      "rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em]",
                      isDark
                        ? "border-slate-700/80 bg-slate-900 text-slate-200"
                        : "border-slate-300 bg-white text-slate-700",
                    ].join(" ")}
                  >
                    Draft
                  </span>
                ) : null}
                {showLocked ? (
                  <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-400">
                    Locked
                  </span>
                ) : null}
              </span>
            ) : null}
          </button>
          {isFolder && isExpanded && item.children.length > 0 ? (
            <div className={`space-y-1 border-l border-dashed ${borderDashedSoft}`}>
              {renderTreeNodes(item.children, mobile, depth + 1)}
            </div>
          ) : null}
        </div>
      );
    });

  return (
    <div className={`min-h-screen relative scroll-smooth ${bgClass}`}>
      <div className="pointer-events-none absolute inset-0">
        {isDark ? (
          <>
            <div className="absolute left-0 top-12 h-80 w-80 rounded-full bg-gradient-to-br from-slate-900/40 via-slate-900/20 to-transparent blur-3xl opacity-40" />
            <div className="absolute right-[-6rem] top-32 h-[28rem] w-[28rem] rounded-full bg-gradient-to-tr from-slate-900/30 via-slate-900/15 to-transparent blur-3xl opacity-35" />
            <div className="absolute left-1/2 top-64 h-72 w-72 -translate-x-1/2 rounded-full bg-gradient-to-b from-slate-900/25 via-slate-900/15 to-transparent blur-3xl opacity-30" />
          </>
        ) : (
          <>
            <div className="absolute left-0 top-12 h-80 w-80 rounded-full bg-gradient-to-br from-slate-200/40 via-slate-200/30 to-transparent blur-3xl opacity-50" />
            <div className="absolute right-[-6rem] top-32 h-[28rem] w-[28rem] rounded-full bg-gradient-to-tr from-slate-200/35 via-slate-200/25 to-transparent blur-3xl opacity-45" />
            <div className="absolute left-1/2 top-64 h-72 w-72 -translate-x-1/2 rounded-full bg-gradient-to-b from-slate-200/30 via-slate-200/20 to-transparent blur-3xl opacity-40" />
          </>
        )}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[url('/noise.png')] opacity-[0.01] mix-blend-soft-light" />
      <header
          className={[
            "sticky top-0 z-10 border-b backdrop-blur",
            isDark
              ? "border-slate-800/60 bg-slate-950/85"
              : "border-slate-200/70 bg-slate-100/95",
          ].join(" ")}
        >
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 pb-3 sm:px-6 sm:pb-4">
          <div className="flex flex-col gap-3 py-3 sm:py-4 lg:flex-row lg:items-center lg:justify-between">
            <Link href="/" aria-label="Home" className="flex min-w-0 items-center">
              <Image
                src={brandLogoSrc}
                alt="Mohamad Syakir"
                width={1200}
                height={300}
                priority
                className={brandLogoClass}
              />
            </Link>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              <div className="order-1 flex items-center gap-2 sm:order-2">
                <div
                  ref={searchContainerRef}
                  className="relative min-w-0 flex-1 sm:w-56 sm:flex-none lg:w-64"
                >
                  <input
                    ref={searchRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => {
                      if (queryNormalized) setIsResultsOpen(true);
                    }}
                    placeholder="Search notes..."
                    className={`w-full rounded-xl border px-3 py-2 text-sm outline-none ring-0 transition duration-150 ease-out ${inputClass}`}
                  />
                  <div className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 text-[11px] uppercase tracking-[0.15em] text-sky-400 lg:block">
                    /
                  </div>
                  {queryNormalized && isResultsOpen && (
                    <div
                      className={[
                        "absolute left-0 right-0 top-[110%] z-30 rounded-2xl border shadow-xl",
                        isDark
                          ? "border-slate-800/70 bg-slate-950/95"
                          : "border-slate-200 bg-white",
                      ].join(" ")}
                    >
                      <div className="flex items-center justify-between gap-2 border-b px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                        <span>Results for “{queryNormalized}”</span>
                        <button
                          type="button"
                          onClick={() => {
                            clearFilters();
                            searchRef.current?.focus();
                          }}
                          className={[
                            "rounded-full border px-2 py-1 transition duration-150 ease-out",
                            hoverRow,
                            borderSoft,
                            focusRing,
                            "text-[10px] font-semibold uppercase tracking-[0.15em]",
                          ].join(" ")}
                        >
                          Clear
                        </button>
                      </div>
                      {contentSearchPending || isSearchingContent ? (
                        <p className="px-3 py-3 text-xs text-slate-400">
                          Searching notes...
                        </p>
                      ) : null}
                      <div className="max-h-[60vh] space-y-2 overflow-y-auto p-2 sm:max-h-[360px]">
                        {searchResults.length > 0 ? (
                          searchResults.slice(0, 10).map(({ note, snippets }) => (
                            <button
                              key={note.id}
                              type="button"
                              onClick={() => handleResultClick(note)}
                              className={[
                                "w-full rounded-xl border px-3 py-3 text-left transition duration-150 ease-out",
                                hoverRow,
                                focusRing,
                                borderSoft,
                              ].join(" ")}
                            >
                              <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-sky-400">
                                <span>
                                  {sections.find((s) => s.id === note.section)
                                    ?.label ?? note.section}
                                </span>
                                <span className="text-slate-500">•</span>
                                <span>{note.chapterTitle ?? "Root"}</span>
                              </div>
                              <div className="mt-1 text-sm font-semibold text-slate-200">
                                {stripSectionPrefixFromTitle(note.title, note.section)}
                              </div>
                              <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-slate-500">
                                {snippets.length} match{snippets.length === 1 ? "" : "es"}
                              </p>
                              {snippets.slice(0, 3).map((snippet, idx) => (
                                <p
                                  key={`${note.id}-snip-${idx}`}
                                  className="mt-1 text-xs leading-relaxed text-slate-400"
                                >
                                  {highlightSnippetParts(snippet, searchTerms)}
                                </p>
                              ))}
                            </button>
                          ))
                        ) : (
                          <p className="px-3 py-2 text-xs text-slate-400">
                            No notes match this search.
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setTheme(isDark ? "light" : "dark")}
                  className={[
                    pillButton,
                    isDark
                      ? "border-slate-800/80 bg-slate-900 text-slate-200 hover:border-sky-500/60"
                      : "border-slate-200 bg-white text-slate-700 hover:border-sky-500/60",
                    "h-10 w-10 shrink-0 p-0 justify-center",
                    "shadow-sm shadow-slate-900/10 hover:brightness-105",
                    focusRing,
                  ].join(" ")}
                  aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                >
                  <span className="flex h-6 w-6 items-center justify-center">
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
                </button>
              </div>
              <div className="order-2 flex flex-wrap items-center justify-end gap-2 sm:order-1 sm:gap-3">
              {!initialIsAuthenticated ? (
                <Link
                  href={loginHref}
                  className={[
                    pillButton,
                    isDark
                      ? "border-slate-800/80 bg-slate-900 text-slate-200 hover:border-sky-500/60"
                      : "border-slate-200 bg-white text-slate-700 hover:border-sky-500/60",
                    "shadow-sm shadow-slate-900/10 hover:brightness-105",
                    focusRing,
                  ].join(" ")}
                >
                  Sign in
                </Link>
              ) : (
                <>
                  {initialIsAdmin ? (
                    <>
                      <button
                        type="button"
                        onClick={openAdminNew}
                        className={[
                          pillButton,
                          isDark
                            ? "border-slate-800/80 bg-slate-900 text-slate-200 hover:border-sky-500/60"
                            : "border-slate-200 bg-white text-slate-700 hover:border-sky-500/60",
                          "shadow-sm shadow-slate-900/10 hover:brightness-105",
                          focusRing,
                        ].join(" ")}
                      >
                        New
                      </button>
                      <button
                        type="button"
                        onClick={() => setTrashDrawerOpen(true)}
                        className={[
                          pillButton,
                          isDark
                            ? "border-slate-800/80 bg-slate-900 text-slate-200 hover:border-sky-500/60"
                            : "border-slate-200 bg-white text-slate-700 hover:border-sky-500/60",
                          "shadow-sm shadow-slate-900/10 hover:brightness-105",
                          focusRing,
                          "gap-2",
                        ].join(" ")}
                      >
                        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
                          <path
                            fill="currentColor"
                            d="M9 3h6l1 2h5v2H3V5h5l1-2Zm1 7h2v9h-2v-9Zm4 0h2v9h-2v-9ZM6 10h2v9H6v-9Z"
                          />
                        </svg>
                        Trash
                      </button>
                    </>
                  ) : null}
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className={[
                      pillButton,
                      isDark
                        ? "border-slate-800/80 bg-slate-900 text-slate-200 hover:border-rose-500/60"
                        : "border-slate-200 bg-white text-slate-700 hover:border-rose-500/60",
                      "shadow-sm shadow-slate-900/10 hover:brightness-105",
                      focusRing,
                    ].join(" ")}
                  >
                    Sign out
                  </button>
                </>
              )}
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col items-start gap-2 sm:gap-3">
            {initialDataNotice ? (
              <div
                className={[
                  "w-full rounded-2xl border px-4 py-3 text-sm leading-relaxed",
                  isDark
                    ? "border-amber-400/30 bg-amber-500/10 text-amber-100"
                    : "border-amber-300 bg-amber-50 text-amber-900",
                ].join(" ")}
              >
                {initialDataNotice}
              </div>
            ) : null}
            <div className="flex flex-wrap justify-start gap-2">
              {domains.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => {
                    setActiveDomain(d.id);
                    setActiveSection(firstSectionForDomain(d.id));
                    setActiveNoteId(null);
                    setSelectedTreeNodeId(null);
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
                  {requiresNotesOwnerAccess(d.id) && !initialIsAdmin && (
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

            <div
              className={[
                "w-full pb-1 sm:hidden",
                "overflow-x-auto",
                "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
              ].join(" ")}
            >
              <div className="flex w-max flex-nowrap items-center gap-4 pr-2">
                {quickSubmenuIcons.map((item) => {
                  const key = `mobile-section:${item.id}`;
                  const isActive = activeSection === item.id;

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => onQuickIconClick(item)}
                      className={[
                        "relative inline-flex shrink-0 items-center justify-center rounded-2xl border p-3 transition duration-150 ease-out",
                        isActive
                          ? isDark
                            ? "border-sky-400/70 bg-sky-500/8 text-white shadow-[0_0_0_1px_rgba(56,189,248,0.08)]"
                            : "border-sky-500/60 bg-sky-50 text-slate-900"
                          : isDark
                            ? "border-slate-800 bg-slate-900 text-white"
                            : "border-slate-200 bg-white text-slate-900",
                        "focus:outline-none focus:ring-0 focus-visible:ring-0",
                      ].join(" ")}
                      aria-label={item.label}
                      title={item.label}
                    >
                      <span className="translate-y-[1px] scale-[0.8]">{item.icon}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div
              className={[
                "hidden w-full max-w-7xl pb-1 sm:block",
                "overflow-x-auto sm:overflow-visible",
                "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
              ].join(" ")}
            >
              <div className="flex w-max flex-nowrap items-center gap-6 sm:gap-7 sm:w-full sm:flex-wrap">
                {quickSubmenuIcons.map((item) => {
                  const key = `section:${item.id}`;
                  const isAvailable = availableSections.has(item.id);
                  const isActive = activeSection === item.id;
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
                      onClick={() => onQuickIconClick(item)}
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

      <main
        id="notes-main"
        className={`mx-auto grid w-full max-w-7xl grid-cols-1 gap-3 px-4 py-6 sm:gap-4 sm:px-6 sm:py-10 ${
          showSidebar ? "lg:grid-cols-[300px_minmax(0,1fr)]" : "lg:grid-cols-1"
        }`}
      >
        {/* Left tree */}
        <aside className={showSidebar ? "hidden lg:block" : "hidden"}>
          <div
            className={[
              "sticky top-[120px] space-y-4 rounded-2xl p-4 shadow-lg",
              surfaceElevated,
              cardGradient,
            ].join(" ")}
          >
            <h3 className={`${headingSm} ${textSubtle}`}>
              {sectionLabelForId(activeSection)}
            </h3>
            <div className="space-y-3 text-sm">
              {tree.roots.length > 0 ? (
                renderTreeNodes(tree.roots, false)
              ) : (
                <p className={`rounded-xl border border-dashed px-3 py-3 text-sm ${textMuted} ${borderSoft}`}>
                  No folders or notes in this topic yet.
                </p>
              )}
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
          {isDomainLocked ? (
            <div
              className={[
                "w-full rounded-2xl border p-4 shadow-xl sm:p-7",
                surfaceElevated,
                cardGradient,
              ].join(" ")}
            >
              <div className="mb-6 space-y-3">
                <h3 className={`text-xl font-semibold ${textPrimary}`}>
                  Locked. Personal use only.
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {!initialIsAuthenticated ? (
                  <Link
                    href={ownerLoginHref}
                    className={[
                      pillButton,
                      isDark
                        ? "border-slate-800 bg-slate-900 text-slate-200 hover:border-sky-500/60"
                        : "border-slate-200 bg-white text-slate-700 hover:border-sky-500/60",
                      "w-full justify-center shadow-sm sm:w-auto",
                      focusRing,
                    ].join(" ")}
                  >
                    Sign in
                  </Link>
                ) : (
                  <span className={`text-sm ${textMuted}`}>
                    You are signed in, but this account is not the site owner.
                  </span>
                )}

              </div>
            </div>
          ) : selectedFolderNode ? (
              <div
                className={[
                  "mx-auto max-w-[920px] rounded-2xl border p-4 shadow-xl sm:p-7",
                  surfaceElevated,
                  cardGradient,
                ].join(" ")}
              >
                {adminActionError ? (
                  <p className="mb-5 rounded-xl border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-100">
                    {adminActionError}
                  </p>
                ) : null}
                {adminActionMessage ? (
                  <p className="mb-5 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">
                    {adminActionMessage}
                  </p>
                ) : null}

                <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className={`text-xs font-semibold uppercase tracking-[0.16em] ${textMuted}`}>
                      Folder
                    </p>
                    <h1 className={`mt-2 text-2xl font-semibold ${textPrimary}`}>
                      {stripSectionPrefixFromTitle(
                        selectedFolderNode.title,
                        selectedFolderNode.section
                      )}
                    </h1>
                  </div>
                  {initialIsAdmin ? (
                    <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
                      <button
                        type="button"
                        onClick={() => openAdminEdit(selectedFolderNode.id)}
                        className={[
                          pillButton,
                          isDark
                            ? "border-slate-800 bg-slate-900 text-slate-200 hover:border-slate-700"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
                          "w-full justify-center shadow-sm sm:w-auto",
                          focusRing,
                        ].join(" ")}
                      >
                        Edit
                      </button>
                    </div>
                  ) : null}
                </div>

                <p className={`text-sm ${textMuted}`}>
                  Edit this folder to rename it or move it to trash.
                </p>
              </div>
          ) : activeNote ? (
              activeNoteLocked ? (
                <div
                  className={[
                    "mx-auto max-w-[920px] rounded-2xl border p-4 shadow-xl sm:p-7",
                    surfaceElevated,
                    cardGradient,
                  ].join(" ")}
                >
                  <div className="mb-6 space-y-3">
                    <h3 className={`text-xl font-semibold ${textPrimary}`}>
                      {stripSectionPrefixFromTitle(
                        activeNote.title,
                        activeNote.section
                      )}
                    </h3>
                    <p className={`text-sm ${textMuted}`}>
                      Sign in as the site owner to view this note.
                    </p>
                    <div className="h-4 w-2/3 rounded bg-white/10" />
                    <div className="h-4 w-full rounded bg-white/10" />
                    <div className="h-4 w-11/12 rounded bg-white/10" />
                    <div className="h-4 w-4/5 rounded bg-white/10" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowLoginModal(true)}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-200 sm:w-auto"
                  >
                    Login to unlock
                  </button>
                </div>
              ) : (
		            <article
              className={[
                "mx-auto max-w-[920px] rounded-2xl border p-4 shadow-xl sm:p-7",
                surfaceElevated,
                cardGradient,
              ].join(" ")}
              style={mdxVars}
	            >
                  {adminActionError ? (
                    <p className="mb-5 rounded-xl border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-100">
                      {adminActionError}
                    </p>
                  ) : null}
                  {adminActionMessage ? (
                    <p className="mb-5 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">
                      {adminActionMessage}
                    </p>
                  ) : null}

                  <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h1 className={`text-2xl font-semibold ${textPrimary}`}>
                        {stripSectionPrefixFromTitle(
                          activeNote.title,
                          activeNote.section
                        )}
                      </h1>
                    </div>
                    {initialIsAdmin ? (
                      <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
                        <button
                          type="button"
                          onClick={() => openAdminEdit(activeNote.id)}
                          className={[
                            pillButton,
                            isDark
                              ? "border-slate-800 bg-slate-900 text-slate-200 hover:border-slate-700"
                              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
                            "w-full justify-center shadow-sm sm:w-auto",
                            focusRing,
                          ].join(" ")}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={handleDeleteActiveNote}
                          disabled={adminDeletePending}
                          className={[
                            pillButton,
                            isDark
                              ? "border-red-500/40 bg-red-500/10 text-red-100 hover:bg-red-500/20"
                              : "border-red-500/40 bg-red-50 text-red-700 hover:bg-red-100",
                            "w-full justify-center shadow-sm sm:w-auto",
                            focusRing,
                          ].join(" ")}
                        >
                          {adminDeletePending ? "Moving..." : "Move to Trash"}
                        </button>
                      </div>
                    ) : null}
                  </div>

		              <div className={`${bodyBase} text-[15px]`}>
                    {typeof activeLiveMarkdown === "string" ? (
                      <NoteContent
                        source={activeLiveMarkdown}
                        suppressFirstHeading
                      />
                    ) : (
                      children
                    )}
                  </div>
			            </article>
              )
			          ) : hasAnyNotes && filtersActive ? (
                <div
                  className={`mx-auto max-w-[920px] rounded-xl border border-dashed p-6 text-center sm:p-8 ${borderSoft} ${textMuted}`}
                >
                  <p>
                    {contentSearchPending || isSearchingContent
                      ? "Searching notes..."
                      : "No notes match your search."}
                  </p>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className={`mt-3 inline-flex items-center rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.15em] ${borderSoft} ${hoverRow} ${focusRing}`}
                  >
                    Clear filters
                  </button>
                </div>
              ) : sectionNodes.length > 0 ? (
	            <div
	              className={`mx-auto max-w-[920px] rounded-xl border border-dashed p-6 text-center sm:p-8 ${borderSoft} ${textMuted}`}
	            >
	              Select a note from the left tree.
            </div>
          ) : (
	            <div
	              className={`mx-auto max-w-[920px] rounded-xl border border-dashed p-6 text-center sm:p-8 ${borderSoft} ${textMuted}`}
	            >
	              Notes coming soon.
            </div>
          )}
        </section>

      </main>

	      {sectionsOpen && (
        <div
          className="fixed inset-0 z-30 flex items-end justify-center bg-black/40 px-4 pb-4 pt-10 sm:items-center backdrop-blur-[2px] transition duration-200 ease-out"
          onClick={closeSectionsSheet}
        >
          <div
            className={[
              "w-full max-w-md rounded-2xl border p-4 shadow-xl transition duration-200 ease-out sm:p-5",
              surfaceElevated,
              cardGradient,
            ].join(" ")}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => {
              sectionsSheetTouchStartYRef.current = e.touches[0]?.clientY ?? null;
              sectionsSheetTouchDeltaYRef.current = 0;
            }}
            onTouchMove={(e) => {
              const startY = sectionsSheetTouchStartYRef.current;
              const currentY = e.touches[0]?.clientY;
              if (startY === null || typeof currentY !== "number") return;
              sectionsSheetTouchDeltaYRef.current = Math.max(0, currentY - startY);
            }}
            onTouchEnd={() => {
              if (sectionsSheetTouchDeltaYRef.current > 90) {
                closeSectionsSheet();
                return;
              }
              sectionsSheetTouchStartYRef.current = null;
              sectionsSheetTouchDeltaYRef.current = 0;
            }}
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className={`${headingSm} ${textSubtle}`}>Browse sections</h2>
              <button
                type="button"
                onClick={closeSectionsSheet}
                className={`text-xs font-medium ${textMuted} ${focusRing} rounded-full px-2 py-1 ${hoverRow}`}
              >
                Close
              </button>
	            </div>
	            <div className="max-h-[70vh] space-y-3 overflow-y-auto text-sm sm:max-h-[60vh]">
              {tree.roots.length > 0 ? (
                renderTreeNodes(tree.roots, true)
              ) : (
                <p className={`rounded-xl border border-dashed px-3 py-3 text-sm ${textMuted} ${borderSoft}`}>
                  No folders or notes in this topic yet.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {initialIsAdmin ? (
        <AdminNoteDrawer
          key={`admin-drawer-${adminDrawerSessionKey}`}
          open={adminDrawerOpen}
          mode={adminDrawerMode}
          noteId={adminDrawerNoteId}
          nodes={nodes}
          defaultDomain={activeDomain}
          defaultSection={activeSection}
          defaultParentId={createParentId}
          isDark={isDark}
          mdxVars={mdxVars}
          onClose={() => {
            setAdminDrawerOpen(false);
            setAdminDrawerNoteId(null);
            router.refresh();
          }}
          onSaved={handleAdminSaved}
          onPersisted={handleAdminPersisted}
          onDeleted={handleAdminDeleted}
        />
      ) : null}

      {initialIsAdmin ? (
        <TrashDrawer
          open={trashDrawerOpen}
          isDark={isDark}
          onClose={() => setTrashDrawerOpen(false)}
          onRestored={handleAdminRestored}
          onHardDeleted={handleAdminHardDeleted}
        />
      ) : null}

	      {showScrollTop && (
        <button
          type="button"
          aria-label="Back to top"
          onClick={() => {
            if (typeof window === "undefined") return;
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className={[
            "fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6",
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

      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/15 bg-[#0c111a] p-4 shadow-2xl sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-white">
                  Locked. Personal use only.
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowLoginModal(false)}
                className="rounded-lg p-1 text-white/60 transition hover:bg-white/10 hover:text-white"
                aria-label="Close login dialog"
              >
                X
              </button>
            </div>

            <div className="space-y-3">
              {initialAuthAvailable ? (
                <>
                  <p className="pt-1 text-center text-xs text-white/45">Or sign in using</p>
                  <div className="flex items-center justify-center gap-4">
                    <a
                      href={`/api/auth/signin?provider=google&next=${encodeURIComponent(loginNext)}`}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white text-slate-900 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-white/40"
                      title="Sign in with Google"
                      aria-label="Sign in with Google"
                    >
                      <GoogleLogo />
                    </a>
                    <a
                      href={`/api/auth/signin?provider=github&next=${encodeURIComponent(loginNext)}`}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-[#111827] text-white transition hover:bg-[#1f2937] focus:outline-none focus:ring-2 focus:ring-white/40"
                      title="Sign in with Github"
                      aria-label="Sign in with Github"
                    >
                      <GitHubLogo />
                    </a>
                  </div>
                </>
              ) : (
                <div className="rounded-2xl border border-amber-400/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
                  Sign-in is temporarily unavailable because the Supabase auth
                  backend cannot be reached.
                </div>
              )}
            </div>
          </div>
        </div>
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
