import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      ".vercel/**",
      "dist-notes-gen/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "app/notes/generated/**",
      "scripts/**",
    ],
  },
];

export default eslintConfig;
