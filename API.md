# OpenForge REST API Reference

All OpenForge REST endpoints are served under `/api` and return a standard response envelope.

---

## Response Envelope Standard

Every API response follows the `ApiResponseEnvelope` structure:

```json
{
  "success": true,
  "data": { ... },
  "error": null,
  "meta": {
    "cached": false,
    "durationMs": 142
  }
}
```

Error responses:

```json
{
  "success": false,
  "data": null,
  "error": "Human-readable error description",
  "meta": {}
}
```

---

## Endpoints

### 1. System & Health

#### `GET /api/health`
Returns system status, uptime, and AI provider connectivity.

- **Response:** Status 200
  ```json
  {
    "success": true,
    "data": {
      "status": "healthy",
      "timestamp": "2026-08-15T10:00:00.000Z",
      "uptime": 142.5,
      "ai": {
        "provider": "ollama",
        "connected": true,
        "model": "qwen3:8b"
      }
    }
  }
  ```

#### `GET /api/version`
Returns public version details and environment mode.

#### `GET /api/config`
Returns whitelisted client options (AI provider name, model, application name).

---

### 2. Repositories

#### `GET /api/repositories`
Retrieves curated list of repositories enriched with OpenForge categories.

#### `GET /api/repository-health?owner={owner}&repo={repo}`
Analyzes repository maintenance metrics, issue response times, release cadence, and documentation signals.

#### `GET /api/repositories/{owner}/{repo}/intelligence`
Generates deep repository architecture intelligence, dependency graph, contributor journey timeline, and directory map.

---

### 3. Issues & Recommendations

#### `GET /api/issues`
Retrieves open issues from curated repositories.

#### `GET /api/recommendations`
Generates scored issue recommendations across all curated repositories using the 5-factor scoring engine.

#### `GET /api/recommendations/{issueId}/breakdown`
Retrieves factor-by-factor scoring breakdown and explanations for a specific issue ID (`owner-repo-number`).

#### `GET /api/contribution-estimate?owner={owner}&repo={repo}&number={number}`
Estimates contribution effort level (Small, Medium, Large) based on issue parameters.

---

### 4. AI Analysis & Engineering Mentor

#### `GET /api/issues/{owner}/{repo}/{number}/analysis`
Generates comprehensive AI issue analysis (summary, required skills, concepts to learn, likely files, implementation strategy, testing guide, and pitfalls).

#### `POST /api/ai/summary`
Generates a plain-language summary of an issue body.

#### `POST /api/ai/contribution-plan`
Generates step-by-step contribution plan.

#### `POST /api/ai/complexity`
Analyzes issue complexity.

#### `POST /api/ai/learning-path`
Generates skill prerequisites and learning path for an issue.

#### `GET /api/repositories/{owner}/{repo}/issues/{number}/mentor/session`
Retrieves personalized AI mentor session guiding open-source onboarding.

---

### 5. Search

#### `GET /api/search/repositories?q={query}&language={lang}&architecture={arch}`
Executes live search against GitHub repositories with optional tech stack filters.