import { standardResponse } from "@/lib/api-helper";

const TECHNOLOGIES = [
  "TypeScript",
  "JavaScript",
  "Go",
  "Python",
  "Rust",
  "Java",
  "Ruby",
  "PHP",
  "HTML",
  "CSS",
  "Next.js",
  "Nuxt",
  "Vue",
  "Angular",
  "Vite",
  "Webpack",
  "Turborepo",
  "GitHub Actions",
  "GitLab CI",
  "Travis CI",
  "Jest",
  "Vitest",
  "Playwright",
  "Cypress"
];

/**
 * @openapi
 * /api/search/technologies:
 *   get:
 *     summary: Retrieve deterministic list of technology options
 *     responses:
 *       200:
 *         description: Success
 */
export async function GET() {
  return standardResponse(TECHNOLOGIES);
}
