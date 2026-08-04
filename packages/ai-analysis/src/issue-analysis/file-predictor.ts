export interface PredictedFile {
  path: string;
  fileType: "source" | "test" | "config" | "docs" | "other";
}

export function predictFileDetails(likelyFiles: string[]): PredictedFile[] {
  return likelyFiles.map((path) => {
    const lower = path.toLowerCase();
    let fileType: PredictedFile["fileType"] = "source";

    if (lower.includes("test") || lower.includes("spec")) {
      fileType = "test";
    } else if (lower.endsWith(".json") || lower.endsWith(".yaml") || lower.endsWith(".toml") || lower.endsWith(".config.js")) {
      fileType = "config";
    } else if (lower.endsWith(".md") || lower.includes("docs")) {
      fileType = "docs";
    }

    return {
      path,
      fileType,
    };
  });
}
