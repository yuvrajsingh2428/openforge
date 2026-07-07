import type { Recommendation } from "@openforge/recommendation-engine";
import type { RecommendationFiltersState, RecommendationSortKey, RecommendationSortDirection } from "../types";

function matchesSearch(rec: Recommendation, search: string): boolean {
  if (!search) return true;
  const term = search.toLowerCase();
  const repo = rec.repoFullName.toLowerCase();
  const title = rec.issueTitle.toLowerCase();
  const labels = rec.issueLabels.map(l => l.name.toLowerCase()).join(" ");
  const explanation = rec.explanation.summary.toLowerCase();
  return repo.includes(term) || title.includes(term) || labels.includes(term) || explanation.includes(term);
}

function matchesRepository(rec: Recommendation, repository: string): boolean {
  if (!repository) return true;
  return rec.repoFullName === repository;
}

function matchesLanguage(rec: Recommendation, language: string): boolean {
  if (!language) return true;
  return rec.repoLanguage === language;
}

function matchesDifficulty(rec: Recommendation, difficulty: string): boolean {
  if (!difficulty) return true;
  // TODO: Implement difficulty logic when available in recommendation engine
  return true;
}

function matchesCategory(rec: Recommendation, category: string): boolean {
  if (!category) return true;
  return rec.category === category;
}

function matchesMinScore(rec: Recommendation, minScore: number): boolean {
  return rec.overallScore >= minScore;
}

export function filterRecommendations(recs: Recommendation[], filters: RecommendationFiltersState): Recommendation[] {
  return recs.filter((rec) =>
    matchesSearch(rec, filters.search) &&
    matchesRepository(rec, filters.repository) &&
    matchesLanguage(rec, filters.language) &&
    matchesDifficulty(rec, filters.difficulty) &&
    matchesCategory(rec, filters.category) &&
    matchesMinScore(rec, filters.minScore)
  );
}

function getSortValue(rec: Recommendation, key: RecommendationSortKey): string | number {
  switch (key) {
    case "score":
      return rec.overallScore;
    case "learning":
      return rec.breakdown.learning.score;
    case "impact":
      return rec.breakdown.impact.score;
    case "mergeProbability":
      return rec.breakdown.mergeProbability.score;
    case "newest":
    case "oldest":
      return new Date(rec.issueCreatedAt).getTime();
  }
}

export function sortRecommendations(recs: Recommendation[], key: RecommendationSortKey, direction: RecommendationSortDirection): Recommendation[] {
  const sorted = [...recs].sort((a, b) => {
    const aVal = getSortValue(a, key);
    const bVal = getSortValue(b, key);
    if (typeof aVal === "number" && typeof bVal === "number") {
      return aVal - bVal;
    }
    return String(aVal).localeCompare(String(bVal));
  });

  if (key === "newest") return sorted.reverse();
  if (key === "oldest") return sorted;
  return direction === "desc" ? sorted.reverse() : sorted;
}

export function getUniqueRepositories(recs: Recommendation[]): string[] {
  const repos = new Set<string>();
  for (const rec of recs) {
    repos.add(rec.repoFullName);
  }
  return Array.from(repos).sort();
}

export function getUniqueLanguages(recs: Recommendation[]): string[] {
  const langs = new Set<string>();
  for (const rec of recs) {
    if (rec.repoLanguage) {
      langs.add(rec.repoLanguage);
    }
  }
  return Array.from(langs).sort();
}

export function getUniqueCategories(recs: Recommendation[]): string[] {
  const categories = new Set<string>();
  for (const rec of recs) {
    if (rec.category) {
      categories.add(rec.category);
    }
  }
  return Array.from(categories).sort();
}
