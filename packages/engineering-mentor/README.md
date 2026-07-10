# @openforge/engineering-mentor

This package provides the AI Engineering Mentor orchestrator, prompt builders, context resolvers, validation checks, and retries.

## Architecture & Educational Philosophy
Our mentor serves to educate open-source contributors on how to approach, comprehend, and solve issues without writing any code or patches for them.

- **Socratic & Concepts First**: Explains the core concepts, detected architectures, and dependencies required to understand an issue.
- **Reading Order**: Dictates a logical order for reviewing files, drawing explanations for each file dynamically from the repository snapshot context.
- **Strict Guidelines**: Validates LLM responses to ensure absolutely no programming code blocks or patches are produced, triggering retries and failing gracefully if guidelines are violated.
- **Independent Boundary**: Integrates with existing AI Analyses, Recommendation Engines, and Repository Intelligence layers without introducing side-effects or changing scores.
