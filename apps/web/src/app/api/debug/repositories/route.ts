import { getRepositories } from "@openforge/github-client";
import { standardResponse, errorResponse } from "@/lib/api-helper";
import { checkDebugAccess } from "@/lib/debug-access";

/**
 * @openapi
 * /api/debug/repositories:
 *   get:
 *     summary: Retrieve debug repositories info (dev only)
 *     responses:
 *       200:
 *         description: Success
 */
export async function GET(request?: Request) {
  const accessError = checkDebugAccess(request);
  if (accessError) return accessError;

  try {
    const data = await getRepositories("stars:>1000 sort:stars-desc");
    return standardResponse(data);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
