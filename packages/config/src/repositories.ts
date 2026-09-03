export interface CuratedRepository {
  readonly owner: string;
  readonly name: string;
  readonly category: string;
}

export const CURATED_REPOSITORIES: ReadonlyArray<CuratedRepository> = [
  // Frontend
  { owner: "facebook", name: "react", category: "Frontend" },
  { owner: "vuejs", name: "core", category: "Frontend" },
  { owner: "sveltejs", name: "svelte", category: "Frontend" },
  { owner: "angular", name: "angular", category: "Frontend" },
  { owner: "vercel", name: "next.js", category: "Frontend" },
  { owner: "remix-run", name: "remix", category: "Frontend" },
  { owner: "withastro", name: "astro", category: "Frontend" },
  { owner: "solidjs", name: "solid", category: "Frontend" },

  // Backend
  { owner: "expressjs", name: "express", category: "Backend" },
  { owner: "nestjs", name: "nest", category: "Backend" },
  { owner: "fastify", name: "fastify", category: "Backend" },
  { owner: "tiangolo", name: "fastapi", category: "Backend" },
  { owner: "django", name: "django", category: "Backend" },
  { owner: "gin-gonic", name: "gin", category: "Backend" },
  { owner: "rails", name: "rails", category: "Backend" },
  { owner: "spring-projects", name: "spring-boot", category: "Backend" },

  // AI & ML
  { owner: "langchain-ai", name: "langchain", category: "AI & ML" },
  { owner: "ollama", name: "ollama", category: "AI & ML" },
  { owner: "huggingface", name: "transformers", category: "AI & ML" },
  { owner: "vllm-project", name: "vllm", category: "AI & ML" },
  { owner: "meta-llama", name: "llama", category: "AI & ML" },
  { owner: "milvus-io", name: "milvus", category: "AI & ML" },

  // Runtime
  { owner: "nodejs", name: "node", category: "Runtime" },
  { owner: "denoland", name: "deno", category: "Runtime" },
  { owner: "oven-sh", name: "bun", category: "Runtime" },
  { owner: "tauri-apps", name: "tauri", category: "Runtime" },

  // Language
  { owner: "microsoft", name: "TypeScript", category: "Language" },
  { owner: "rust-lang", name: "rust", category: "Language" },
  { owner: "golang", name: "go", category: "Language" },
  { owner: "python", name: "cpython", category: "Language" },
  { owner: "ziglang", name: "zig", category: "Language" },
  { owner: "apple", name: "swift", category: "Language" },

  // Database
  { owner: "prisma", name: "prisma", category: "Database" },
  { owner: "drizzle-team", name: "drizzle-orm", category: "Database" },
  { owner: "supabase", name: "supabase", category: "Database" },
  { owner: "redis", name: "redis", category: "Database" },
  { owner: "postgres", name: "postgres", category: "Database" },

  // Styling & UI Library
  { owner: "tailwindlabs", name: "tailwindcss", category: "Styling" },
  { owner: "shadcn-ui", name: "ui", category: "UI Library" },
  { owner: "mui", name: "material-ui", category: "UI Library" },
  { owner: "chakra-ui", name: "chakra-ui", category: "UI Library" },

  // Build Tool
  { owner: "vitejs", name: "vite", category: "Build Tool" },
  { owner: "evanw", name: "esbuild", category: "Build Tool" },
  { owner: "swc-project", name: "swc", category: "Build Tool" },

  // Testing
  { owner: "vitest-dev", name: "vitest", category: "Testing" },
  { owner: "microsoft", name: "playwright", category: "Testing" },
  { owner: "facebook", name: "jest", category: "Testing" },

  // DevOps & Infrastructure
  { owner: "docker", name: "cli", category: "DevOps" },
  { owner: "kubernetes", name: "kubernetes", category: "DevOps" },
  { owner: "hashicorp", name: "terraform", category: "DevOps" },
] as const;
