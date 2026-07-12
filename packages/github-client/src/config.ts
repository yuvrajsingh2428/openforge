import { env } from "@openforge/config";

/**
 * Returns the GitHub configuration.
 *
 * GITHUB_TOKEN is optional at startup to allow UI-only development.
 * This function throws a descriptive error if the token is missing
 * when GitHub API operations are actually attempted.
 */
export function getConfig() {
  const token = env.GITHUB_TOKEN;

  if (!token) {
    throw new Error(
      "GITHUB_TOKEN is required for GitHub API operations. " +
        "Set it in your .env file. " +
        "See: https://github.com/settings/tokens"
    );
  }

  return { GITHUB_TOKEN: token };
}
