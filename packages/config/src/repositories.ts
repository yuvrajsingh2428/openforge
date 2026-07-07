export interface CuratedRepository {
  readonly owner: string;
  readonly name: string;
  readonly category: string;
}

export const CURATED_REPOSITORIES: ReadonlyArray<CuratedRepository> = [
  { owner: "facebook", name: "react", category: "Frontend" },
  { owner: "vuejs", name: "core", category: "Frontend" },
  { owner: "sveltejs", name: "svelte", category: "Frontend" },
  { owner: "angular", name: "angular", category: "Frontend" },
  { owner: "vercel", name: "next.js", category: "Frontend" },
  { owner: "remix-run", name: "remix", category: "Frontend" },
  { owner: "withastro", name: "astro", category: "Frontend" },
  { owner: "nodejs", name: "node", category: "Runtime" },
  { owner: "denoland", name: "deno", category: "Runtime" },
  { owner: "oven-sh", name: "bun", category: "Runtime" },
  { owner: "microsoft", name: "TypeScript", category: "Language" },
  { owner: "rust-lang", name: "rust", category: "Language" },
  { owner: "golang", name: "go", category: "Language" },
  { owner: "python", name: "cpython", category: "Language" },
  { owner: "prisma", name: "prisma", category: "Database" },
  { owner: "drizzle-team", name: "drizzle-orm", category: "Database" },
  { owner: "tailwindlabs", name: "tailwindcss", category: "Styling" },
  { owner: "shadcn-ui", name: "ui", category: "UI Library" },
  { owner: "vitejs", name: "vite", category: "Build Tool" },
  { owner: "evanw", name: "esbuild", category: "Build Tool" },
  { owner: "vitest-dev", name: "vitest", category: "Testing" },
  { owner: "microsoft", name: "playwright", category: "Testing" },
  { owner: "docker", name: "cli", category: "DevOps" },
  { owner: "kubernetes", name: "kubernetes", category: "DevOps" },
] as const;
