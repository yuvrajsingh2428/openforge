import { getAIProvider } from "@openforge/ai-analysis/src/providers/base";
import { InMemoryCache, buildCacheKey } from "@openforge/ai-analysis/src/cache";
import { parseAIResponse } from "@openforge/ai-analysis/src/parsers";
import { AI_CONFIG } from "@openforge/config";
import { MentorSessionSchema } from "../schemas/mentor";
import type { MentorSession } from "../types";
import { ContextBuilder } from "./context-builder";
import {
  BaseSystemPrompt,
  RepositoryPromptBuilder,
  ReadingOrderPromptBuilder,
  StrategyPromptBuilder,
  DebuggingPromptBuilder,
  ChecklistPromptBuilder,
  LearningPromptBuilder
} from "../prompts/mentor-prompts";

const cache = new InMemoryCache();
const MENTOR_PROMPT_VERSION = "v1.0.0";

export class MentorService {
  public static async generateMentorSession(
    owner: string,
    repo: string,
    issue: { number: number; title: string; body: string }
  ): Promise<MentorSession> {
    const cacheKey = buildCacheKey(
      "mentor-session",
      `${owner}/${repo}#${issue.number}`,
      MENTOR_PROMPT_VERSION,
      AI_CONFIG.model
    );

    const cached = cache.get<MentorSession>(cacheKey);
    if (cached) {
      return cached;
    }

    const context = await ContextBuilder.build(owner, repo, issue);

    const provider = getAIProvider();
    const availability = await provider.isAvailable();
    if (!availability.available) {
      throw new Error(`AI Provider not available: ${availability.message}`);
    }

    const systemPrompt = BaseSystemPrompt;
    
    const userPrompt = `
You are creating an Engineering Mentor Session for:
Repository: ${owner}/${repo}
Issue: #${issue.number} ${issue.title}
Body: ${issue.body}

${RepositoryPromptBuilder(context.snapshot.owner + "/" + context.snapshot.repo, context.architecture)}
${ReadingOrderPromptBuilder(context.journey)}
${StrategyPromptBuilder(context.journey)}
${DebuggingPromptBuilder(context.repoMap.directories, context.repoMap.entryPoints)}
${ChecklistPromptBuilder()}
${LearningPromptBuilder()}

Please structure the output JSON to match this Zod schema:
{
  repoOwner: string,
  repoName: string,
  issueNumber: number,
  generatedAt: string,
  repositoryOverview: string,
  issueUnderstanding: string,
  concepts: Array<{ name: string, description: string, difficulty: "Beginner" | "Intermediate" | "Advanced" }>,
  prerequisites: Array<string>,
  readingOrder: Array<{ path: string, explanation: string }>,
  strategySteps: Array<{ stepNumber: number, title: string, guidelines: string }>,
  debugGuide: {
    rootCauses: Array<string>,
    relevantFiles: Array<string>,
    affectedTests: Array<string>,
    logsToWatch: Array<string>,
    verificationSteps: Array<string>
  },
  reviewChecklist: Array<{ id: string, category: "Tests" | "Formatting" | "Documentation" | "Edge Cases" | "Backward Compatibility", description: string, verificationMethod: string }>,
  learningOutcomes: Array<string>,
  commonMistakes: Array<string>,
  warnings: Array<string>
}
`;

    let retries = 0;
    const maxRetries = 2;
    let extraWarning = "";

    while (retries <= maxRetries) {
      const messages = [
        { role: "system" as const, content: systemPrompt + extraWarning },
        { role: "user" as const, content: userPrompt }
      ];

      const response = await provider.chat(messages);
      
      try {
        const data = parseAIResponse<any>(response.content, MentorSessionSchema);
        
        // Validation: Verify no code snippets in generated strings
        const codeDetected = this.detectCodeSnippets(data);
        if (codeDetected) {
          retries++;
          extraWarning = `\nWARNING: Your previous response contained code snippets or patches (e.g. \`const\`, \`function\`, or markdown code blocks). You MUST NOT output any code blocks or snippets. Keep all explanations conceptual.`;
          continue;
        }

        // Enforce deterministic values
        data.repoOwner = owner;
        data.repoName = repo;
        data.issueNumber = issue.number;
        data.generatedAt = new Date().toISOString();

        // Enforce matching the Reading Order from deterministic outputs
        data.readingOrder = context.journey.map(step => {
          const item = data.readingOrder.find((r: any) => r.path === step.nodeId);
          return {
            path: step.nodeId || "unknown",
            explanation: item?.explanation || `Explaining relevance of ${step.title}`
          };
        });

        cache.set(cacheKey, data);
        return data as MentorSession;
      } catch (err: any) {
        retries++;
        extraWarning = `\nWARNING: Failed to parse output against the Zod schema: ${err.message}. Ensure valid JSON matching the format.`;
      }
    }

    throw new Error("Engineering Mentor failed to generate a valid session without code snippets after retrying.");
  }

  private static detectCodeSnippets(data: any): boolean {
    const str = JSON.stringify(data);
    // Simple heuristics to check if code or codeblocks were outputted
    if (str.includes("```") || str.includes("const ") || str.includes("function ") || str.includes("import ") || str.includes("class ")) {
      return true;
    }
    return false;
  }
}
