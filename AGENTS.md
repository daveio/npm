# dave.io - Meta Package

## Overview

This is a personal meta package/CLI tool for Dave Williams that displays professional information and social media links in a visually appealing terminal interface.

## Architecture

### Entry Points

- **CLI Entry:** [src/cmd.ts](src/cmd.ts) - Command-line interface entry point
- **Programmatic Entry:** [src/index.ts](src/index.ts) - Main function export for programmatic use

### Key Components

#### Main Display ([src/index.ts](src/index.ts))

The main module exports an async function that:

1. **Update Check** (lines 11-14): Uses `update-notifier` to check for package updates
2. **Loading Animation** (lines 35-42): Displays a spinner while "loading" the profile (2s delay)
3. **Title Display** (lines 44-58): Renders an ASCII art box with name and version using gradient colors
4. **Intro Animation** (lines 60-70): Shows an animated rainbow introduction text, then replaces it with a gradient version
5. **Social Links Table** (lines 72-212): Displays a borderless table containing:
   - Personal website link
   - Pronouns (they/them) with explainer link
   - Social media links (Bluesky, GitHub, Instagram, LinkedIn, Mastodon, etc.)
   - Professional links (CV, TODO list, talks, stories)

All links use OSC-8 hyperlinks for clickable terminal links.

#### Command Entry ([src/cmd.ts](src/cmd.ts))

- Imports and executes the main function from [index.ts](src/index.ts)
- Catches and logs any errors
- Exits with code 1 on error

### Technologies & Dependencies

- **Runtime:** Bun (development) / Node.js (production)
- **Language:** TypeScript (compiles to JavaScript)
- **Build:** Bun bundler with minification and source maps
- **Linter:** Biome
- **Test Framework:** Bun test

### Build Process

The build process ([package.json](package.json) line 29):
1. Cleans the `dist/` directory
2. Bundles `src/index.ts` and `src/cmd.ts` with Bun
3. Targets Node.js runtime
4. Enables minification and source maps
5. Outputs to `dist/` directory

### Configuration Files

- [tsconfig.json](tsconfig.json): TypeScript configuration (ES2022, NodeNext modules, strict mode)
- [biome.json](biome.json): Linter rules and code style configuration
- [Dockerfile](Dockerfile): Multi-stage Alpine-based container build
- [package.json](package.json): Package metadata, scripts, and dependencies

### Docker Setup

The [Dockerfile](Dockerfile) creates a minimal Alpine-based container that:
- Installs Bun runtime
- Installs dependencies
- Builds the project
- Runs the compiled JavaScript CLI
- Includes health checks

### Testing

Tests are in [src/index.test.ts](src/index.test.ts) and verify:
- Console output contains expected content
- Main website URL is displayed
- Social links are present

### Type Definitions

Custom type definitions in `src/types/`:
- [cli-table3.d.ts](src/types/cli-table3.d.ts): Type definitions for cli-table3
- [chalk-animation.d.ts](src/types/chalk-animation.d.ts): Type definitions for chalk-animation
- [chalk.d.ts](src/types/chalk.d.ts): Type definitions for chalk

## Development Workflow

```bash
# Start dev server
bun run start

# Run tests
bun run test

# Lint code
bun run lint

# Fix lint issues
bun run lint:fix

# Build for production
bun run build

# Build and run Docker container
bun run docker
```

## Known Issues

None currently.

## Future Enhancements

From [README.md](README.md):
- Add `--cv` / `-c` parameter to dump CV
- Fetch links and CV from personal API (<https://github.com/daveio/dave-io>)
- Always maintain static fallback
