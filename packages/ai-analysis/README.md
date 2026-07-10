# @openforge/ai-analysis

Interacts with LLMs (e.g. Ollama) using dynamic prompt builders, caching, and validation wrappers.

## Architecture
- **AIProvider**: Custom providers wrapper implementing `chat()` and availability status checks.
- **InMemoryCache**: Caches LLM response values with MD5 signature checks.
- **Parsers**: Safe JSON extraction regex parser verifying and mapping valid objects.
