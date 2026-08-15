# Vercel Production Deployment Guide — OpenForge

This guide outlines the step-by-step instructions for deploying OpenForge to [Vercel](https://vercel.com).

---

## 1. Prerequisites

- A [Vercel Account](https://vercel.com/signup) connected to your GitHub account.
- A GitHub Personal Access Token (PAT) with `public_repo` (read-only) scope.
- An OpenRouter API Key (from [OpenRouter.ai](https://openrouter.ai/keys)).
- A PostHog Project API Key and Host URL (from [PostHog.com](https://posthog.com)).

---

## 2. Project Settings on Vercel

When importing the OpenForge repository into Vercel:

| Setting | Recommended Value |
| :--- | :--- |
| **Framework Preset** | Next.js |
| **Root Directory** | `apps/web` |
| **Build Command** | `cd ../.. && npx turbo run build --filter=web...` (or standard `npm run build`) |
| **Install Command** | `npm install` |
| **Output Directory** | `.next` |
| **Node.js Version** | `20.x` |

---

## 3. Environment Variables Reference Table

Configure the following environment variables in the Vercel Dashboard under **Project Settings > Environment Variables**:

| Name | Required | Default / Recommended | Example | Description |
| :--- | :---: | :--- | :--- | :--- |
| `GITHUB_TOKEN` | Yes | — | `github_pat_11A...` | Read-only GitHub PAT for GraphQL and REST queries. |
| `GITHUB_API_URL` | No | `https://api.github.com/graphql` | `https://api.github.com/graphql` | GitHub GraphQL API endpoint. |
| `GITHUB_REST_API_URL` | No | `https://api.github.com` | `https://api.github.com` | GitHub REST API base URL. |
| `GITHUB_USER_AGENT` | No | `OpenForge` | `OpenForge` | Custom User-Agent header sent to GitHub API. |
| `AI_PROVIDER` | Yes | `openrouter` | `openrouter` | AI provider selector (`ollama` \| `openrouter`). Set to `openrouter` in production. |
| `OPENROUTER_API_KEY` | Yes | — | `sk-or-v1-...` | API key from OpenRouter.ai. |
| `OPENROUTER_MODEL` | No | `deepseek/deepseek-chat-v3` | `deepseek/deepseek-chat-v3` | Primary OpenRouter LLM model for issue analysis and mentoring. |
| `OPENROUTER_BASE_URL` | No | `https://openrouter.ai/api/v1` | `https://openrouter.ai/api/v1` | OpenRouter API base URL. |
| `OPENROUTER_HTTP_REFERER`| No | `https://openforge.dev` | `https://your-domain.vercel.app` | Referer header sent to OpenRouter API. |
| `OPENROUTER_APP_NAME` | No | `OpenForge` | `OpenForge` | Application identifier sent to OpenRouter API. |
| `NEXT_PUBLIC_APP_URL` | Yes | — | `https://your-domain.vercel.app` | Public canonical base URL for OpenGraph and sitemap generation. |
| `NEXT_PUBLIC_POSTHOG_KEY`| Yes | — | `phc_...` | Public PostHog project API key. |
| `NEXT_PUBLIC_POSTHOG_HOST`| Yes | `https://us.i.posthog.com` | `https://us.i.posthog.com` | PostHog ingestion host endpoint. |
| `CACHE_ENABLED` | No | `true` | `true` | Enables/disables server caching. |
| `CACHE_TTL` | No | `3600` | `3600` | Server cache TTL in seconds. |
| `ENABLE_AI` | No | `true` | `true` | Feature flag for AI issue analysis features. |
| `ENABLE_RECOMMENDATIONS` | No | `true` | `true` | Feature flag for 5-factor recommendation engine. |
| `ENABLE_MENTOR` | No | `true` | `true` | Feature flag for engineering mentor sessions. |
| `ENABLE_REPOSITORY_INTELLIGENCE` | No | `true` | `true` | Feature flag for repository graph analysis. |

---

## 4. Post-Deployment Verification Protocol

After Vercel completes deployment:

1. **Verify Health Endpoint**:
   ```bash
   curl -i https://your-domain.vercel.app/api/health
   ```
   Expect: `{"success":true,"data":{"status":"healthy","ai":{"provider":"openrouter","connected":true,...}}}`

2. **Verify Version Endpoint**:
   ```bash
   curl -i https://your-domain.vercel.app/api/version
   ```
   Expect: `{"success":true,"data":{"version":"1.0.0",...}}`

3. **Verify Sitemap & Robots**:
   - Access `https://your-domain.vercel.app/sitemap.xml`
   - Access `https://your-domain.vercel.app/robots.txt`

4. **Verify Key Page Routes**:
   - Repository Explorer: `https://your-domain.vercel.app/repositories`
   - Issue Explorer: `https://your-domain.vercel.app/issues`
   - Recommendations: `https://your-domain.vercel.app/recommendations`
   - Mentor: `https://your-domain.vercel.app/mentor`
   - Search: `https://your-domain.vercel.app/search?q=react`

---

## 5. Rollback Strategy

In case of any unexpected API rate limiting or provider outage:
- To roll back to a previous deployment in Vercel:
  1. Open Vercel Dashboard > **Deployments**.
  2. Locate the previous stable build.
  3. Click **Instant Rollback**.
