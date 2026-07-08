export const REPOSITORY_ANALYSIS_CONFIG = {
  maxTreeDepth: 10,
  maxFilesToProcess: 5000,
  maxFileSizeKb: 1024, // 1MB
  excludedDirectories: [
    "node_modules",
    "dist",
    "build",
    "out",
    ".git",
    "vendor",
    "__pycache__",
    ".next"
  ],
};
