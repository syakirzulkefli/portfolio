## Notes structure

- `app/notes/content/` holds note content + menus.
  - `app/notes/content/<domain>/index.ts` aggregates sections for a domain.
  - `app/notes/content/<domain>/<section>/index.ts` defines the left menu (outline) and links to `.md`/`.mdx` files.
- `app/notes/outline.ts` aggregates all domain outlines into `notesOutline`.
- `app/notes/catalog.ts` builds the lightweight notes list (title/summary/tags/updatedAt) and resolves a note id to its markdown path.
- `app/notes/mdx/MdxContent.tsx` renders MDX for the active note.

