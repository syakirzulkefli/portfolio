import { spawn } from "node:child_process";

const spawnProc = (command, commandArgs) =>
  spawn(command, commandArgs, {
    stdio: "inherit",
    shell: process.platform === "win32",
  });

const run = async () => {
  const generate = spawnProc("npm", ["run", "notes:generate"]);
  const generateExitCode = await new Promise((resolve) =>
    generate.on("exit", (code) => resolve(code ?? 1))
  );
  if (generateExitCode !== 0) process.exit(generateExitCode);

  const watcher = spawnProc("node", ["scripts/notes-watch.mjs"]);
  const next = spawnProc("next", ["dev", "-p", "33333"]);

  const shutdown = (signal) => {
    watcher.kill(signal);
    next.kill(signal);
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));

  const nextExitCode = await new Promise((resolve) =>
    next.on("exit", (code) => resolve(code ?? 1))
  );
  watcher.kill("SIGTERM");
  process.exit(nextExitCode);
};

run();

