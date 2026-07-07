export const LANGUAGES = [
  "TypeScript",
  "JavaScript",
  "Rust",
  "Go",
  "Python",
  "C",
  "C++",
  "Java",
  "Ruby",
  "Swift",
  "Kotlin",
  "Zig",
  "OCaml",
] as const;

export type Language = (typeof LANGUAGES)[number];
