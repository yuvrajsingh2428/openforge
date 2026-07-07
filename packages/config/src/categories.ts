export const CATEGORIES = [
  "Frontend",
  "Runtime",
  "Language",
  "Database",
  "Styling",
  "UI Library",
  "Build Tool",
  "Testing",
  "DevOps",
] as const;

export type Category = (typeof CATEGORIES)[number];
