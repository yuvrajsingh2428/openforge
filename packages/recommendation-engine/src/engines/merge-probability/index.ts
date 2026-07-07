import type { ScoringEngine, ScoringSignals, FactorScore } from "../../types";
import { clampScore } from "../../utils/signals";

export const mergeProbabilityEngine: ScoringEngine = {
  name: "Merge Probability",
  score(signals: ScoringSignals): FactorScore {
    let score = 40;
    const reasons: string[] = [];
    const now = new Date();

    // Issue state
    if (signals.issueState !== "OPEN") {
      score -= 20;
      reasons.push("Issue is closed — merge unlikely for new contributions");
    }

    // Issue freshness: newer issues are more likely to accept PRs
    const ageMs = now.getTime() - signals.issueCreatedAt.getTime();
    const ageDays = ageMs / (1000 * 60 * 60 * 24);

    if (ageDays < 14) {
      score += 20;
      reasons.push("Recently created issue — high merge window");
    } else if (ageDays < 60) {
      score += 12;
      reasons.push("Recent issue within active development window");
    } else if (ageDays < 180) {
      score += 5;
      reasons.push("Moderately aged issue");
    } else {
      score -= 5;
      reasons.push("Older issue — may have reduced priority");
    }

    // Recent update suggests active interest
    if (signals.issueUpdatedAt) {
      const updateAgeDays = (now.getTime() - signals.issueUpdatedAt.getTime()) / (1000 * 60 * 60 * 24);
      if (updateAgeDays < 7) {
        score += 10;
        reasons.push("Recently updated — active attention from maintainers");
      } else if (updateAgeDays < 30) {
        score += 5;
        reasons.push("Updated within the last month");
      }
    }

    // Label quality: good first issue + help wanted = high merge probability
    const hasContribLabel = signals.issueLabels.some((l) =>
      ["good first issue", "good-first-issue", "help wanted", "help-wanted", "contributions welcome"].some((cl) => l.includes(cl))
    );
    if (hasContribLabel) {
      score += 15;
      reasons.push("Contribution-friendly labels signal willingness to merge");
    }

    // Comment count: moderate discussion suggests progress, too much might mean conflict
    if (signals.issueCommentCount >= 2 && signals.issueCommentCount <= 10) {
      score += 5;
      reasons.push("Healthy discussion indicates active progress");
    } else if (signals.issueCommentCount > 20) {
      score -= 5;
      reasons.push("High comment count may indicate complex decisions");
    }

    // Not assigned = more likely to accept external PRs
    if (signals.issueAssigneeCount === 0) {
      score += 5;
      reasons.push("Unassigned — open for external contributors");
    }

    if (reasons.length === 0) {
      reasons.push("Standard merge probability");
    }

    return {
      score: clampScore(score),
      reasons,
      confidence: 0.7,
    };
  },
};
