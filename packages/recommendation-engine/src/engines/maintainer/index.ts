import { DIFFICULTY_THRESHOLDS } from "@openforge/config";
import type { ScoringEngine, ScoringSignals, FactorScore } from "../../types";
import { clampScore } from "../../utils/signals";

export const maintainerEngine: ScoringEngine = {
  name: "Maintainer Friendliness",
  score(signals: ScoringSignals): FactorScore {
    let score = 30;
    const reasons: string[] = [];

    // Good first issue labels
    const isGoodFirstIssue = signals.issueLabels.some((l) =>
      DIFFICULTY_THRESHOLDS.goodFirstIssueLabels.some((gfi) => l.includes(gfi))
    );
    if (isGoodFirstIssue) {
      score += 25;
      reasons.push("Labeled as good first issue — maintainers welcome newcomers");
    }

    // Help wanted labels
    const isHelpWanted = signals.issueLabels.some((l) =>
      DIFFICULTY_THRESHOLDS.helpWantedLabels.some((hw) => l.includes(hw))
    );
    if (isHelpWanted) {
      score += 15;
      reasons.push("Maintainers actively seeking contributions");
    }

    // Issue clarity: longer body = better described
    if (signals.issueBody.length > 500) {
      score += 10;
      reasons.push("Well-described issue with clear requirements");
    } else if (signals.issueBody.length > 200) {
      score += 5;
      reasons.push("Reasonably described issue");
    }

    // Comment activity: moderate comments suggest engaged maintainers
    if (signals.issueCommentCount >= 3 && signals.issueCommentCount <= 15) {
      score += 10;
      reasons.push("Active maintainer discussion");
    } else if (signals.issueCommentCount > 15) {
      score += 5;
      reasons.push("High discussion volume — may indicate complexity");
    }

    // Repository health: license present
    if (signals.repoHasLicense) {
      score += 5;
      reasons.push("Repository has a license — open contribution model");
    }

    // Milestone set: suggests organized project management
    if (signals.issueMilestone) {
      score += 5;
      reasons.push("Issue is part of a planned milestone");
    }

    if (reasons.length === 0) {
      reasons.push("Standard maintainer engagement");
    }

    return {
      score: clampScore(score),
      reasons,
      confidence: 0.7,
    };
  },
};
