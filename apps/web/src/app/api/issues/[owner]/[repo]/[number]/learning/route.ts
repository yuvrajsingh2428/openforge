import { standardResponse, errorResponse } from "@/lib/api-helper";
import { analyzeIssue, generateLearningRoadmap, generateFormattedResources } from "@openforge/ai-analysis";

/**
 * @openapi
 * /api/issues/{owner}/{repo}/{number}/learning:
 *   get:
 *     summary: Retrieve learning roadmap and resources for the issue
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
      return errorResponse(result.error || "Failed to generate learning roadmap", 500);
    }

    const roadmap = generateLearningRoadmap(result.data.requiredSkills, result.data.conceptsToLearn);
    const resources = generateFormattedResources(result.data.learningResources);

    return standardResponse(
      {
        requiredSkills: result.data.requiredSkills,
        conceptsToLearn: result.data.conceptsToLearn,
        roadmap,
        learningResources: resources,
        estimatedHours: result.data.estimatedHours,
      },
      200,
      {
        cached: result.cached,
        model: result.model,
        durationMs: result.durationMs,
      },
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error generating learning roadmap";
    return errorResponse(message, 500);
  }
}
