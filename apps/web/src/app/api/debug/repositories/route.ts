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
function checkDebugAccess(request?: Request): Response | null {
  if (env.NODE_ENV === "production") {
    return errorResponse("Forbidden in production mode", 403);
  }

  if (env.DEBUG_API_SECRET && env.DEBUG_API_SECRET.trim() !== "") {
    const providedSecret = request?.headers.get("x-debug-secret");
    if (providedSecret !== env.DEBUG_API_SECRET) {
      return errorResponse("Unauthorized", 401);
    }
  }

  return null;
}

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

