import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __dirname = dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({ baseDirectory: __dirname });

export default [
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "node_modules/**",
      "next-env.d.ts",
      // Vendored worktrees from an editor plugin — not our source.
      ".kilo/**",
      "public/sw.js",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // The codebase predates strict typing in a lot of API payload handling.
      // These are warnings so the build stays green while they get cleaned up;
      // tighten to "error" once the count is at zero.
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // next/image is the right default, but a few places legitimately need a
      // plain <img> (data URIs, Cloudinary transforms we size ourselves).
      "@next/next/no-img-element": "warn",
      "react-hooks/exhaustive-deps": "warn",
      // Apostrophes and quotes in user-facing copy are intentional. The rule
      // guards against stray JSX delimiters, which TypeScript already catches.
      "react/no-unescaped-entities": "warn",
    },
  },
  {
    // Config files are loaded by Node/jiti in CommonJS, where require() is the
    // documented way to pull in a Tailwind plugin.
    files: ["*.config.{js,ts,mjs,cjs}", "tailwind.config.ts", "postcss.config.mjs"],
    rules: { "@typescript-eslint/no-require-imports": "off" },
  },
];
