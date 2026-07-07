import type { ScoringEngine, ScoringSignals, FactorScore } from "../../types";
import { clampScore } from "../../utils/signals";

export const impactEngine: ScoringEngine = {
  name: "Impact",
  score(signals: ScoringSignals): FactorScore {
    let score = 20;
    const reasons: string[] = [];

    // Repository popularity (stars)
    if (signals.repoStars > 50000) {
      score += 30;
      reasons.push("Extremely popular repository with massive user base");
    } else if (signals.repoStars > 10000) {
      score += 22;
      reasons.push("Popular repository with large user base");
    } else if (signals.repoStars > 1000) {
      score += 12;
      reasons.push("Established repository with solid community");
    } else if (signals.repoStars > 100) {
      score += 5;
      reasons.push("Growing repository");
    }

    // Fork count suggests downstream impact
    if (signals.repoForks > 5000) {
      score += 10;
      reasons.push("High fork count — changes affect many downstream projects");
    } else if (signals.repoForks > 1000) {
      score += 6;
      reasons.push("Significant fork ecosystem");
    }

    // Issue reactions: high reactions mean many people care
    if (signals.issueReactionCount > 10) {
      score += 12;
      reasons.push("Issue has strong community interest");
    } else if (signals.issueReactionCount > 3) {
      score += 6;
      reasons.push("Issue has community support");
    }

    // Bug fix labels: fixing bugs has direct user impact
    const isBug = signals.issueLabels.some((l) =>
      ["bug", "fix", "defect", "error", "crash", "regression"].some((b) => l.includes(b))
    );
    if (isBug) {
      score += 8;
      reasons.push("Bug fix directly improves user experience");
    }

    // Open issues count: more issues = active project
    if (signals.repoOpenIssues > 500) {
      score += 5;
      reasons.push("Active project with high contribution demand");
    }

    if (reasons.length === 0) {
      reasons.push("Standard impact potential");
    }

    return {
      score: clampScore(score),
      reasons,
      confidence: 0.8,
    };
  },
};
