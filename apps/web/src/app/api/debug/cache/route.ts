import { standardResponse } from "@/lib/api-helper";
import { checkDebugAccess } from "@/lib/debug-access";
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
export async function GET(request?: Request) {
  const accessError = checkDebugAccess(request);
  if (accessError) return accessError;

  return standardResponse({
    cacheType: "InMemoryLRUCache",
    activeEntriesCount: AnalysisCache.size,
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
export async function POST(request?: Request) {
  const accessError = checkDebugAccess(request);
  if (accessError) return accessError;

  AnalysisCache.clear?.();
  return standardResponse({
    success: true,
    message: "Cache flushed successfully",
  });
}
