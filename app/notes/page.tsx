import NotesClient from "./NotesClient";
import { mockNotes } from "./content";

export default function NotesPage() {
  return <NotesClient initialNotes={mockNotes} />;
}

