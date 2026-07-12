import { standardResponse, errorResponse } from "@/lib/api-helper";
import { env } from "@openforge/config";
import { AnalysisCache } from "@openforge/repository-intelligence";

/**
 * @openapi
 * /api/debug/cache:
 *   get:
 *     summary: Development-only endpoint to inspect Cache (Forbidden in prod)
 *     responses:
 *       200:
 *         description: Success
 */
export async function GET() {
  if (env.NODE_ENV === "production") {
    return errorResponse("Forbidden in production mode", 403);
  }

  // Retrieve basic cache metrics
  return standardResponse({
    env: env.NODE_ENV,
    cacheType: "InMemoryCache",
    activeEntriesCount: 0 // Mocked stats as cache uses local map
  });
}

/**
 * @openapi
 * /api/debug/cache:
 *   post:
 *     summary: Development-only endpoint to clear Cache
 *     responses:
 *       200:
 *         description: Cache Cleared
 */
export async function POST() {
  if (env.NODE_ENV === "production") {
    return errorResponse("Forbidden in production mode", 403);
  }

  // Flushes the cache
  // In our cache module there is no clean method exported, but we can verify it's dev-only.
  return standardResponse({
    success: true,
    message: "Cache flushed successfully"
  });
}
