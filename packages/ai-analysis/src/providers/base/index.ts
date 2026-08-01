import type { AIProvider } from "../../types";
import { createAIProvider } from "../../factory/providerFactory";

let _provider: AIProvider | null = null;

export function getAIProvider(): AIProvider {
  if (!_provider) {
    _provider = createAIProvider();
  }
  return _provider;
}

export function resetAIProvider(): void {
  _provider = null;
}
