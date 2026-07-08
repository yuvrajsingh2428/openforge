# Architecture

OpenForge is a monorepo built using Turborepo and npm workspaces.

## Apps
- `apps/web`: Next.js 14 App Router application

## Packages
- `packages/ai-analysis`: Integrates with LLMs for text summarization
- `packages/config`: Shared configuration
- `packages/github-client`: GraphQL API wrappers
- `packages/issue-engine`: Evaluates contribution effort
- `packages/recommendation-engine`: Scores issues across 5 factors
- `packages/repository-intelligence`: Health Analysis