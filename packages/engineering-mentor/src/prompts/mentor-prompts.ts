export const RepositoryPromptBuilder = (overview: string, architecture: any[]) => `
[REPOSITORY ARCHITECTURE & OVERVIEW]
Overview: ${overview}
Detected Architectures:
${architecture.map(a => `- ${a.name} (Confidence: ${(a.confidence * 100).toFixed(0)}%) reasons: ${a.reasons.join(", ")}`).join("\n")}
`;

export const ReadingOrderPromptBuilder = (readingOrder: any[]) => `
[DETERMINISTIC READING ORDER]
The contributor should read the following files in this order. Explain WHY each file is critical to read first:
${readingOrder.map((step, idx) => `${idx + 1}. Path: ${step.path} (${step.type}) - Description: ${step.description}`).join("\n")}
`;

export const StrategyPromptBuilder = (steps: any[]) => `
[IMPLEMENTATION STRATEGY STAGE GUIDELINES]
Generate strategy stages detailing how to resolve the issue based on:
${steps.map((s, idx) => `Stage ${idx + 1}: ${s.title} (${s.description})`).join("\n")}
Strictly follow the staged guidelines and explain details on what to look for at each stage.
`;

export const DebuggingPromptBuilder = (directories: string[], entrypoints: string[]) => `
[DEBUGGING GUIDE CONTEXT]
Core Directories: ${directories.join(", ")}
Entrypoints: ${entrypoints.join(", ")}
Explain root causes, files to observe, logs to watch, and verification steps.
`;

export const ChecklistPromptBuilder = () => `
[REVIEW CHECKLIST STAGE]
Generate a validation checklist. Group checklist items by category (Tests, Formatting, Documentation, Edge Cases, Backward Compatibility).
Provide explicit verification methods for each item.
`;

export const LearningPromptBuilder = () => `
[LEARNING OUTCOMES STAGE]
Generate learning outcomes outlining what the contributor will gain in patterns, frameworks, and architecture.
Also list common mistakes to avoid.
`;

export const BaseSystemPrompt = `
You are an Elite AI Engineering Mentor assisting an open-source contributor.
Your educational goal is to teach the contributor how to solve the issue, understand the architecture, and prevent regressions.

CRITICAL DIRECTIVES:
1. DO NOT GENERATE CODE SNIPPETS, PATCHES, PULL REQUESTS, OR DIRECT IMPLEMENTATION CODE.
2. DO NOT WRITE CONCRETE CODE MODIFICATIONS.
3. FOCUS PURELY ON ARCHITECTURAL GUIDANCE, CONCEPT EXPLANATIONS, STRATEGY, PITFALLS, AND REVIEW CRITERIA.
4. Output your response as a valid, structured JSON object matching the requested schema.
`;
