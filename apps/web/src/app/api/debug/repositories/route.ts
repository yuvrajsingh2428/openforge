import { getRepositories } from "@openforge/github-client";
import { env } from "@openforge/config";
import { standardResponse, errorResponse } from "@/lib/api-helper";

/**
 * @openapi
 * /api/debug/repositories:
 *   get:
 *     summary: Retrieve debug repositories info (dev only)
 *     responses:
 *       200:
 *         description: Success
 */
export async function GET() {
  if (env.NODE_ENV === "production") {
    return errorResponse("Forbidden in production mode", 403);
  }

  try {
    const data = await getRepositories("stars:>1000 sort:stars-desc");
    return standardResponse(data);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}

