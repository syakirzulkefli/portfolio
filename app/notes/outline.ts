export type { NotesOutlineGroup, NotesOutlineItem } from "./outline/types";

import type { NotesOutlineGroup } from "./outline/types";
import { softwareOutline } from "./content/software";
import { tradingOutline } from "./content/trading";
import { readingOutline } from "./content/reading";

export const notesOutline: NotesOutlineGroup[] = [
  ...softwareOutline,
  ...readingOutline,
  ...tradingOutline,
];
