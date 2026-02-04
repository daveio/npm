# Agent Guide for dave.io/npm

This repository contains the source code for the `dave.io` npm package, a CLI-based "business card" for Dave Williams.

## ⚡️ Quick Start

This project uses **Bun** for package management, script execution, and testing.

```bash
# Install dependencies
bun install

# Run the CLI locally
bun run start

# Run tests
bun test
```

## 🛠 Project Structure

- **Runtime**: Bun (check `bun.lock`)
- **Language**: TypeScript
- **Linter/Formatter**: Biome (`biome.json`)
- **Entry Points**:
  - `src/index.ts`: Core logic (exports default async function).
  - `src/cmd.ts`: CLI executable wrapper (calls `index.ts`).
- **Tests**: `src/index.test.ts` (uses `bun:test`).
- **Types**: `src/types/` contains declarations for untyped dependencies.

## 🤖 Common Commands

| Command | Description |
|---------|-------------|
| `bun run start` | Run the CLI tool locally |
| `bun run build` | Build for Node.js target (outputs to `dist/`) |
| `bun run test` | Run unit tests |
| `bun run lint` | Check code style with Biome |
| `bun run lint:fix` | Auto-fix code style issues |
| `bun run docker` | Build and run the Docker container |
| `bun run tape` | Record terminal demo (requires `vhs` and `gif2webp`) |

## 🏗 Architecture & Patterns

### CLI Output
- **Styling**: Uses `chalk` for colors and `gradient-string` for gradients.
- **Animation**: Uses `chalk-animation` and `ora` spinners.
- **Layout**: Uses `cli-table3` for the links table.
- **Hyperlinks**: Uses OSC-8 escape sequences via a helper function to make links clickable.

### Code Style
- **Formatting**: Strict adherence to Biome rules.
- **Imports**: ES Modules (`import`/`export`).
- **Async/Await**: Used heavily for animations (e.g., `sleep` helper).
- **Type Safety**: TypeScript used throughout. `src/types/` covers missing `@types/*` packages.

## 🧪 Testing

- **Runner**: Native `bun:test`.
- **Mocking**: `spyOn(console, 'log')` is used to capture and verify CLI output.
- **Pattern**: Tests run against the exported function from `src/index.ts`, not the CLI wrapper.

## ⚠️ Gotchas & Notes

1. **Node.js Compatibility**: While developed with Bun, the build targets Node.js (`--target node`) for wider distribution via npm.
2. **Type Definitions**: Some dependencies (`chalk-animation`, `update-notifier`) lack official types. Check `src/types/` before adding `@ts-ignore`.
3. **Animations**: The code uses `process.stdout.write` with ANSI escape codes to overwrite lines for animations.
4. **Environment**: `mise.toml` locks the Bun version.
