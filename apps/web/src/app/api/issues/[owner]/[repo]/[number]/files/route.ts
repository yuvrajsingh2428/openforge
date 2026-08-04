import { standardResponse, errorResponse } from "@/lib/api-helper";
import { analyzeIssue, predictFileDetails } from "@openforge/ai-analysis";

/**
 * @openapi
 * /api/issues/{owner}/{repo}/{number}/files:
 *   get:
 *     summary: Retrieve predicted files involved in fixing the issue
 *     responses:
 *       200:
 *         description: Success
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ owner: string; repo: string; number: string }> },
) {
  try {
    const { owner, repo, number } = await params;
    const issueNumber = parseInt(number, 10);

    if (!owner || !repo || isNaN(issueNumber)) {
      return errorResponse("Invalid parameter values. Requires owner, repo, and numeric issue number.", 400);
    }

    const result = await analyzeIssue(owner, repo, issueNumber);

    if (!result.success || !result.data) {
      return errorResponse(result.error || "Failed to predict files", 500);
    }

    const likelyFiles = result.data.likelyFiles ?? [];
    const detailedFiles = predictFileDetails(likelyFiles);

    return standardResponse(
      {
        likelyFiles,
        detailedFiles,
      },
      200,
      {
        cached: result.cached,
        model: result.model,
        durationMs: result.durationMs,
      },
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error predicting files";
    return errorResponse(message, 500);
  }
}
