import { z } from "zod";
import { searchRepositories } from '@openforge/github-client';
import { standardResponse, errorResponse, validateRequest } from "@/lib/api-helper";

const QuerySchema = z.object({
  q: z.string().default(""),
  after: z.string().optional(),
  language: z.string().optional(),
  architecture: z.string().optional(),
  technology: z.string().optional(),
  testingFramework: z.string().optional(),
  buildTool: z.string().optional(),
  packageManager: z.string().optional(),
  database: z.string().optional(),
  ci: z.string().optional()
});

/**
 * @openapi
 * /api/search/repositories:
 *   get:
 *     summary: Search repositories on GitHub with filters
 *     responses:
 *       200:
 *         description: Success
 */
export async function GET(request: Request) {
  const result = await validateRequest(request, QuerySchema);
  if (!result.success) {
    return result.errorResponse;
  }

  const {
    q, after, language, architecture, technology,
    testingFramework, buildTool, packageManager, database, ci
  } = result.data;

  let fullQuery = q;
  if (language) fullQuery += ` language:${language}`;
  if (technology) fullQuery += ` ${technology}`;
  if (testingFramework) fullQuery += ` ${testingFramework}`;
  if (buildTool) fullQuery += ` ${buildTool}`;
  if (packageManager) fullQuery += ` ${packageManager}`;
  if (database) fullQuery += ` ${database}`;
  if (ci) fullQuery += ` ${ci}`;

  if (architecture === "Monorepo") {
    fullQuery += " turbo or lerna or pnpm-workspace";
  }

  if (!fullQuery.trim()) {
    return errorResponse("Query parameter 'q' or filters are required", 400);
  }

  try {
    const results = await searchRepositories(fullQuery.trim(), 20, after || undefined);
    return standardResponse(results);
  } catch (error: any) {
    console.error('Error searching repositories:', error);
    return errorResponse('Failed to search repositories', 500);
  }
}
