import tsParser from "@typescript-eslint/parser";

export default [
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    ignores: [".next/**", "node_modules/**", "coverage/**", "playwright-report/**"]
  }
];
