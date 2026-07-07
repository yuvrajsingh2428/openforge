import { z } from "zod";

const configSchema = z.object({
  GITHUB_TOKEN: z.string().min(1, "GITHUB_TOKEN is required"),
});

export function getConfig() {
  const parsed = configSchema.safeParse({
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
  });

  if (!parsed.success) {
    throw new Error(
      `Invalid GitHub Client configuration: ${parsed.error.message}`
    );
  }

  return parsed.data;
}
