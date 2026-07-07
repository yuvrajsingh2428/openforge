import { AI_KEYWORDS } from "@openforge/config";
import type { ScoringEngine, ScoringSignals, FactorScore } from "../../types";
import { clampScore } from "../../utils/signals";

export const aiRelevanceEngine: ScoringEngine = {
  name: "AI Relevance",
  score(signals: ScoringSignals): FactorScore {
    const reasons: string[] = [];
    const text = `${signals.issueTitle} ${signals.issueBody} ${signals.issueLabels.join(" ")} ${signals.repoTopics.join(" ")} ${signals.repoDescription}`.toLowerCase();

    let matchCount = 0;
    const matchedKeywords: string[] = [];

    for (const keyword of AI_KEYWORDS) {
      const pattern = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
      if (pattern.test(text)) {
        matchCount++;
        matchedKeywords.push(keyword);
      }
    }

    let score: number;

    if (matchCount === 0) {
      score = 10;
      reasons.push("No AI/ML-related signals detected");
    } else if (matchCount <= 2) {
      score = 40;
      reasons.push(`Mentions: ${matchedKeywords.join(", ")}`);
    } else if (matchCount <= 5) {
      score = 65;
      reasons.push(`Multiple AI topics: ${matchedKeywords.slice(0, 5).join(", ")}`);
    } else {
      score = 85;
      reasons.push(`Strong AI focus: ${matchedKeywords.slice(0, 6).join(", ")}`);
    }

    // Boost for AI-focused repo topics
    const aiTopics = signals.repoTopics.filter((t) =>
      AI_KEYWORDS.some((kw) => t.includes(kw))
    );
    if (aiTopics.length > 0) {
      score += 10;
      reasons.push(`Repository tagged with AI topics: ${aiTopics.join(", ")}`);
    }

    return {
      score: clampScore(score),
      reasons,
      confidence: matchCount > 0 ? 0.9 : 0.7,
    };
  },
};
