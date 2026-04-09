import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const spawnProc = (command, commandArgs) =>
  spawn(command, commandArgs, {
    stdio: "inherit",
    shell: process.platform === "win32",
  });

const cwd = process.cwd();
const args = new Set(process.argv.slice(2));
const shouldClean = args.has("--clean");
const useWebpack = args.has("--webpack");
const port = process.env.PORT || "33333";

const rmDirIfExists = (relativePath) => {
  try {
    fs.rmSync(path.join(cwd, relativePath), { recursive: true, force: true });
  } catch {}
};

const run = async () => {
  if (shouldClean) {
    rmDirIfExists(".next");
    rmDirIfExists(".open-next");
    rmDirIfExists(".vercel");
  }

  const nextArgs = ["dev", "-p", port];
  if (!useWebpack) nextArgs.push("--turbo");
  const next = spawnProc("next", nextArgs);

  const shutdown = (signal) => {
    next.kill(signal);
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));

  const nextExitCode = await new Promise((resolve) =>
    next.on("exit", (code) => resolve(code ?? 1))
  );
  process.exit(nextExitCode);
};

run();
