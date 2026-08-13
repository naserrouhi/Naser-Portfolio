import { cp, mkdir } from "node:fs/promises";

const standaloneRoot = ".next/standalone";

await mkdir(`${standaloneRoot}/.next`, { recursive: true });
await Promise.all([
  cp("public", `${standaloneRoot}/public`, { recursive: true, force: true }),
  cp(".next/static", `${standaloneRoot}/.next/static`, {
    recursive: true,
    force: true,
  }),
]);
