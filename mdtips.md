# MARKDOWN CHEAT SHEET

## BASICS

- Paragraphs: just write text with a blank line between paragraphs.

- Line break inside a paragraph (rarely needed):
  First line  
  Second line ← two spaces at end of previous line

## HEADINGS

# Title of the note (H1 – use once per file)

## Big Section (H2)

### Sub-section (H3)

#### Smaller sub-section (H4, usually no need to go deeper)

## TEXT EMPHASIS

- _Italic_ → _word_ = _word_
- **Bold** → **word** = **word**
- **_Bold + italic_**→ **_word_** = **_word_**
- Strikethrough → ~~old text~~ = ~~old text~~
- Inline code → `code` = `code` (great for commands or terms)

## LISTS

- Unordered list:

  - Item 1
  - Item 2
    - Nested item (indent with two spaces)

- Ordered list:

  1. Step one
  2. Step two
  3. Step three

- You can mix:
  1. Install tools
     - JDK
     - VS Code
  2. Verify installation

## CODE BLOCKS

- Inline code (short): `java -version`, `System.out.println()`.

- Fenced code block (with language for highlighting):

  ```java
  public class Main {
      public static void main(String[] args) {
          System.out.println("Hello World");
      }
  }
  ```

## LINKS

- Normal link:
  - `[link text](https://example.com)`
- Reference-style links (cleaner for long URLs):
  - `This is a [JDK link][jdk].`
  - Put refs at the bottom:
    - `[jdk]: https://www.oracle.com/java/technologies/downloads/`

## IMAGES

- Basic image:
  - `![alt text](image-path-or-url)`
- Add a tooltip title:
  - `![alt text](url-or-path "Tooltip title")`
- Clickable image:
  - `[![alt text](/path/to/img.png)](https://fullsize-link.com)`

### Images for a Next.js site

- Best practice: store images under `public/` and reference them with an absolute path:
  - Example file: `public/notes/java/getting-started/frame_0008.png`
  - Markdown: `![Setup screenshot](/notes/java/getting-started/frame_0008.png)`
- Avoid spaces in filenames/folders (use `-` or `_`) to prevent URL headaches.

### Images from Google Drive

1. Upload image → Right-click → **Get link**
2. Set access to **Anyone with the link (Viewer)**
3. You’ll get a link like:
   - `https://drive.google.com/file/d/FILE_ID/view?usp=sharing`
4. Convert it to a direct view link:
   - `https://drive.google.com/uc?export=view&id=FILE_ID`
5. Use in Markdown:
   - `![alt text](https://drive.google.com/uc?export=view&id=FILE_ID)`

## QUOTES

> This is a quote.
>
> Use it for tips, definitions, or important notes.

## TASK LISTS (CHECKBOXES)

- [ ] Not done yet
- [x] Done

## TABLES

| Tool    | Purpose          | Verify          |
| ------- | ---------------- | --------------- |
| JDK     | Compile/run Java | `java -version` |
| VS Code | Editor           | Open a project  |

## ANCHOR LINKS (JUMP TO A SECTION)

- `[Jump to Installing the JDK](#installing-the-jdk)`

## Installing the JDK

## ESCAPING CHARACTERS

If Markdown is formatting something you don’t want, escape it with `\\`:

- `\\*not italic\\*`
- `\\# not a heading`
- `\\- not a list item`

## SHOWING LITERAL BACKTICKS

To show backticks literally, wrap with double backticks:

- `` Use `backticks` inside ``

## OPTIONAL (IF YOU PLAN TO PARSE NOTES LATER): FRONTMATTER

```yaml
---
title: "Setting Up the Development Environment"
domain: "software"
section: "java"
chapter: "getting-started"
tags: ["jdk", "vscode", "setup"]
updatedAt: "2025-12-13"
---
```

## NOTE-WRITING TIPS (PRACTICAL)

- Use one `#` title per file; use `##`/`###` for structure.
- Keep a consistent pattern per note: **Overview → Steps → Code → Verify → Notes**.
- Keep commands in code blocks and expected output in a separate block.
- Add alt text for every image (helps accessibility + searching later).
- Prefer reference-style links if you reuse the same URL many times.
