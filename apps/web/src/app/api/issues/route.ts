import { getIssuesFromCuratedRepos } from "@openforge/github-client";
import { CURATED_REPOSITORIES } from "@openforge/config";
import { standardResponse, errorResponse } from "@/lib/api-helper";

/**
 * @openapi
 * /api/issues:
 *   get:
 *     summary: Retrieve issues from curated repositories
 *     responses:
 *       200:
 *         description: Success
 */
export async function GET() {
  try {
    const issues = await getIssuesFromCuratedRepos(CURATED_REPOSITORIES, 5);
    return standardResponse(issues);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch issues";
    return errorResponse(message, 500);
  }
}
