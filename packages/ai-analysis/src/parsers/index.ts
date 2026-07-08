import { z } from "zod";

/**
 * Parse a raw AI response string into a Zod-validated object.
 * Handles common AI quirks: markdown code fences, trailing commas, etc.
 */
export function parseAIResponse<T>(raw: string, schema: z.ZodSchema<T>): T {
  // Strip markdown code fences if present
  let cleaned = raw.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "");
  cleaned = cleaned.trim();

  // Try to extract JSON object from text
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    cleaned = jsonMatch[0];
  }

  const parsed = JSON.parse(cleaned);
  return schema.parse(parsed);
}
