import { DIFFICULTY_THRESHOLDS } from "@openforge/config";
import type { ScoringEngine, ScoringSignals, FactorScore } from "../../types";
import { clampScore } from "../../utils/signals";

export const learningEngine: ScoringEngine = {
  name: "Learning",
  score(signals: ScoringSignals): FactorScore {
    let score = 40;
    const reasons: string[] = [];

    // Architectural exposure: cross-module issues tend to teach more
    const bodyLength = signals.issueBody.length;
    if (bodyLength > 1000) {
      score += 15;
      reasons.push("Detailed issue description suggests architectural complexity");
    } else if (bodyLength > 400) {
      score += 8;
      reasons.push("Moderate issue description indicates reasonable scope");
    }

    // Testing opportunities: look for test-related signals
    const hasTestMention = /\b(test|spec|coverage|jest|vitest|cypress|playwright)\b/i.test(
      signals.issueTitle + " " + signals.issueBody
    );
    if (hasTestMention) {
      score += 12;
      reasons.push("Testing opportunities available");
    }

    // Documentation quality
    const isDocLabel = signals.issueLabels.some((l) =>
      DIFFICULTY_THRESHOLDS.documentationLabels.some((dl) => l.includes(dl))
    );
    if (isDocLabel) {
      score += 5;
      reasons.push("Documentation exposure");
    }

    // Feature work teaches more than bug fixes
    const isFeature = signals.issueLabels.some((l) =>
      DIFFICULTY_THRESHOLDS.featureLabels.some((fl) => l.includes(fl))
    );
    if (isFeature) {
      score += 10;
      reasons.push("Feature work provides high learning value");
    }

    // New technology exposure
    const techKeywords = ["migration", "refactor", "redesign", "architecture", "api", "graphql", "database", "infrastructure"];
    const hasTechExposure = techKeywords.some((kw) =>
      signals.issueTitle.toLowerCase().includes(kw) || signals.issueBody.toLowerCase().includes(kw)
    );
    if (hasTechExposure) {
      score += 10;
      reasons.push("Exposure to core infrastructure or technology");
    }

    // Repository maturity: established repos teach industry practices
    if (signals.repoStars > 10000) {
      score += 8;
      reasons.push("High-quality codebase from a popular repository");
    } else if (signals.repoStars > 1000) {
      score += 4;
      reasons.push("Established repository with community standards");
    }

    // Cross-module impact
    const crossModuleKeywords = ["multiple", "across", "component", "module", "package", "integration"];
    const hasCrossModule = crossModuleKeywords.some((kw) =>
      signals.issueBody.toLowerCase().includes(kw)
    );
    if (hasCrossModule) {
      score += 6;
      reasons.push("Cross-module impact increases architectural understanding");
    }

    if (reasons.length === 0) {
      reasons.push("Standard learning opportunity");
    }

    return {
      score: clampScore(score),
      reasons,
      confidence: bodyLength > 200 ? 0.8 : 0.5,
    };
  },
};
