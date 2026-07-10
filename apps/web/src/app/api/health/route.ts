import { standardResponse } from "@/lib/api-helper";

/**
 * @openapi
 * /api/health:
 *   get:
 *     summary: System health check
 *     responses:
 *       200:
 *         description: System operational
 */
export async function GET() {
  return standardResponse({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
}
