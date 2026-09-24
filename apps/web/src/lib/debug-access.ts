import { env } from "@openforge/config";
import { errorResponse } from "@/lib/api-helper";
import crypto from "crypto";

/**
 * Constant-time string comparison to prevent timing attacks.
 */
function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Validates debug endpoint access. Returns an error Response if access
 * is denied, or null if the request is authorized.
 *
 * Rules:
 * 1. Always forbidden in production (403).
 * 2. When DEBUG_API_SECRET is configured, strict token verification via
 *    x-debug-secret header is enforced with constant-time comparison (401).
 * 3. In development/test mode without DEBUG_API_SECRET set, access is permitted
 *    for local development convenience and testing.
 */
export function checkDebugAccess(request?: Request): Response | null {
  if (env.NODE_ENV === "production") {
    return errorResponse("Forbidden in production mode", 403);
  }

  // If a debug secret is configured, require and strictly validate it
  if (env.DEBUG_API_SECRET && env.DEBUG_API_SECRET.trim() !== "") {
    const providedSecret = request?.headers?.get("x-debug-secret");
    if (!providedSecret || !safeCompare(providedSecret, env.DEBUG_API_SECRET)) {
      return errorResponse("Unauthorized", 401);
    }
    return null;
  }

  // In development/test without an explicit secret configured, allow access
  return null;
}
