# API Reference

OpenForge exposes several internal APIs in `apps/web/src/app/api`.

## Endpoints
- `GET /api/search/repositories?q={query}`: Search GitHub repositories
- `GET /api/repositories/{owner}/{repo}`: Fetch details
- `GET /api/recommendations`: Get scored issues