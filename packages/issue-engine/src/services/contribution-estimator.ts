import { ContributionEstimate, ContributionInput, ContributionSize } from "../types";

export class ContributionEstimator {
  public estimate(input: ContributionInput): ContributionEstimate {
    const reasons: string[] = [];
    let score = 0;
    let confidence = 0.5;

    // 1. Labels heuristic
    const labels = input.labels.map(l => l.toLowerCase());
    if (labels.some(l => l.includes('good first issue') || l.includes('documentation') || l.includes('typo'))) {
      score += 1; // XS/S
      confidence += 0.3;
      reasons.push("Has beginner-friendly or simple labels (e.g., 'good first issue', 'documentation').");
    } else if (labels.some(l => l.includes('epic') || l.includes('architecture') || l.includes('refactor'))) {
      score += 5; // XL
      confidence += 0.2;
      reasons.push("Has complex labels (e.g., 'epic', 'architecture', 'refactor').");
    } else if (labels.some(l => l.includes('bug'))) {
      score += 2; // S/M
      reasons.push("Bug fixes typically range from Small to Medium.");
    } else if (labels.some(l => l.includes('feature') || l.includes('enhancement'))) {
      score += 3; // M/L
      reasons.push("Feature additions are typically Medium or Large.");
    } else {
      score += 2; // Default M
    }

    // 2. Body length heuristic
    if (input.bodyLength < 200) {
      score -= 0.5;
      reasons.push("Short issue description suggests a smaller scope.");
    } else if (input.bodyLength > 2000) {
      score += 1;
      confidence += 0.1;
      reasons.push("Long, detailed issue description suggests a larger scope.");
    }

    // 3. Comments heuristic (discussion complexity)
    if (input.commentsCount > 20) {
      score += 1;
      reasons.push("High number of comments indicates complex discussion or edge cases.");
    }

    // 4. Issue age heuristic
    if (input.issueAgeDays > 180) {
      score += 0.5;
      reasons.push("Issue has been open for a long time, potentially indicating hidden complexity.");
    }

    // 5. Assignees heuristic
    if (input.assigneesCount > 1) {
      score += 1;
      reasons.push("Multiple assignees suggest a larger piece of work.");
    }

    // Determine final size based on score
    let size: ContributionSize = "M";
    let estimatedEffortDays = 5;
    
    if (score <= 1.5) {
      size = "XS";
      estimatedEffortDays = 0.5;
    } else if (score <= 2.5) {
      size = "S";
      estimatedEffortDays = 2;
    } else if (score <= 3.5) {
      size = "M";
      estimatedEffortDays = 5;
    } else if (score <= 4.5) {
      size = "L";
      estimatedEffortDays = 14;
    } else {
      size = "XL";
      estimatedEffortDays = 30;
    }

    return {
      size,
      confidence: Math.min(1, Math.max(0, confidence)),
      estimatedEffortDays,
      reasons
    };
  }
}
