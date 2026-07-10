import { z } from "zod";
import { getIssues } from "@openforge/github-client";
import { standardResponse, errorResponse, validateRequest } from "@/lib/api-helper";

const QuerySchema = z.object({
  q: z.string().min(1, "Query string is required"),
  first: z.preprocess((val) => parseInt(val as string, 10), z.number().default(10)),
  after: z.string().optional()
});

/**
 * @openapi
 * /api/search/issues:
 *   get:
 *     summary: Search issues on GitHub
 *     parameters:
 *       - name: q
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *       - name: first
 *         in: query
 *         schema:
 *           type: integer
 *       - name: after
 *         in: query
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
export async function GET(request: Request) {
  const result = await validateRequest(request, QuerySchema);
  if (!result.success) {
    return result.errorResponse;
  }

  try {
    const { q, first, after } = result.data;
    const data = await getIssues(q, first, after);
    return standardResponse(data);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
