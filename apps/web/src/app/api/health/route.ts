import { standardResponse } from "@/lib/api-helper";
import { getAIProvider } from "@openforge/ai-analysis";
import { AI_CONFIG } from "@openforge/config";

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
  let aiStatus;
  try {
    const provider = getAIProvider();
    const availability = await provider.isAvailable();
    aiStatus = {
      provider: availability.provider,
      connected: availability.available,
      configured: true,
      model: availability.model ?? AI_CONFIG.model,
      message: availability.message,
    };
  } catch {
    aiStatus = {
      provider: AI_CONFIG.provider,
      connected: false,
      configured: true,
      model: AI_CONFIG.model,
      message: "Failed to check AI provider availability",
    };
  }

  return standardResponse({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    ai: aiStatus,
  });
}
