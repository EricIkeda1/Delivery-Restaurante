import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";

export default defineConfig([
  globalIgnores([".next/**", "out/**", "coverage/**", "next-env.d.ts"]),
  js.configs.recommended,
  ...tseslint.configs.recommended,
  reactHooks.configs.flat.recommended,
  { rules: { "no-empty": ["error", { allowEmptyCatch: true }] } },
]);
