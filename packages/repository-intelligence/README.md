# @openforge/repository-intelligence

This package provides repository analysis services including deterministic health analysis, a repository knowledge graph builder, file & technology analysis, dependency extraction, architecture pattern detection, and contributor journey generators.

## Modules

### 1. Repository Knowledge Graph
Constructs a queryable Directed Graph from a flat Repository Snapshot representation.
- **Node Types**: Repository, Directory, File, Dependency, Module, Test, Documentation, Example, EntryPoint.
- **Edge Types**: CONTAINS, DEPENDS_ON, IMPLEMENTS, TESTS, DOCUMENTS.

### 2. Dependency Detector
Parses package manifest files like `package.json`, `Cargo.toml`, `pyproject.toml`, `go.mod`, `pom.xml`, and `requirements.txt` to extract and categorize libraries into AI, Testing, Build, Database, Direct, or Dev dependencies.

### 3. Architecture Detector
Heuristically scans files to determine architecture confidence for monorepos, microservices, MVC, Hexagonal, Clean, and libraries.

### 4. Contributor Journey
Translates the queryable graph into an ordered list of tasks designed to ease contributors into the project structure.
