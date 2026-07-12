import { standardResponse } from "@/lib/api-helper";
import { env } from "@openforge/config";

/**
 * @openapi
 * /api/version:
 *   get:
 *     summary: Retrieve application version info
 *     responses:
 *       200:
 *         description: Success
 */
export async function GET() {
  return standardResponse({
    version: "1.0.0",
    name: "OpenForge",
    environment: env.NODE_ENV
  });
}

