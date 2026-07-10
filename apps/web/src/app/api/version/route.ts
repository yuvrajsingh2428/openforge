import { standardResponse } from "@/lib/api-helper";

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
    environment: process.env.NODE_ENV || "development"
  });
}
