import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const cwd = process.cwd();
const args = new Set(process.argv.slice(2));
const isOnce = args.has("--once");

const shouldIgnore = (absolutePath) => {
  const relativePath = path.relative(cwd, absolutePath);
  if (!relativePath || relativePath.startsWith("..")) return true;

  return (
    relativePath.startsWith(".git/") ||
    relativePath.startsWith(".next/") ||
    relativePath.startsWith("dist-notes-gen/") ||
    relativePath === "app/notes/generated/notes.generated.ts"
  );
};

const runNotesGenerate = () =>
  new Promise((resolve, reject) => {
    const child = spawn("npm", ["run", "notes:generate"], {
      cwd,
      stdio: "inherit",
      shell: process.platform === "win32",
    });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`notes:generate exited with code ${code}`));
    });
  });

let debounceTimer = null;
let isRunning = false;
let rerunRequested = false;

const requestRegen = () => {
  if (isRunning) {
    rerunRequested = true;
    return;
  }

  isRunning = true;
  runNotesGenerate()
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error);
    })
    .finally(() => {
      isRunning = false;
      if (rerunRequested) {
        rerunRequested = false;
        requestRegen();
      }
    });
};

const onFsEvent = (dir) => (eventType, filename) => {
  if (!filename) return;
  const absolutePath = path.join(dir, filename.toString());
  if (shouldIgnore(absolutePath)) return;

  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => requestRegen(), 150);
};

const main = async () => {
  if (isOnce) {
    await runNotesGenerate();
    return;
  }

  const watchRoots = [
    path.join(cwd, "app/notes/content"),
    path.join(cwd, "app/notes/outline"),
    path.join(cwd, "app/notes/outline.ts"),
    path.join(cwd, "scripts/generate-notes.ts"),
    path.join(cwd, "tsconfig.notes-gen.json"),
  ];

  for (const root of watchRoots) {
    if (!fs.existsSync(root)) continue;
    try {
      fs.watch(
        root,
        { recursive: fs.lstatSync(root).isDirectory() },
        onFsEvent(root)
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`notes:watch failed to watch ${root}`, error);
    }
  }

  // eslint-disable-next-line no-console
  console.log("notes:watch running (regenerates on notes changes)");
};

main();

