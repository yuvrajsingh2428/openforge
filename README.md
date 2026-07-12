# OpenForge ⚒️

OpenForge is a production-ready AI-powered developer tool that analyzes GitHub repositories, estimates issue contributions, and recommends open-source work based on learning paths and AI relevance.

## Features

- **Repository Intelligence** — Architecture detection, dependency analysis, knowledge graphs
- **AI-Powered Analysis** — Issue summaries, complexity analysis, learning paths via Ollama
- **Smart Recommendations** — Multi-factor scoring across learning impact, AI relevance, and maintainer friendliness
- **Contribution Planning** — AI-generated step-by-step contribution plans
- **Engineering Mentor** — AI mentor guiding open-source contributions
- **Search** — Full-text search across curated repositories and issues

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/yuvrajsingh2428/openforge.git
cd openforge
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

**Linux / macOS:**

```bash
cp .env.example .env
```

**Windows PowerShell:**

```powershell
Copy-Item .env.example .env
```

Open `.env` and configure the required values (see [Environment Variables](#environment-variables) below).

### 4. Set up GitHub Token

1. Go to [GitHub → Settings → Personal Access Tokens](https://github.com/settings/tokens)
2. Click **Generate new token (classic)**
3. Select the `public_repo` scope (read-only access to public repositories)
4. Copy the token and paste it into your `.env` file:

```env
GITHUB_TOKEN=ghp_your_token_here
```

### 5. Install Ollama (for AI features)

Ollama runs AI models locally. Download from [ollama.com/download](https://ollama.com/download).

After installing, pull the required models:

```bash
ollama pull qwen3:8b
ollama pull gemma3:latest
ollama pull nomic-embed-text
```

> **Note:** AI features are optional. The app starts and works for repository browsing without Ollama.

### 6. Run the development server

```bash
npm run dev
```

### 7. Open the app

Navigate to [http://localhost:3000](http://localhost:3000)

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `NODE_ENV` | No | `development` | Environment mode (`development` / `production` / `test`) |
| `GITHUB_TOKEN` | **Yes**\* | — | GitHub Personal Access Token for API access |
| `GITHUB_API_URL` | No | `https://api.github.com/graphql` | GitHub GraphQL API endpoint |
| `GITHUB_REST_API_URL` | No | `https://api.github.com` | GitHub REST API endpoint |
| `GITHUB_USER_AGENT` | No | `OpenForge` | User-Agent header for GitHub requests |
| `OLLAMA_BASE_URL` | No | `http://localhost:11434` | Ollama server URL |
| `OLLAMA_CHAT_MODEL` | No | `qwen3:8b` | Model for conversational AI |
| `OLLAMA_SUMMARY_MODEL` | No | `gemma3:latest` | Model for text summarization |
| `OLLAMA_EMBEDDING_MODEL` | No | `nomic-embed-text` | Model for vector embeddings |
| `OLLAMA_TIMEOUT` | No | `120000` | AI request timeout (ms) |
| `CACHE_ENABLED` | No | `true` | Enable in-memory caching |
| `CACHE_TTL` | No | `3600` | Cache time-to-live (seconds) |
| `MAX_REPOSITORY_FILES` | No | `10000` | Max files to process per repo |
| `MAX_REPOSITORY_DEPTH` | No | `8` | Max directory traversal depth |
| `SEARCH_PAGE_SIZE` | No | `20` | Results per search page |
| `SEARCH_MAX_RESULTS` | No | `100` | Maximum total search results |
| `LOG_LEVEL` | No | `info` | Log level (`debug` / `info` / `warn` / `error`) |
| `DEBUG_MODE` | No | `false` | Enable debug mode |

\* `GITHUB_TOKEN` is required for GitHub API features but the app can start without it for UI development.

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build all packages and the web app |
| `npm run lint` | Run linters across all packages |
| `npm run test` | Run all unit tests |
| `npm run test:coverage` | Run tests with coverage reporting |
| `npm run typecheck` | Type-check all packages |
| `npm run check` | Run lint, typecheck, and tests |
| `npm run validate` | Full validation: lint → typecheck → test → build |
| `npm run clean` | Remove build artifacts |
| `npm run format` | Format code with Prettier |
| `npm run bench` | Run performance benchmarks |
| `npm run e2e` | Run end-to-end Playwright tests |

## Architecture

OpenForge is a monorepo built with **Turborepo** and **npm workspaces**.

### Apps

- `apps/web` — Next.js 16 App Router application

### Packages

- `@openforge/config` — Centralized configuration and environment validation
- `@openforge/ai-analysis` — LLM integration for text summarization and analysis
- `@openforge/github-client` — GitHub GraphQL API wrappers
- `@openforge/issue-engine` — Issue contribution effort evaluation
- `@openforge/recommendation-engine` — Multi-factor issue scoring engine
- `@openforge/repository-intelligence` — Repository health and architecture analysis
- `@openforge/engineering-mentor` — AI-powered engineering mentoring
- `@openforge/shared-types` — Shared TypeScript type definitions
- `@openforge/shared-utils` — Shared utility functions
- `@openforge/benchmarks` — Performance benchmarks

## Troubleshooting

### Application won't start

**Symptom:** Error on startup about invalid environment configuration.

**Fix:** Ensure your `.env` file exists and contains valid values. Compare against `.env.example`:

```bash
# Check your env file
cat .env
```

### GitHub API errors

**Symptom:** `GITHUB_TOKEN is required for GitHub API operations`

**Fix:**
1. Verify your token is set in `.env`
2. Ensure the token hasn't expired
3. Check the token has `public_repo` scope
4. Test your token:

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" https://api.github.com/user
```

### Ollama not running

**Symptom:** AI features show errors or timeouts.

**Fix:**
1. Ensure Ollama is installed: [ollama.com/download](https://ollama.com/download)
2. Start the Ollama service:

**Linux / macOS:**

```bash
ollama serve
```

**Windows:**

Ollama runs as a system service after installation. Check the system tray icon.

3. Verify it's running:

```bash
curl http://localhost:11434/api/tags
```

### Missing AI models

**Symptom:** `model "qwen3:8b" is not installed`

**Fix:** Pull the required models:

```bash
ollama pull qwen3:8b
ollama pull gemma3:latest
ollama pull nomic-embed-text
```

### Port 3000 already in use

**Symptom:** `Error: listen EADDRINUSE: address already in use :::3000`

**Fix:**

**Linux / macOS:**

```bash
lsof -ti:3000 | xargs kill -9
```

**Windows PowerShell:**

```powershell
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force
```

## License

See [LICENSE](./LICENSE) for details.