import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";

export default defineConfig([
  js.configs.recommended,
  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },
]);
