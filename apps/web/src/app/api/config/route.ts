import { standardResponse } from "@/lib/api-helper";
import { AI_CONFIG } from "@openforge/config";

/**
 * @openapi
 * /api/config:
 *   get:
 *     summary: Retrieve whitelisted client configuration values
 *     responses:
 *       200:
 *         description: Success
 */
export async function GET() {
  return standardResponse({
    aiProvider: AI_CONFIG.provider,
    model: AI_CONFIG.model,
    appName: "OpenForge"
  });
}
