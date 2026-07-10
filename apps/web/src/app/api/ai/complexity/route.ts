import { z } from "zod";
import { generateComplexityAnalysis } from "@openforge/ai-analysis";
import { standardResponse, errorResponse, validateRequest } from "@/lib/api-helper";

const IssueContextSchema = z.object({
  repository: z.string().min(1),
  title: z.string().min(1),
  body: z.string().default(""),
  language: z.string().nullable().default(null),
  labels: z.array(z.string()).default([]),
  state: z.string().default("OPEN"),
  commentCount: z.number().default(0)
});

/**
 * @openapi
 * /api/ai/complexity:
 *   post:
 *     summary: Analyze complexity of issue
 *     responses:
 *       200:
 *         description: Success
 */
export async function POST(request: Request) {
  const result = await validateRequest(request, IssueContextSchema);
  if (!result.success) {
    return result.errorResponse;
  }

  try {
    const analysis = await generateComplexityAnalysis(result.data);
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
