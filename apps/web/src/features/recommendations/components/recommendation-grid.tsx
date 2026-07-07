import type { Recommendation } from "@openforge/recommendation-engine";
import { RecommendationCard } from "./recommendation-card";

interface RecommendationGridProps {
  recommendations: Recommendation[];
}

export function RecommendationGrid({ recommendations }: RecommendationGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {recommendations.map((rec) => (
        <RecommendationCard key={rec.issueId} recommendation={rec} />
      ))}
    </div>
  );
}
