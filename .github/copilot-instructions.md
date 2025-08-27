# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

A TypeScript CLI metapackage that displays Dave Williams' profile with animated terminal effects. Published as `dave.io` on npm and `@daveio/npm` on GitHub Packages.

### Tech Stack
- **Runtime**: Bun (v1.2.19) - exclusive runtime, no Node.js fallback
- **Language**: TypeScript with ES2022 target
- **Linting**: Biome with custom rules via Trunk
- **Testing**: Bun's built-in test runner
- **CI/CD**: GitHub Actions for testing, linting, and dual publishing (npm + GitHub Packages)
- **Containerization**: Alpine-based Docker image with non-root user

### Key Architecture Patterns

```plaintext
src/
├── cmd.ts          # CLI entry point wrapper (shebang, error handling)
├── index.ts        # Core business logic (animations, table rendering)
├── index.test.ts   # Unit tests using Bun test framework
└── types/          # Custom type definitions for untyped dependencies
```

**Execution Flow**:
1. `cmd.ts` invokes `index.ts` with error handling
2. `index.ts` displays animated intro, renders social links table
3. Terminal link OSC-8 sequences make URLs clickable
4. Update notifier checks for new package versions

## Development Commands

### Essential Commands

```bash
# Install dependencies
bun install

# Run locally without building
bun run start

# Build for production (minified with sourcemaps)
bun run build

# Run tests
bun test

# Lint code
bun run lint

# Auto-fix lint issues
bun run lint:fix

# Clean build artifacts
bun run clean
```

### Docker Commands

```bash
# Build and run Docker container
bun run docker

# Build Docker image only
bun run docker:build

# Run existing Docker image
bun run docker:run
```

### Running a Single Test

```bash
# Run specific test file
bun test src/index.test.ts

# Run tests matching pattern
bun test --grep "logs the expected"
```

## Build & Release Workflow

### Local Build Process
1. TypeScript compilation via `bun build`
2. Target: Node.js compatible output
3. Minification and sourcemap generation
4. Output to `dist/` directory

### Release Process
1. Create and push a git tag (triggers `.github/workflows/npm.yaml`)
2. CI automatically:
   - Extracts version from tag
   - Updates package.json version
   - Builds the package
   - Publishes to npm registry as `dave.io`
   - Renames package to `@daveio/npm` for GitHub Packages
   - Publishes to GitHub Packages with provenance

### Manual Publishing
```bash
# Prepare for publishing (runs lint, test, build)
bun run prepublishOnly

# Publish to npm (requires NPM_TOKEN)
bun x npm publish --provenance --access public
```

## Testing Strategy

- **Framework**: Bun's built-in test runner (no Jest/Vitest needed)
- **Location**: Test files colocated with source (`*.test.ts`)
- **Mocking**: Uses Bun's `spyOn` for console output capture
- **CI Integration**: Runs on all PRs and pushes to main

### Writing Tests

```typescript
import { describe, it, expect, beforeEach, spyOn } from 'bun:test'

describe('feature', () => {
  it('should work', () => {
    expect(true).toBe(true)
  })
})
```

## Code Quality Tools

### Biome Configuration
- Extended from `.trunk/configs/biome.json`
- Custom style rules enforced:
  - `useAsConstAssertion`
  - `useEnumInitializers`
  - `useSingleVarDeclarator`
  - `noInferrableTypes`

### Trunk Integration
- CI enforcement via `trunk-io/trunk-action`
- Local checking: `trunk check`
- Auto-formatting: `trunk fmt`

### Type Safety
- Strict TypeScript configuration
- Custom type definitions in `src/types/` for untyped packages
- `noImplicitAny` and `noEmitOnError` enabled

## Docker Architecture

### Build Strategy
- Alpine Linux base (3.22.1) for minimal size
- Non-root user `dave-io` (UID 1000)
- Bun installed via official installer script
- Layer caching optimized (package files copied first)
- Healthcheck configured for container monitoring

### Security Considerations
- Pinned dependency versions in Dockerfile
- Shell with pipefail for error propagation
- Minimal attack surface with Alpine
- Non-root execution context

## Dependency Management

### Package Boundaries
- **Dependencies**: Runtime packages (chalk, ora, cli-table3, etc.)
- **DevDependencies**: Build tools only (typescript, @biomejs/biome, @types/bun)
- **Trusted Dependencies**: `@biomejs/biome` (allows lifecycle scripts)

### Version Management
- Bun lockfile (`bun.lock`) for deterministic installs
- Tool versions managed via `mise.toml`
- Dependabot configured for automated updates

## Animation & Terminal Features

### Key Capabilities
- Rainbow gradient animations via `chalk-animation`
- OSC-8 hyperlink sequences for clickable URLs
- Progress spinners with `ora`
- Table rendering with `cli-table3`
- Update notifications via `update-notifier`

### Terminal Link Pattern
```typescript
const terminalLink = (text: string, url: string): string => {
  return `\u001B]8;;${url}\u0007${text}\u001B]8;;\u0007`
}
```

## CI/CD Workflows

### Continuous Integration (`ci.yaml`)
- Triggers: PRs and pushes to main
- Jobs: lint (Trunk) and test (Bun)
- Ubuntu latest runners

### NPM Publishing (`npm.yaml`)
- Triggers: Git tags only
- Dual publishing to npm and GitHub Packages
- Provenance attestation for supply chain security
- Automatic version extraction from git tag

### Security Scanning
- DevSkim analysis (`devskim.yaml`)
- Docker image builds and pushes (`docker.yaml`)
