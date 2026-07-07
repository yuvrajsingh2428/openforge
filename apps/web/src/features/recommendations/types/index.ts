import type { Recommendation } from "@openforge/recommendation-engine";
import type { RecommendationSortKey, RecommendationSortDirection } from "./sort";

export type { Recommendation, RecommendationSortKey, RecommendationSortDirection };

export interface RecommendationFiltersState {
  search: string;
  repository: string;
  language: string;
  difficulty: string;
  category: string;
  minScore: number;
  sortKey: RecommendationSortKey;
  sortDirection: RecommendationSortDirection;
}

export const DEFAULT_RECOMMENDATION_FILTERS: RecommendationFiltersState = {
  search: "",
  repository: "",
  language: "",
  difficulty: "",
  category: "",
  minScore: 0,
  sortKey: "score",
  sortDirection: "desc",
};
