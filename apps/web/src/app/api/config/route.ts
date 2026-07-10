import { standardResponse } from "@/lib/api-helper";
import { AI_CONFIG } from "@openforge/config";

/**
 * @openapi
 * /api/config:
 *   get:
 *     summary: Retrieve Whitelisted client configuration values
 *     responses:
 *       200:
 *         description: Success
 */
export async function GET() {
  return standardResponse({
    model: AI_CONFIG.model,
    ollamaBaseUrl: AI_CONFIG.ollamaBaseUrl,
    appName: "OpenForge"
  });
}
