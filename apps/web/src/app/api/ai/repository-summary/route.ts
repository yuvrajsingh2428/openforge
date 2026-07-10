import { z } from "zod";
import { generateRepositorySummary } from "@openforge/ai-analysis";
import { standardResponse, errorResponse, validateRequest } from "@/lib/api-helper";

const RepositoryContextSchema = z.object({
  name: z.string().min(1),
  fullName: z.string().min(1),
  description: z.string().default(""),
  language: z.string().nullable().default(null),
  stars: z.number().default(0),
  forks: z.number().default(0),
  topics: z.array(z.string()).default([]),
  hasLicense: z.boolean().default(false),
  openIssueCount: z.number().default(0)
});

/**
 * @openapi
 * /api/ai/repository-summary:
 *   post:
 *     summary: Generate summary of repository
 *     responses:
 *       200:
 *         description: Success
 */
export async function POST(request: Request) {
  const result = await validateRequest(request, RepositoryContextSchema);
  if (!result.success) {
    return result.errorResponse;
  }

  try {
    const analysis = await generateRepositorySummary(result.data);
    if (!analysis.success) {
      return errorResponse(analysis.error || "Generation failed", 500);
    }
    return standardResponse(analysis.data, 200, {
      cached: analysis.cached,
      model: analysis.model,
      durationMs: analysis.durationMs
    });
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
