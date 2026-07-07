export const AI_KEYWORDS = [
  "ai", "llm", "agent", "mcp", "inference", "prompt",
  "embeddings", "vector", "evaluation", "rag", "reasoning",
  "transformer", "model", "neural", "machine learning",
  "deep learning", "nlp", "natural language", "chatbot",
  "fine-tuning", "tokenizer", "attention", "diffusion",
  "generative", "classification", "reinforcement",
  "langchain", "openai", "anthropic", "ollama",
] as const;

export type AIKeyword = (typeof AI_KEYWORDS)[number];
