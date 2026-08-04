export type DifficultyBadgeLevel = "Easy" | "Medium" | "Hard";

export interface DifficultyExplanation {
  level: DifficultyBadgeLevel;
  label: string;
  badgeVariant: "default" | "secondary" | "destructive" | "outline";
  description: string;
}

export function explainDifficulty(difficulty: DifficultyBadgeLevel): DifficultyExplanation {
  switch (difficulty) {
    case "Easy":
      return {
        level: "Easy",
        label: "Good First Issue",
        badgeVariant: "secondary",
        description: "Well-scoped task suitable for beginners or developers new to this project.",
      };
    case "Medium":
      return {
        level: "Medium",
        label: "Moderate Effort",
        badgeVariant: "default",
        description: "Requires understanding multiple module interactions or modest architectural context.",
      };
    case "Hard":
      return {
        level: "Hard",
        label: "Complex Challenge",
        badgeVariant: "destructive",
        description: "Involves core architecture, performance, security, or non-trivial breaking changes.",
      };
    default:
      return {
        level: "Medium",
        label: "Moderate Effort",
        badgeVariant: "outline",
        description: "Standard contribution effort.",
      };
  }
}
