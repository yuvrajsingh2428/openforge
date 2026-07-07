# OpenForge

OpenForge is an open-source platform that helps developers discover meaningful open-source contributions based on engineering growth, learning impact, and maintainer friendliness.

## Architecture

This project uses a Turborepo monorepo with the following strict clean architecture:

- `apps/web`: Next.js 15 (App Router) Frontend, React 19, Tailwind CSS v4. Contains purely UI and presentation logic.
- `packages/config`: Project-wide constants, repository lists, and configuration. No hardcoded logic in business modules.
- `packages/shared-types`: Global Zod schemas and TypeScript interfaces.
- `packages/shared-utils`: Common functional utilities.
- `packages/github-client`: GitHub GraphQL API interaction.
- `packages/ai-analysis`: AI models integration (Ollama).
- `packages/recommendation-engine`: Ranking and suggestion algorithm.
- `packages/repository-intelligence`: Repository parsing and heuristics.
- `packages/issue-engine`: Issue difficulty grading and summarization.

## Setup Instructions

### Prerequisites
- Node.js >= 20
- npm >= 10
- A GitHub Personal Access Token (PAT)

### Environment Variables

Copy `.env.example` to `.env.local` and add your GitHub token:
```bash
GITHUB_TOKEN=your_token_here
```

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

### Running Tests (Phase 2)

```bash
npm run test
```

## Contributing

Please adhere to our core principles:
- Engineering quality over speed.
- Clean architecture over shortcuts.
- Readability over cleverness.
- Modular code over monolithic code.
- Production-ready code only.
