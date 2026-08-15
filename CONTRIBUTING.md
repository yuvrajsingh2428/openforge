# Contributing to OpenForge ⚒️

Thank you for your interest in contributing to OpenForge! We welcome contributions of all kinds, including code, documentation, bug reports, and feature proposals.

---

## Development Setup

### 1. Prerequisites
- **Node.js**: `v20.x` or higher
- **npm**: `v10.x` or higher
- **Git**: Recent version

### 2. Fork & Clone
```bash
git clone https://github.com/YOUR-USERNAME/openforge.git
cd openforge
```

### 3. Install & Link Workspace
```bash
npm install
```

### 4. Configure Environment
```bash
cp .env.example .env
```
Fill in your `GITHUB_TOKEN` and preferred `AI_PROVIDER` (see `README.md` for options).

---

## Development Workflow

### Commands

| Task | Command |
|---|---|
| Start Dev Server | `npm run dev` |
| Typecheck All Packages | `npm run typecheck` |
| Lint Codebase | `npm run lint` |
| Run Unit Tests | `npm run test` |
| Run Validation Suite | `npm run check` (Lint + Typecheck + Test) |
| Full Production Validation | `npm run validate` (Check + Build) |
| Run E2E Tests | `npm run e2e` |

---

## Commit Guidelines

We enforce **Conventional Commits** via Commitlint and Husky hooks:

- `feat: add new recommendation signal`
- `fix: resolve issue analysis retry logic`
- `docs: update deployment guide in README`
- `test: add unit test for GitHub client error handling`

---

## Pull Request Checklist

Before submitting a Pull Request, ensure:

1. `npm run validate` completes with zero errors.
2. All unit tests and E2E tests pass.
3. Code style follows established patterns across monorepo packages.
4. Documentation is updated if relevant.