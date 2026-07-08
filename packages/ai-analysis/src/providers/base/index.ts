import { OllamaProvider } from "../ollama";
import type { AIProvider } from "../../types";

let _provider: AIProvider | null = null;

export function getAIProvider(): AIProvider {
  if (!_provider) {
    _provider = new OllamaProvider();
  }
  return _provider;
}

export function resetAIProvider(): void {
  _provider = null;
}
