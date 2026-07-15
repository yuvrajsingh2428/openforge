import { z } from "zod";
import { ContributionEstimator } from '@openforge/issue-engine';
import { getIssue } from '@openforge/github-client';
import { standardResponse, errorResponse, validateRequest } from "@/lib/api-helper";

const estimator = new ContributionEstimator();

const QuerySchema = z.object({
  owner: z.string().min(1, "Owner is required"),
  repo: z.string().min(1, "Repo is required"),
  number: z.preprocess((val) => {
    if (val === undefined || val === null || val === "") return undefined;
    const parsed = parseInt(val as string, 10);
    return isNaN(parsed) ? undefined : parsed;
  }, z.number({ message: "Issue number is required" }))
});

/**
 * @openapi
 * /api/contribution-estimate:
 *   get:
 *     summary: Estimate contribution size
 *     responses:
 *       200:
 *         description: Success
 */
export async function GET(request: Request) {
  const result = await validateRequest(request, QuerySchema);
  if (!result.success) {
    return result.errorResponse;
  }

  const { owner, repo, number } = result.data;

  try {
    const data = await getIssue(owner, repo, number);
    
    if (!data) {
      return errorResponse('Issue not found', 404);
    }

    const { issue } = data;
    const labels = issue.labels?.nodes?.map((l: any) => l.name) || [];
    const ageDays = Math.floor((new Date().getTime() - new Date(issue.createdAt).getTime()) / (1000 * 60 * 60 * 24));
    
    const input = {
      labels,
      bodyLength: issue.body?.length || 0,
      commentsCount: issue.comments?.totalCount || 0,
      issueAgeDays: ageDays,
      repositoryMaturityScore: 80,
      assigneesCount: issue.assignees?.nodes?.length || 0,
    };

    const estimate = estimator.estimate(input);
    return standardResponse(estimate);
  } catch (error: any) {
    console.error('Error estimating contribution:', error);
    return errorResponse('Failed to estimate contribution size', 500);
  }
}
