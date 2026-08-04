import type { LearningResource } from "../schemas/issue-analysis";

export interface FormattedResource {
  title: string;
  url?: string;
  reason: string;
  searchUrl: string;
}

export function generateFormattedResources(resources: LearningResource[], repoLanguage?: string | null): FormattedResource[] {
  return resources.map((res) => {
    const query = encodeURIComponent(`${res.title} ${repoLanguage || ""} documentation`);
    const searchUrl = res.url || `https://www.google.com/search?q=${query}`;

    return {
      title: res.title,
      url: res.url,
      reason: res.reason,
      searchUrl,
    };
  });
}
